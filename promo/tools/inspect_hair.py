import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"c:\Projects\nirog-team\public\aria\chloe_avatar.glb")

arm = next(o for o in bpy.context.scene.objects if o.type == "ARMATURE")
print("=== BONES (head/neck/spine) ===")
for b in arm.data.bones:
    if any(k in b.name.lower() for k in ("head", "neck", "spine", "hips", "root")):
        print(" ", b.name)

print("=== MESH BINDINGS ===")
for ob in bpy.context.scene.objects:
    if ob.type != "MESH":
        continue
    mods = [f"{m.type}->{getattr(m, 'object', None) and m.object.name}" for m in ob.modifiers]
    print(f"{ob.name:30s} parent={ob.parent and ob.parent.name!s:20s} "
          f"parent_type={ob.parent_type:12s} mods={mods} vgroups={len(ob.vertex_groups)}")

print("=== IDLE ACTION CHANNELS (sample) ===")
idle = bpy.data.actions.get("Idle")
if idle:
    names = set()
    try:
        for layer in idle.layers:
            for strip in layer.strips:
                for bag in strip.channelbags:
                    for fc in bag.fcurves:
                        names.add(fc.data_path.split('"')[1] if '"' in fc.data_path else fc.data_path)
    except AttributeError:
        pass
    print(sorted(names)[:40])
