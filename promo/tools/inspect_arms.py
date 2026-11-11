import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"c:\Projects\nirog-team\public\aria\chloe_avatar.glb")

arm = next(o for o in bpy.context.scene.objects if o.type == "ARMATURE")
print("=== ARM/SHOULDER BONES ===")
for b in arm.data.bones:
    n = b.name.lower()
    if any(k in n for k in ("clavicle", "shoulder", "upperarm", "forearm", "arm_", "_arm")):
        print(f"  {b.name}  head={tuple(round(v,2) for v in b.head_local)}  tail={tuple(round(v,2) for v in b.tail_local)}")

print("=== HEAD MORPHS ===")
head = next(o for o in bpy.context.scene.objects if o.type == "MESH" and "head" in o.name.lower())
for kb in head.data.shape_keys.key_blocks:
    print(f"  {kb.name}")
