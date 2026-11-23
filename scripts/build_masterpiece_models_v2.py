"""
Script Pemodelan 3D Masterpiece Objek Angkringan Pak Ilmu
Menggunakan Blender 5.0 CLI dengan Material PBR Bertekstur Autentik (Embedded Textures)
Mendukung ekspor langsung GLB untuk WebGL Three.js
"""

import bpy
import bmesh
import math
import os
import numpy as np

# Direktori Output
OUTPUT_DIR = r"C:\Users\USERR\.gemini\antigravity\scratch\angkringan-pak-ilmu\public\assets\models\items"
BLEND_PATH = r"C:\Users\USERR\.gemini\antigravity\scratch\angkringan-pak-ilmu\public\assets\models\angkringan_items.blend"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clear_all():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_image_texture(name, width, height, pixel_data):
    """Membuat datablock Image di Blender dari array numpy float32 RGBA (0.0 - 1.0)"""
    img = bpy.data.images.new(name, width=width, height=height, alpha=True)
    # pixel_data shape: (height, width, 4)
    flat_data = pixel_data.astype(np.float32).ravel()
    img.pixels.foreach_set(flat_data)
    img.pack()
    return img

def create_pbr_material(name, texture_img=None, base_color=(0.8, 0.8, 0.8, 1.0), 
                        metallic=0.0, roughness=0.5, transmission=0.0, ior=1.45, coat=0.0):
    """Membuat Material Principled BSDF di Blender 5.0"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    tree = mat.node_tree
    tree.nodes.clear()
    
    out_node = tree.nodes.new('ShaderNodeOutputMaterial')
    out_node.location = (400, 0)
    
    bsdf = tree.nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    
    # Set parameter
    if 'Metallic' in bsdf.inputs:
        bsdf.inputs['Metallic'].default_value = metallic
    if 'Roughness' in bsdf.inputs:
        bsdf.inputs['Roughness'].default_value = roughness
    if 'IOR' in bsdf.inputs:
        bsdf.inputs['IOR'].default_value = ior
    if 'Transmission Weight' in bsdf.inputs:
        bsdf.inputs['Transmission Weight'].default_value = transmission
    if 'Coat Weight' in bsdf.inputs:
        bsdf.inputs['Coat Weight'].default_value = coat
    if 'Coat Roughness' in bsdf.inputs:
        bsdf.inputs['Coat Roughness'].default_value = 0.1
        
    if texture_img:
        tex_node = tree.nodes.new('ShaderNodeTexImage')
        tex_node.image = texture_img
        tex_node.location = (-350, 0)
        tree.links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])
    else:
        if 'Base Color' in bsdf.inputs:
            bsdf.inputs['Base Color'].default_value = base_color
            
    tree.links.new(bsdf.outputs['BSDF'], out_node.inputs['Surface'])
    return mat

def export_object_to_glb(obj, filepath):
    """Ekspor objek yang dipilih ke file GLB"""
    bpy.ops.object.select_all(action='DESELECT')
    if isinstance(obj, list):
        for o in obj:
            o.select_set(True)
        bpy.context.view_layer.objects.active = obj[0]
    else:
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
        export_yup=True
    )
    print(f"[EXPORT OK] -> {filepath}")

# ==============================================================================
# 1. TEXTURE GENERATORS (NUMPY PROCEDURAL TEXTURES)
# ==============================================================================
def gen_cangkir_blirik_texture(w=256, h=256):
    """Tekstur Cangkir Lurik Blirik Hijau Enamel dengan bintik mottled autentik"""
    # Grid koordinat
    y, x = np.mgrid[0:h, 0:w] / float(w)
    # Multi-frequency mottled noise
    n1 = np.sin(x * 24.0) * np.cos(y * 22.0)
    n2 = np.sin(x * 48.0 + 1.2) * np.cos(y * 45.0 + 0.8)
    n3 = np.sin(x * 96.0 + 2.5) * np.sin(y * 90.0 + 1.7)
    noise = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15)
    
    # Sharp blotches threshold
    mask = (noise > 0.08).astype(np.float32)
    # Smooth edges slightly
    mask = np.clip(mask + noise * 0.2, 0.0, 1.0)
    
    # Colors: Dark enamel green [0.12, 0.28, 0.20], Off-white porcelain [0.93, 0.95, 0.92]
    c_green = np.array([0.12, 0.28, 0.20, 1.0], dtype=np.float32)
    c_white = np.array([0.93, 0.95, 0.92, 1.0], dtype=np.float32)
    
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = mask * c_green[c] + (1.0 - mask) * c_white[c]
    return tex

def gen_saringan_cloth_texture(w=256, h=256):
    """Tekstur Kain Blacu/Muslin Saringan Teh/Kopi dengan serat tenun & noda teh"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    # Weave pattern (cross-hatch)
    weave = (np.sin(x * 160.0) * np.cos(y * 160.0)) * 0.06
    # Gradient noda teh (hangat kecokelatan di bagian bawah kantong)
    tea_gradient = np.clip(1.0 - y * 1.1, 0.0, 1.0) ** 1.8
    
    c_base = np.array([0.92, 0.88, 0.80, 1.0], dtype=np.float32)
    c_tea = np.array([0.76, 0.58, 0.36, 1.0], dtype=np.float32)
    
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = (1.0 - tea_gradient) * c_base[c] + tea_gradient * c_tea[c] + weave
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_wood_grain_texture(w=256, h=256, tone='teak'):
    """Tekstur Serat Kayu Jati / Teak Wood"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    # Longitudinal grain streaks
    grain = np.sin(x * 60.0 + np.sin(y * 12.0) * 3.0) * 0.15
    fine_grain = np.sin(x * 180.0) * 0.08
    val = grain + fine_grain
    
    if tone == 'teak':
        c_base = np.array([0.52, 0.32, 0.16, 1.0], dtype=np.float32)
        c_dark = np.array([0.34, 0.19, 0.08, 1.0], dtype=np.float32)
    else: # Bamboo
        c_base = np.array([0.72, 0.62, 0.44, 1.0], dtype=np.float32)
        c_dark = np.array([0.55, 0.45, 0.28, 1.0], dtype=np.float32)
        
    t = np.clip(val * 2.0 + 0.5, 0.0, 1.0)
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = (1.0 - t) * c_base[c] + t * c_dark[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_copper_hammered_texture(w=256, h=256):
    """Tekstur Tembaga Tempa Martil dengan highlight keemasan & patina celah"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    facets = (np.sin(x * 35.0) * np.sin(y * 35.0)) * 0.18
    patina = (np.cos(x * 12.0) * np.sin(y * 15.0)) * 0.08
    
    c_copper = np.array([0.84, 0.44, 0.26, 1.0], dtype=np.float32)
    c_burnish = np.array([0.96, 0.62, 0.38, 1.0], dtype=np.float32)
    c_crevice = np.array([0.55, 0.24, 0.12, 1.0], dtype=np.float32)
    
    t = facets + patina
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = c_copper[c] + t * (c_burnish[c] - c_copper[c])
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_gula_aren_texture(w=256, h=256):
    """Tekstur Gula Jawa Aren Batok Granular & Karamel"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    granules = (np.sin(x * 120.0) * np.cos(y * 120.0)) * 0.12
    concentric = np.sin(np.sqrt((x - 0.5)**2 + (y - 0.5)**2) * 50.0) * 0.08
    
    c_dark = np.array([0.34, 0.16, 0.07, 1.0], dtype=np.float32)
    c_amber = np.array([0.58, 0.28, 0.11, 1.0], dtype=np.float32)
    
    t = np.clip(granules + concentric + 0.5, 0.0, 1.0)
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = (1.0 - t) * c_dark[c] + t * c_amber[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_stone_andesite_texture(w=256, h=256):
    """Tekstur Batu Andesit Vulkanik Berpori (Cobek)"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    pores = (np.sin(x * 80.0) * np.sin(y * 90.0) * np.cos(x * 140.0)) * 0.15
    speckles = (np.sin(x * 220.0) * np.sin(y * 210.0)) * 0.10
    
    c_slate = np.array([0.22, 0.22, 0.24, 1.0], dtype=np.float32)
    c_fleck = np.array([0.48, 0.48, 0.50, 1.0], dtype=np.float32)
    
    t = np.clip(pores + speckles + 0.4, 0.0, 1.0)
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = (1.0 - t) * c_slate[c] + t * c_fleck[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_jahe_roast_texture(w=256, h=256):
    """Tekstur Jahe Emprit Bakar dengan gosong arang anglo"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    rings = np.sin(y * 60.0) * 0.1
    # Spot gosong bakar arang
    char_spots = np.clip(np.sin(x * 15.0 + 1.2) * np.cos(y * 18.0 + 0.5) * 2.2 - 0.7, 0.0, 1.0)
    
    c_skin = np.array([0.76, 0.60, 0.38, 1.0], dtype=np.float32)
    c_toast = np.array([0.48, 0.34, 0.16, 1.0], dtype=np.float32)
    c_char = np.array([0.10, 0.09, 0.08, 1.0], dtype=np.float32)
    
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        base = (1.0 - rings) * c_skin[c] + rings * c_toast[c]
        tex[:, :, c] = (1.0 - char_spots) * base + char_spots * c_char[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_serai_texture(w=256, h=256):
    """Tekstur Pelepah Serai Wangi (Gradasi Putih Gading ke Hijau Segar)"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    fibers = np.sin(x * 120.0) * 0.05
    grad = y # 0 (bawah) -> 1 (atas)
    
    c_bulb = np.array([0.94, 0.92, 0.80, 1.0], dtype=np.float32)
    c_mid = np.array([0.76, 0.84, 0.50, 1.0], dtype=np.float32)
    c_top = np.array([0.42, 0.62, 0.26, 1.0], dtype=np.float32)
    
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        # 3-stage gradient
        stage1 = (1.0 - grad*2.0) * c_bulb[c] + (grad*2.0) * c_mid[c]
        stage2 = (1.0 - (grad - 0.5)*2.0) * c_mid[c] + ((grad - 0.5)*2.0) * c_top[c]
        val = np.where(grad < 0.5, stage1, stage2) + fibers
        tex[:, :, c] = val
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_cinnamon_texture(w=256, h=256):
    """Tekstur Kulit Kayu Manis Berserat Alami"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    striations = (np.sin(x * 70.0 + np.sin(y * 8.0)*2.0)) * 0.12
    lichen = np.clip(np.sin(x * 18.0) * np.sin(y * 22.0) * 1.8 - 0.8, 0.0, 1.0) * 0.25
    
    c_bark = np.array([0.56, 0.26, 0.14, 1.0], dtype=np.float32)
    c_inner = np.array([0.42, 0.18, 0.09, 1.0], dtype=np.float32)
    c_grey = np.array([0.62, 0.58, 0.52, 1.0], dtype=np.float32)
    
    t = striations + 0.5
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        base = (1.0 - t) * c_bark[c] + t * c_inner[c]
        tex[:, :, c] = (1.0 - lichen) * base + lichen * c_grey[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_cengkeh_texture(w=256, h=256):
    """Tekstur Bunga Cengkeh Kering Khas Nusantara"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    leathery = (np.sin(x * 50.0) * np.cos(y * 50.0)) * 0.10
    
    c_choco = np.array([0.26, 0.13, 0.07, 1.0], dtype=np.float32)
    c_amber = np.array([0.46, 0.22, 0.11, 1.0], dtype=np.float32)
    
    t = leathery + 0.5
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = (1.0 - t) * c_choco[c] + t * c_amber[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_parchment_scroll_texture(w=256, h=256):
    """Tekstur Kertas Perkamen Kuno Berisi Aksara Tulisan Tangan"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    lines = (np.sin(y * 80.0) > 0.6).astype(np.float32) * (np.sin(x * 30.0 + 1.0) > -0.2) * 0.28
    vignette = (1.0 - np.sqrt((x - 0.5)**2 + (y - 0.5)**2) * 0.8)
    
    c_paper = np.array([0.91, 0.85, 0.72, 1.0], dtype=np.float32)
    c_ink = np.array([0.28, 0.18, 0.12, 1.0], dtype=np.float32)
    
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = (1.0 - lines) * c_paper[c] * vignette + lines * c_ink[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

def gen_brass_knurl_texture(w=256, h=256):
    """Tekstur Kuningan Berulir Knurled Grip"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    # Diamond knurl pattern
    knurl = np.sin((x + y) * 80.0) * np.sin((x - y) * 80.0) * 0.15
    
    c_brass = np.array([0.84, 0.70, 0.28, 1.0], dtype=np.float32)
    c_shadow = np.array([0.55, 0.42, 0.15, 1.0], dtype=np.float32)
    
    t = knurl + 0.5
    tex = np.zeros((h, w, 4), dtype=np.float32)
    for c in range(4):
        tex[:, :, c] = (1.0 - t) * c_brass[c] + t * c_shadow[c]
    tex[:, :, 3] = 1.0
    return np.clip(tex, 0.0, 1.0)

# ==============================================================================
# 2. MODEL BUILDERS
# ==============================================================================

def build_saringan_kain():
    """1. SARINGAN KAIN (Traditional Fabric Filter Sock with Wire Ring & Wooden Handle)"""
    objs = []
    
    # A. Wire Ring (Torus)
    bpy.ops.mesh.primitive_torus_add(
        align='WORLD', location=(0, 0, 0),
        major_radius=0.45, minor_radius=0.016,
        major_segments=48, minor_segments=16
    )
    ring = bpy.context.active_object
    ring.name = "Saringan_WireRing"
    bpy.ops.object.shade_smooth()
    objs.append(ring)
    
    # Material Kawat Besi/Kuningan
    mat_wire = create_pbr_material("Mat_WireRing", metallic=0.92, roughness=0.25, base_color=(0.85, 0.82, 0.78, 1.0))
    ring.data.materials.append(mat_wire)
    
    # B. Tangkai Kawat & Gagang Kayu
    # Wire stem
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.014, depth=0.85,
        location=(0.85, 0, 0), rotation=(0, math.pi/2, 0),
        vertices=16
    )
    stem = bpy.context.active_object
    stem.name = "Saringan_Stem"
    bpy.ops.object.shade_smooth()
    stem.data.materials.append(mat_wire)
    objs.append(stem)
    
    # Wooden grip around stem
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.045, depth=0.55,
        location=(0.88, 0, 0), rotation=(0, math.pi/2, 0),
        vertices=24
    )
    grip = bpy.context.active_object
    grip.name = "Saringan_WoodGrip"
    bpy.ops.object.shade_smooth()
    
    # Teak wood texture for handle
    tex_wood = create_image_texture("tex_grip_wood", 256, 256, gen_wood_grain_texture(256, 256, 'teak'))
    mat_wood = create_pbr_material("Mat_GripWood", texture_img=tex_wood, roughness=0.38)
    grip.data.materials.append(mat_wood)
    objs.append(grip)
    
    # Wire loop at end of handle
    bpy.ops.mesh.primitive_torus_add(
        location=(1.30, 0, 0), rotation=(0, 0, 0),
        major_radius=0.045, minor_radius=0.012
    )
    loop = bpy.context.active_object
    loop.name = "Saringan_Loop"
    bpy.ops.object.shade_smooth()
    loop.data.materials.append(mat_wire)
    objs.append(loop)
    
    # C. Cloth Filter Cone (Kantong Kain Blacu)
    # Cone with 32 segments, inverted/hanging down
    bpy.ops.mesh.primitive_cone_add(
        radius1=0.45, radius2=0.04, depth=0.88,
        location=(0, 0, -0.44), rotation=(math.pi, 0, 0),
        vertices=36
    )
    cone = bpy.context.active_object
    cone.name = "Saringan_ClothBag"
    bpy.ops.object.shade_smooth()
    
    # Deform slightly for natural cloth sag
    for v in cone.data.vertices:
        dist = math.sqrt(v.co.x**2 + v.co.y**2)
        v.co.x += math.sin(v.co.z * 10.0) * 0.02 * (1.0 - abs(v.co.z)/0.5)
        v.co.y += math.cos(v.co.z * 12.0) * 0.02 * (1.0 - abs(v.co.z)/0.5)
    cone.data.update()
    
    tex_cloth = create_image_texture("tex_saringan_cloth", 256, 256, gen_saringan_cloth_texture(256, 256))
    mat_cloth = create_pbr_material("Mat_SaringanCloth", texture_img=tex_cloth, roughness=0.88)
    cone.data.materials.append(mat_cloth)
    objs.append(cone)
    
    # Join into single object
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    final_obj = bpy.context.active_object
    final_obj.name = "Saringan_Kain"
    return final_obj

def build_cangkir_blirik():
    """2. CANGKIR BLIRIK (Enamel Mug with Mottled Green Pattern, Rolled Bead Lip, Handle & Lid)"""
    objs = []
    
    # Cup body
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.44, depth=0.72,
        location=(0, 0, 0.36), vertices=48
    )
    cup = bpy.context.active_object
    cup.name = "Cangkir_Body"
    bpy.ops.object.shade_smooth()
    
    # Taper slightly to base
    for v in cup.data.vertices:
        if v.co.z < 0.1:
            v.co.x *= 0.88
            v.co.y *= 0.88
    cup.data.update()
    
    # Mottled Blirik Texture
    tex_blirik = create_image_texture("tex_cangkir_blirik", 256, 256, gen_cangkir_blirik_texture(256, 256))
    mat_blirik = create_pbr_material("Mat_BlirikEnamel", texture_img=tex_blirik, roughness=0.12, coat=1.0)
    cup.data.materials.append(mat_blirik)
    objs.append(cup)
    
    # Rolled Lip Bead (Dark green rim)
    bpy.ops.mesh.primitive_torus_add(
        location=(0, 0, 0.72),
        major_radius=0.44, minor_radius=0.02,
        major_segments=48, minor_segments=16
    )
    bead = bpy.context.active_object
    bead.name = "Cangkir_LipBead"
    bpy.ops.object.shade_smooth()
    mat_bead = create_pbr_material("Mat_LipBead", base_color=(0.10, 0.22, 0.16, 1.0), roughness=0.15, coat=1.0)
    bead.data.materials.append(mat_bead)
    objs.append(bead)
    
    # D-shaped Handle
    bpy.ops.mesh.primitive_torus_add(
        location=(0.48, 0, 0.36), rotation=(0, math.pi/2, 0),
        major_radius=0.22, minor_radius=0.035,
        major_segments=36, minor_segments=16
    )
    handle = bpy.context.active_object
    handle.name = "Cangkir_Handle"
    # Clip half torus
    for v in handle.data.vertices:
        if v.co.x < 0:
            v.co.x = 0
    handle.data.update()
    bpy.ops.object.shade_smooth()
    handle.data.materials.append(mat_blirik)
    objs.append(handle)
    
    # Enamel Lid
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.46, depth=0.04,
        location=(0, 0, 0.75), vertices=48
    )
    lid = bpy.context.active_object
    lid.name = "Cangkir_Lid"
    bpy.ops.object.shade_smooth()
    lid.data.materials.append(mat_blirik)
    objs.append(lid)
    
    # Lid Knob
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.07, location=(0, 0, 0.81),
        segments=24, ring_count=16
    )
    knob = bpy.context.active_object
    knob.name = "Cangkir_Knob"
    bpy.ops.object.shade_smooth()
    knob.data.materials.append(mat_bead)
    objs.append(knob)
    
    # Join
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    cangkir = bpy.context.active_object
    cangkir.name = "Cangkir_Blirik"
    return cangkir

def build_ceret_tembaga():
    """3. CERET TEMBAGA (Hammered Copper Kettle with Swan Neck Spout & Teak Bail Handle)"""
    objs = []
    
    # Pear body
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.52, location=(0, 0, 0.44),
        segments=48, ring_count=32
    )
    body = bpy.context.active_object
    body.name = "Ceret_Body"
    # Flatten bottom, elongate neck
    for v in body.data.vertices:
        if v.co.z < 0.1:
            v.co.z = 0.05
        elif v.co.z > 0.6:
            v.co.x *= 0.65
            v.co.y *= 0.65
            v.co.z *= 1.25
    body.data.update()
    bpy.ops.object.shade_smooth()
    
    tex_copper = create_image_texture("tex_ceret_copper", 256, 256, gen_copper_hammered_texture(256, 256))
    mat_copper = create_pbr_material("Mat_HammeredCopper", texture_img=tex_copper, metallic=0.94, roughness=0.22)
    body.data.materials.append(mat_copper)
    objs.append(body)
    
    # Neck collar
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.34, depth=0.12,
        location=(0, 0, 0.98), vertices=36
    )
    neck = bpy.context.active_object
    neck.name = "Ceret_Neck"
    bpy.ops.object.shade_smooth()
    neck.data.materials.append(mat_copper)
    objs.append(neck)
    
    # Lid & Knob
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.32, depth=0.05,
        location=(0, 0, 1.05), vertices=36
    )
    lid = bpy.context.active_object
    lid.name = "Ceret_Lid"
    lid.data.materials.append(mat_copper)
    objs.append(lid)
    
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.065, location=(0, 0, 1.12),
        segments=20, ring_count=16
    )
    knob = bpy.context.active_object
    knob.name = "Ceret_BrassKnob"
    bpy.ops.object.shade_smooth()
    mat_brass = create_pbr_material("Mat_BrassKnob", metallic=0.92, roughness=0.24, base_color=(0.86, 0.70, 0.24, 1.0))
    knob.data.materials.append(mat_brass)
    objs.append(knob)
    
    # Swan-neck Spout (Curve tube)
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.075, depth=0.72,
        location=(-0.52, 0, 0.62), rotation=(0, -math.pi/3.2, 0),
        vertices=24
    )
    spout = bpy.context.active_object
    spout.name = "Ceret_Spout"
    bpy.ops.object.shade_smooth()
    spout.data.materials.append(mat_copper)
    objs.append(spout)
    
    # Arched Bail Handle
    bpy.ops.mesh.primitive_torus_add(
        location=(0, 0, 1.15), rotation=(math.pi/2, 0, 0),
        major_radius=0.48, minor_radius=0.018,
        major_segments=48, minor_segments=16
    )
    handle_wire = bpy.context.active_object
    handle_wire.name = "Ceret_BailWire"
    for v in handle_wire.data.vertices:
        if v.co.z < 0.95:
            v.co.z = 0.95
    handle_wire.data.update()
    bpy.ops.object.shade_smooth()
    handle_wire.data.materials.append(mat_brass)
    objs.append(handle_wire)
    
    # Teak grip on bail handle
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.042, depth=0.34,
        location=(0, 0, 1.63), rotation=(0, math.pi/2, 0),
        vertices=24
    )
    teak_grip = bpy.context.active_object
    teak_grip.name = "Ceret_TeakGrip"
    bpy.ops.object.shade_smooth()
    tex_wood = create_image_texture("tex_ceret_wood", 256, 256, gen_wood_grain_texture(256, 256, 'teak'))
    mat_wood = create_pbr_material("Mat_TeakGrip", texture_img=tex_wood, roughness=0.36)
    teak_grip.data.materials.append(mat_wood)
    objs.append(teak_grip)
    
    # Join
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    ceret = bpy.context.active_object
    ceret.name = "Ceret_Tembaga"
    return ceret

def build_cobek_ulekan():
    """4. COBEK & ULEKAN (Volcanic Andesite Stone Mortar Bowl & Pestle)"""
    objs = []
    
    # Mortar Bowl
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.55, depth=0.18,
        location=(0, 0, 0.09), vertices=48
    )
    cobek = bpy.context.active_object
    cobek.name = "Cobek_Base"
    # Make bowl hollow
    for v in cobek.data.vertices:
        r = math.sqrt(v.co.x**2 + v.co.y**2)
        if v.co.z > 0.05 and r < 0.46:
            v.co.z -= (0.46 - r) * 0.32
    cobek.data.update()
    bpy.ops.object.shade_smooth()
    
    tex_stone = create_image_texture("tex_cobek_stone", 256, 256, gen_stone_andesite_texture(256, 256))
    mat_stone = create_pbr_material("Mat_AndesiteStone", texture_img=tex_stone, roughness=0.85)
    cobek.data.materials.append(mat_stone)
    objs.append(cobek)
    
    # Pestle (Ulekan / Munthu L-shape)
    # Head
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.14, location=(0.18, 0, 0.16),
        segments=24, ring_count=16
    )
    p_head = bpy.context.active_object
    p_head.name = "Munthu_Head"
    for v in p_head.data.vertices:
        if v.co.z < 0.16:
            v.co.z = 0.12
    p_head.data.update()
    bpy.ops.object.shade_smooth()
    p_head.data.materials.append(mat_stone)
    objs.append(p_head)
    
    # Curved Handle
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.065, depth=0.48,
        location=(0.34, 0, 0.32), rotation=(0, -math.pi/3.5, 0),
        vertices=24
    )
    p_handle = bpy.context.active_object
    p_handle.name = "Munthu_Handle"
    bpy.ops.object.shade_smooth()
    p_handle.data.materials.append(mat_stone)
    objs.append(p_handle)
    
    # Join
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    mortar = bpy.context.active_object
    mortar.name = "Cobek_Ulekan"
    return mortar

def build_gula_aren():
    """5. GULA JAWA AREN (Half-Coconut Mold Palm Sugar Dome with Ridges & Fractured Base)"""
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.48, location=(0, 0, 0.40),
        segments=48, ring_count=32
    )
    gula = bpy.context.active_object
    gula.name = "Gula_Aren"
    
    # Cut flat bottom and add concentric ridges
    for v in gula.data.vertices:
        if v.co.z < 0.38:
            v.co.z = 0.02
        else:
            # Concentric sap mold rings
            r = math.sqrt(v.co.x**2 + v.co.y**2)
            v.co.z += math.sin(r * 40.0) * 0.012
    gula.data.update()
    bpy.ops.object.shade_smooth()
    
    tex_sugar = create_image_texture("tex_gula_aren", 256, 256, gen_gula_aren_texture(256, 256))
    mat_sugar = create_pbr_material("Mat_GulaAren", texture_img=tex_sugar, roughness=0.72)
    gula.data.materials.append(mat_sugar)
    return gula

def build_jahe_emprit():
    """6. JAHE EMPRIT BAKAR (Multi-Lobed Ginger Rhizome with Charred Roast Patches)"""
    objs = []
    
    # Main Body
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.32, location=(0, 0, 0.22),
        segments=32, ring_count=20
    )
    main = bpy.context.active_object
    main.scale = (1.4, 0.85, 0.7)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.shade_smooth()
    objs.append(main)
    
    # 3 Finger lobes
    lobe_configs = [
        ((0.36, 0.24, 0.28), (0.22, 0.18, 0.42), (0.3, 0.4, 0.2)),
        ((-0.32, 0.22, 0.26), (0.18, 0.16, 0.38), (-0.4, 0.3, -0.2)),
        ((0.08, -0.26, 0.24), (0.24, 0.18, 0.32), (0.2, -0.5, 0.1)),
    ]
    for loc, sc, rot in lobe_configs:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, location=loc, segments=24, ring_count=16)
        lobe = bpy.context.active_object
        lobe.scale = sc
        lobe.rotation_euler = rot
        bpy.ops.object.transform_apply(scale=True, rotation=True)
        bpy.ops.object.shade_smooth()
        objs.append(lobe)
        
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    jahe = bpy.context.active_object
    jahe.name = "Jahe_Emprit"
    
    tex_jahe = create_image_texture("tex_jahe_roast", 256, 256, gen_jahe_roast_texture(256, 256))
    mat_jahe = create_pbr_material("Mat_JaheEmprit", texture_img=tex_jahe, roughness=0.76)
    jahe.data.materials.append(mat_jahe)
    return jahe

def build_serai_wangi():
    """7. BATANG SERAI WANGI (3 Layered Stalks with Sheath Gradient & Bamboo Tie)"""
    objs = []
    
    tex_serai = create_image_texture("tex_serai_stalk", 256, 256, gen_serai_texture(256, 256))
    mat_serai = create_pbr_material("Mat_SeraiStalk", texture_img=tex_serai, roughness=0.55)
    
    # 3 Stalks
    stalk_offsets = [
        ((0, 0, 0), 0.0),
        ((-0.07, 0.04, -0.02), 0.08),
        ((0.06, 0.05, 0.03), -0.07)
    ]
    for (ox, oy, oz), rz in stalk_offsets:
        # Base bulb
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.065, depth=0.85,
            location=(ox, oy, 0.42 + oz), rotation=(0.04, 0.03, rz),
            vertices=24
        )
        stalk = bpy.context.active_object
        # Bulb swelling at bottom, taper at top
        for v in stalk.data.vertices:
            if v.co.z < 0.2:
                v.co.x *= 1.35
                v.co.y *= 1.35
            elif v.co.z > 0.6:
                v.co.x *= 0.75
                v.co.y *= 0.75
        stalk.data.update()
        bpy.ops.object.shade_smooth()
        stalk.data.materials.append(mat_serai)
        objs.append(stalk)
        
    # Bamboo tie cord
    bpy.ops.mesh.primitive_torus_add(
        location=(0, 0.03, 0.38),
        major_radius=0.14, minor_radius=0.016,
        major_segments=32, minor_segments=12
    )
    tie = bpy.context.active_object
    tie.name = "Serai_BambooTie"
    bpy.ops.object.shade_smooth()
    tex_bamboo = create_image_texture("tex_bamboo_tie", 256, 256, gen_wood_grain_texture(256, 256, 'bamboo'))
    mat_tie = create_pbr_material("Mat_BambooTie", texture_img=tex_bamboo, roughness=0.68)
    tie.data.materials.append(mat_tie)
    objs.append(tie)
    
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    serai = bpy.context.active_object
    serai.name = "Batang_Serai"
    return serai

def build_kayu_manis():
    """8. KULIT KAYU MANIS (Double Rolled Cinnamon Bark Quill Stick)"""
    # Curved tube
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.12, depth=0.82,
        location=(0, 0, 0.41), vertices=36
    )
    quill = bpy.context.active_object
    quill.name = "Kulit_Kayu_Manis"
    # Spiral slit
    for v in quill.data.vertices:
        angle = math.atan2(v.co.y, v.co.x)
        # Displace slightly to form roll
        v.co.x += (angle / math.pi) * 0.025
    quill.data.update()
    bpy.ops.object.shade_smooth()
    
    tex_cin = create_image_texture("tex_cinnamon_bark", 256, 256, gen_cinnamon_texture(256, 256))
    mat_cin = create_pbr_material("Mat_CinnamonBark", texture_img=tex_cin, roughness=0.82)
    quill.data.materials.append(mat_cin)
    return quill

def build_bunga_cengkeh():
    """9. BUNGA CENGKEH (Cluster of 4 Whole Dried Cloves with Sepals & Round Bud)"""
    objs = []
    tex_clove = create_image_texture("tex_clove_bud", 256, 256, gen_cengkeh_texture(256, 256))
    mat_clove = create_pbr_material("Mat_CloveBud", texture_img=tex_clove, roughness=0.65)
    
    clove_positions = [
        ((0, 0, 0), (0, 0, 0)),
        ((0.14, 0.12, 0.02), (0.2, 0.1, 0.8)),
        ((-0.12, 0.14, 0.01), (-0.15, 0.2, -0.6)),
        ((0.02, -0.16, 0.03), (0.1, -0.2, 2.2))
    ]
    
    for (px, py, pz), (rx, ry, rz) in clove_positions:
        # Stem
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.032, depth=0.34,
            location=(px, py, pz + 0.17), rotation=(rx, ry, rz),
            vertices=16
        )
        stem = bpy.context.active_object
        stem.data.materials.append(mat_clove)
        bpy.ops.object.shade_smooth()
        objs.append(stem)
        
        # Round Bud
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=0.075,
            location=(px, py, pz + 0.36),
            segments=18, ring_count=14
        )
        bud = bpy.context.active_object
        bud.data.materials.append(mat_clove)
        bpy.ops.object.shade_smooth()
        objs.append(bud)
        
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    cengkeh = bpy.context.active_object
    cengkeh.name = "Bunga_Cengkeh"
    return cengkeh

def build_sendok_kayu():
    """10. SENDOK KAYU (Hand-Carved Teak Wood Spoon with Concave Scoop Bowl)"""
    objs = []
    tex_wood = create_image_texture("tex_sendok_teak", 256, 256, gen_wood_grain_texture(256, 256, 'teak'))
    mat_wood = create_pbr_material("Mat_TeakSpoon", texture_img=tex_wood, roughness=0.38)
    
    # Scoop Bowl
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.18, location=(0, -0.32, 0.06),
        segments=32, ring_count=20
    )
    bowl = bpy.context.active_object
    bowl.scale = (0.75, 1.25, 0.38)
    bpy.ops.object.transform_apply(scale=True)
    # Flatten top to make concave spoon scoop
    for v in bowl.data.vertices:
        if v.co.z > 0.07:
            v.co.z = 0.07
    bowl.data.update()
    bpy.ops.object.shade_smooth()
    bowl.data.materials.append(mat_wood)
    objs.append(bowl)
    
    # Handle
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.032, depth=0.68,
        location=(0, 0.18, 0.08), rotation=(math.pi/2, 0, 0),
        vertices=20
    )
    handle = bpy.context.active_object
    # Ergonomic taper
    for v in handle.data.vertices:
        if v.co.y > 0.3:
            v.co.x *= 1.2
            v.co.z *= 1.2
    handle.data.update()
    bpy.ops.object.shade_smooth()
    handle.data.materials.append(mat_wood)
    objs.append(handle)
    
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    sendok = bpy.context.active_object
    sendok.name = "Sendok_Kayu"
    return sendok

def build_kunyit():
    """11. RIMPANG KUNYIT (Finger Rhizome with Golden Earthy Skin & Cut Saffron Face)"""
    objs = []
    
    # Main curved finger
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.14, depth=0.72,
        location=(0, 0, 0.36), vertices=32
    )
    kunyit = bpy.context.active_object
    # Curve finger
    for v in kunyit.data.vertices:
        v.co.x += math.sin(v.co.z * 4.0) * 0.06
    kunyit.data.update()
    bpy.ops.object.shade_smooth()
    
    # Skin material
    tex_skin = create_image_texture("tex_kunyit_skin", 256, 256, gen_jahe_roast_texture(256, 256))
    mat_skin = create_pbr_material("Mat_KunyitSkin", texture_img=tex_skin, roughness=0.80)
    kunyit.data.materials.append(mat_skin)
    objs.append(kunyit)
    
    # Sliced Face (Clean Angled Cut with intense saffron orange)
    bpy.ops.mesh.primitive_circle_add(
        radius=0.138, fill_type='NGON',
        location=(0.04, 0, 0.72), rotation=(0, -math.pi/6, 0)
    )
    slice_face = bpy.context.active_object
    mat_saffron = create_pbr_material("Mat_SaffronCore", base_color=(0.98, 0.46, 0.02, 1.0), roughness=0.32)
    slice_face.data.materials.append(mat_saffron)
    objs.append(slice_face)
    
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    res = bpy.context.active_object
    res.name = "Rimpang_Kunyit"
    return res

def build_toples_kawruh():
    """12. TOPLES KAWRUH PAK ILMU (Transparent Glass Jar, Threaded Neck, Knurled Brass Lid & Interior Scrolls)"""
    objs = []
    
    # A. Glass Cylinder Body with Rounded Base and Shoulder
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.48, depth=0.78,
        location=(0, 0, 0.42), vertices=48
    )
    jar = bpy.context.active_object
    jar.name = "Toples_GlassBody"
    for v in jar.data.vertices:
        # Round bottom
        if v.co.z < 0.12:
            v.co.x *= 0.94
            v.co.y *= 0.94
        # Neck constriction
        elif v.co.z > 0.72:
            v.co.x *= 0.78
            v.co.y *= 0.78
    jar.data.update()
    bpy.ops.object.shade_smooth()
    
    # Transparent Physical Glass Material (PBR Transmission)
    mat_glass = create_pbr_material(
        "Mat_ToplesGlass",
        base_color=(0.95, 0.98, 0.98, 1.0),
        roughness=0.04,
        transmission=0.95,
        ior=1.52
    )
    jar.data.materials.append(mat_glass)
    objs.append(jar)
    
    # B. Screw Neck Thread Ring
    bpy.ops.mesh.primitive_torus_add(
        location=(0, 0, 0.76),
        major_radius=0.38, minor_radius=0.016,
        major_segments=48, minor_segments=16
    )
    thread = bpy.context.active_object
    thread.name = "Toples_ThreadRing"
    bpy.ops.object.shade_smooth()
    thread.data.materials.append(mat_glass)
    objs.append(thread)
    
    # C. Brass Knurled Screw Lid
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.41, depth=0.10,
        location=(0, 0, 0.84), vertices=48
    )
    lid = bpy.context.active_object
    lid.name = "Toples_BrassLid"
    bpy.ops.object.shade_smooth()
    
    tex_knurl = create_image_texture("tex_brass_knurl", 256, 256, gen_brass_knurl_texture(256, 256))
    mat_lid = create_pbr_material("Mat_BrassLid", texture_img=tex_knurl, metallic=0.92, roughness=0.28)
    lid.data.materials.append(mat_lid)
    objs.append(lid)
    
    # Domed Top of Lid
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.38, location=(0, 0, 0.86),
        segments=36, ring_count=18
    )
    lid_top = bpy.context.active_object
    for v in lid_top.data.vertices:
        if v.co.z < 0.86:
            v.co.z = 0.86
    lid_top.data.update()
    bpy.ops.object.shade_smooth()
    lid_top.data.materials.append(mat_lid)
    objs.append(lid_top)
    
    # D. 4 Interior Parchment Scrolls
    tex_parch = create_image_texture("tex_parchment_scroll", 256, 256, gen_parchment_scroll_texture(256, 256))
    mat_scroll = create_pbr_material("Mat_ManuscriptScroll", texture_img=tex_parch, roughness=0.85)
    
    scroll_configs = [
        ((-0.14, -0.08, 0.36), (0.18, -0.15, 0.45)),
        ((0.15, -0.06, 0.38), (-0.22, 0.12, -0.65)),
        ((0.02, 0.15, 0.34), (0.12, 0.25, 1.85)),
        ((-0.06, 0.04, 0.38), (-0.08, -0.18, 2.95))
    ]
    for loc, rot in scroll_configs:
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.065, depth=0.48,
            location=loc, rotation=rot,
            vertices=24
        )
        sc = bpy.context.active_object
        sc.data.materials.append(mat_scroll)
        bpy.ops.object.shade_smooth()
        objs.append(sc)
        
    # Join into single unified Toples model
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    toples = bpy.context.active_object
    toples.name = "Toples_Kawruh"
    return toples

# ==============================================================================
# 3. MAIN ORCHESTRATION & EXPORT
# ==============================================================================

MODELS_TO_BUILD = [
    ("saringan", build_saringan_kain),
    ("cangkir", build_cangkir_blirik),
    ("ceret", build_ceret_tembaga),
    ("cobek", build_cobek_ulekan),
    ("gula_aren", build_gula_aren),
    ("jahe", build_jahe_emprit),
    ("serai", build_serai_wangi),
    ("kayu_manis", build_kayu_manis),
    ("cengkeh", build_bunga_cengkeh),
    ("sendok", build_sendok_kayu),
    ("kunyit", build_kunyit),
    ("toples", build_toples_kawruh)
]

def main():
    print("=== MEMULAI GENERASI 3D MODEL MASTERPIECE ANGKRINGAN PAK ILMU ===")
    
    # Simpan semua objek yang dibuat untuk file master .blend
    all_master_objects = []
    
    for idx, (name, builder_func) in enumerate(MODELS_TO_BUILD):
        print(f"\n[{idx+1}/{len(MODELS_TO_BUILD)}] Memodelkan: {name} ...")
        clear_all()
        
        obj = builder_func()
        
        # Center origin to geometry and put base on ground z=0
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
        
        # Offset so minimum Z is 0
        min_z = min(v.co.z for v in obj.data.vertices)
        obj.location.z -= min_z
        bpy.ops.object.transform_apply(location=True)
        
        # Export GLB individual
        out_glb = os.path.join(OUTPUT_DIR, f"{name}.glb")
        export_object_to_glb(obj, out_glb)
        
    print("\n--- Seluruh 12 Model GLB Berhasil Diekspor! ---")
    
    # Sekarang buat Master Scene .blend yang menyimpan semua 12 objek tertata rapi
    print(f"\nMembuat Master Project Blender: {BLEND_PATH} ...")
    clear_all()
    
    col = bpy.data.collections.new("AngkringanMasterCollection")
    bpy.context.scene.collection.children.link(col)
    
    spacing_x = 1.6
    spacing_y = 1.6
    
    for idx, (name, builder_func) in enumerate(MODELS_TO_BUILD):
        # Bangun kembali di dalam scene master
        obj = builder_func()
        obj.name = f"Master_{name}"
        
        grid_x = (idx % 4) * spacing_x - (1.5 * spacing_x)
        grid_y = (idx // 4) * spacing_y - (1.0 * spacing_y)
        
        obj.location.x += grid_x
        obj.location.y += grid_y
        
        # Move to collection
        for c in obj.users_collection:
            c.objects.unlink(obj)
        col.objects.link(obj)
        
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print(f"[MASTER BLEND SAVED] -> {BLEND_PATH}")
    print("=== SELESAI DENGAN SUKSES ===")

if __name__ == "__main__":
    main()
