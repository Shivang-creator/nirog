import bpy
from mathutils import Vector

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"c:\Projects\nirog-team\public\aria\chloe_avatar.glb")

print("=== MESHES ===")
for ob in bpy.context.scene.objects:
    if ob.type != "MESH":
        continue
    lo = Vector((1e9, 1e9, 1e9)); hi = Vector((-1e9, -1e9, -1e9))
    for c in ob.bound_box:
        w = ob.matrix_world @ Vector(c)
        lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    ctr = (lo + hi) / 2
    dims = hi - lo
    shape_keys = len(ob.data.shape_keys.key_blocks) if ob.data.shape_keys else 0
    print(f"{ob.name:30s} ctr=({ctr.x:+.2f},{ctr.y:+.2f},{ctr.z:+.2f}) "
          f"dims=({dims.x:.2f},{dims.y:.2f},{dims.z:.2f}) verts={len(ob.data.vertices)} morphs={shape_keys}")

print("=== NON-MESH ===")
for ob in bpy.context.scene.objects:
    if ob.type != "MESH":
        print(f"{ob.type:10s} {ob.name}")

print("=== ACTIONS ===")
for a in bpy.data.actions:
    print(f"{a.name}  range={tuple(a.frame_range)}")
