"""
Cinematic intro shot of the ARIA avatar for the Nirog promo.

One continuous 315-frame (10.5 s) move: the camera starts wide on a rim-lit
silhouette and dollies into a close three-quarter portrait while orbiting,
with true depth of field pulling focus tighter as it closes in. Lit with the
brand's own colors — ARIA purple and Nirog blue rims over a warm key.

Run:  blender -b -P aria_intro.py
"""
import bpy
import math
from mathutils import Vector

GLB = r"c:\Projects\nirog-team\public\aria\chloe_avatar.glb"
OUT = r"c:\Projects\nirog-team\promo\public\footage\aria-intro.mp4"
FPS = 30
FRAMES = 315
RES = (1920, 1080)

# ---------------------------------------------------------------- scene reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS
scene.frame_start = 1
scene.frame_end = FRAMES
scene.render.resolution_x, scene.render.resolution_y = RES

for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
try:
    scene.eevee.taa_render_samples = 64
except AttributeError:
    pass
try:
    scene.eevee.use_raytracing = False
except AttributeError:
    pass
# Post-process DoF smears blown-out rim highlights into giant bokeh ghosts;
# clamp the max circle-of-confusion and jitter for quality.
for attr, val in (("bokeh_max_size", 32), ("use_bokeh_jittered", True)):
    try:
        setattr(scene.eevee, attr, val)
    except AttributeError:
        pass

# ---------------------------------------------------------------- import GLB
bpy.ops.import_scene.gltf(filepath=GLB)

# The GLB ships with an environment icosphere that wrecks the bounds — drop it.
for ob in list(bpy.context.scene.objects):
    if "Icosphere" in ob.name or "led" in ob.name.lower():
        bpy.data.objects.remove(ob, do_unlink=True)

# The GLB's "Idle" action targets hashed bone names from a different rig (the
# app retargets it in Three.js), so it mangles this armature. Instead: pose her
# by hand and keyframe a subtle performance — breathing, a slow head turn to
# the camera, two blinks, and a smile that grows as the shot closes in.
from mathutils import Matrix

armature = next(o for o in bpy.context.scene.objects if o.type == "ARMATURE")

# The importer leaves glTF node TRS on the pose bones — the hair physics bones
# import mid-simulation, tearing the ponytail away from the bun. Snap every
# bone back to rest before posing.
for pb in armature.pose.bones:
    pb.matrix_basis = Matrix.Identity(4)
bpy.context.view_layer.update()

def world_axis_in_arm(axis):
    return (armature.matrix_world.inverted().to_3x3() @ Vector(axis)).normalized()

def rotate_bone_world(name, axis, degrees):
    pb = armature.pose.bones[name]
    pivot = pb.matrix.translation.copy()
    rot = (Matrix.Translation(pivot)
           @ Matrix.Rotation(math.radians(degrees), 4, world_axis_in_arm(axis))
           @ Matrix.Translation(-pivot))
    pb.matrix = rot @ pb.matrix
    bpy.context.view_layer.update()

# Arms: A-pose -> relaxed at her sides. Right arm is +X; +Y world rotation
# swings +X toward -Z (down). Mirror for the left.
rotate_bone_world("Bip_UpperArmBase_R", (0, 1, 0), 30)
rotate_bone_world("Bip_UpperArmBase_L", (0, 1, 0), -30)
rotate_bone_world("Bip_UpperArm_R", (0, 1, 0), 28)
rotate_bone_world("Bip_UpperArm_R.001", (0, 1, 0), -28)  # left arm; asset misnames it

# The hair mesh carries a detached duplicate hair piece that renders as a
# floating ghost behind her head. Find its vertices in DEFORMED space (what
# the camera actually sees) and delete them from the mesh.
import bmesh
hair_ob = next(o for o in bpy.context.scene.objects if o.type == "MESH" and "hair" in o.name.lower())
head_mesh_tmp = next(o for o in bpy.context.scene.objects if o.type == "MESH" and "head" in o.name.lower())
_hl, _hh = Vector((1e9,) * 3), Vector((-1e9,) * 3)
for c in head_mesh_tmp.bound_box:
    w = head_mesh_tmp.matrix_world @ Vector(c)
    _hl = Vector(map(min, _hl, w)); _hh = Vector(map(max, _hh, w))
head_ctr = (_hl + _hh) / 2

bpy.context.scene.frame_set(1)
dg = bpy.context.evaluated_depsgraph_get()
hair_eval = hair_ob.evaluated_get(dg)
me = hair_eval.to_mesh()
bad = set()
for i, v in enumerate(me.vertices):
    w = hair_ob.matrix_world @ v.co
    horiz = (Vector((w.x, w.y)) - Vector((head_ctr.x, head_ctr.y))).length
    if horiz > 0.21:
        bad.add(i)
hair_eval.to_mesh_clear()
print(f"ghost hair verts: {len(bad)} / {len(hair_ob.data.vertices)}")

bm = bmesh.new()
bm.from_mesh(hair_ob.data)
bm.verts.ensure_lookup_table()
bmesh.ops.delete(bm, geom=[bm.verts[i] for i in sorted(bad)], context="VERTS")
bm.to_mesh(hair_ob.data)
bm.free()

def key_bone(name, frame):
    pb = armature.pose.bones[name]
    pb.keyframe_insert("rotation_quaternion", frame=frame)

# Head: starts turned slightly away, settles on the camera as we arrive.
rotate_bone_world("Bip_Head", (0, 0, 1), -4)
key_bone("Bip_Head", 1)
rotate_bone_world("Bip_Head", (0, 0, 1), 4)
key_bone("Bip_Head", 250)

# Breathing: gentle chest rock, ~4.5 s period.
spine = armature.pose.bones["Bip_Spine2"]
for f in range(1, FRAMES + 1, 15):
    rotate_bone_world("Bip_Spine2", (1, 0, 0),
                      0.7 * math.sin(2 * math.pi * f / 135) -
                      0.7 * math.sin(2 * math.pi * max(f - 15, 0) / 135))
    key_bone("Bip_Spine2", f)

# Facial morphs, applied to every mesh that has them (head + lashes).
def key_morph(name, frame, value):
    for ob in bpy.context.scene.objects:
        if ob.type != "MESH" or not ob.data.shape_keys:
            continue
        kb = ob.data.shape_keys.key_blocks.get(name)
        if kb:
            kb.value = value
            kb.keyframe_insert("value", frame=frame)

for start in (95, 235):  # two blinks
    key_morph("eyeBlink", start, 0.0)
    key_morph("eyeBlink", start + 4, 1.0)
    key_morph("eyeBlink", start + 9, 0.0)

key_morph("mouthSmile", 190, 0.0)   # she warms up as the camera closes in
key_morph("mouthSmile", 300, 0.38)
key_morph("browInnerUp", 190, 0.0)
key_morph("browInnerUp", 300, 0.14)

def bounds_of(objects):
    lo = Vector((1e9, 1e9, 1e9))
    hi = Vector((-1e9, -1e9, -1e9))
    for ob in objects:
        if ob.type != "MESH":
            continue
        for corner in ob.bound_box:
            w = ob.matrix_world @ Vector(corner)
            lo = Vector(map(min, lo, w))
            hi = Vector(map(max, hi, w))
    return lo, hi

lo, hi = bounds_of(bpy.context.scene.objects)
center = (lo + hi) / 2
height = hi.z - lo.z

# Focus on the actual head mesh, not a heuristic.
head_mesh = next(o for o in bpy.context.scene.objects if o.type == "MESH" and "head" in o.name.lower())
hlo, hhi = bounds_of([head_mesh])
head = (hlo + hhi) / 2
print(f"model bounds: lo={tuple(lo)}, hi={tuple(hi)}, head={tuple(head)}")

# Scale-aware distances: frame relative to model height.
D_FAR = height * 3.1
D_NEAR = height * 0.72

# ---------------------------------------------------------------- camera rig
def key(obj, path, frame, value, index=-1):
    if index >= 0:
        getattr(obj, path)[index] = value
    else:
        setattr(obj, path, value)
    obj.keyframe_insert(data_path=path, frame=frame, index=index)

focus = bpy.data.objects.new("focus", None)
scene.collection.objects.link(focus)
# Aim at the chest in the wide start (so the figure fills the frame), rising
# to the head as the shot tightens into a portrait.
key(focus, "location", 1, head + Vector((0, 0.05, -0.34)))
key(focus, "location", FRAMES, head + Vector((0, 0.06, 0.01)))

rig = bpy.data.objects.new("rig", None)
rig.location = Vector((center.x, center.y, 0))
scene.collection.objects.link(rig)

cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 65
cam_data.dof.use_dof = True
cam_data.dof.focus_object = focus
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
cam.parent = rig
scene.camera = cam

track = cam.constraints.new("TRACK_TO")
track.target = focus
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"

# Orbit: -38 deg -> +18 deg around the model.
key(rig, "rotation_euler", 1, math.radians(-38), index=2)
key(rig, "rotation_euler", FRAMES, math.radians(18), index=2)

# Dolly: far/high -> near/eye-level. She faces +Y, so the camera lives at +Y.
key(cam, "location", 1, Vector((0, D_FAR, head.z + height * 0.10)))
key(cam, "location", FRAMES, Vector((0, D_NEAR, head.z + height * 0.005)))

# Focus pulls shallower as we close in.
key(cam_data.dof, "aperture_fstop", 1, 3.2)
key(cam_data.dof, "aperture_fstop", FRAMES, 2.6)

# Keyframes default to auto-eased Bezier, which is the slow ease we want.
# (Blender 5.x removed Action.fcurves, so no post-hoc interpolation pass.)

# ---------------------------------------------------------------- lighting
def light(name, kind, loc, power, color, size=1.0):
    data = bpy.data.lights.new(name, kind)
    data.energy = power
    data.color = color
    if kind == "AREA":
        data.size = size
    ob = bpy.data.objects.new(name, data)
    ob.location = loc
    scene.collection.objects.link(ob)
    tr = ob.constraints.new("TRACK_TO")
    tr.target = focus
    tr.track_axis = "TRACK_NEGATIVE_Z"
    tr.up_axis = "UP_Y"
    return ob

s = height  # scale shorthand
light("key",      "AREA", head + Vector(( 1.4 * s, -1.2 * s,  0.35 * s)), 340 * s, (1.0, 0.93, 0.85), size=1.2 * s)
light("rim_aria", "AREA", head + Vector((-1.1 * s,  1.3 * s,  0.45 * s)), 330 * s, (0.55, 0.36, 0.96), size=0.9 * s)
light("rim_blue", "AREA", head + Vector(( 1.2 * s,  1.4 * s,  0.15 * s)), 250 * s, (0.18, 0.49, 0.96), size=0.9 * s)
light("fill",     "AREA", head + Vector((-1.5 * s, -1.5 * s, -0.10 * s)),  60 * s, (0.75, 0.80, 1.00), size=2.0 * s)

# Dark world + glossy floor for reflections.
world = bpy.data.worlds.new("world")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.008, 0.010, 0.020, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 1.0
scene.world = world

bpy.ops.mesh.primitive_plane_add(size=40 * s, location=(center.x, center.y, lo.z))
floor = bpy.context.active_object
mat = bpy.data.materials.new("floor")
mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.010, 0.012, 0.022, 1)
bsdf.inputs["Specular IOR Level"].default_value = 0.0
bsdf.inputs["Roughness"].default_value = 0.8
floor.data.materials.append(mat)

import os as _os
for frag in _os.environ.get("HIDE", "").split(","):
    if frag:
        for ob in bpy.context.scene.objects:
            if frag.lower() in ob.name.lower():
                ob.hide_render = True
                print("hidden:", ob.name)

# ---------------------------------------------------------------- output
import os
os.makedirs(os.path.dirname(OUT), exist_ok=True)

test_frame = os.environ.get("TEST_FRAME")
if test_frame:
    # Fast single-still sanity check of framing and lighting.
    scene.frame_set(int(test_frame))
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = OUT.replace(".mp4", f"-test-{test_frame}.png")
    bpy.ops.render.render(write_still=True)
else:
    # Blender 5.x dropped FFMPEG output - render PNG frames, assemble outside.
    frames_dir = os.path.join(os.path.dirname(OUT), "frames")
    os.makedirs(frames_dir, exist_ok=True)
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = os.path.join(frames_dir, "aria-")
    bpy.ops.render.render(animation=True)

print("DONE:", scene.render.filepath)
