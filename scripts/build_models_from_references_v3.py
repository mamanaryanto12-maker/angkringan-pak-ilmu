"""
Script Pemodelan 3D Berdasarkan Gambar Referensi Asli Babak 1 & Toples Kawruh
Angkringan Pak Ilmu — Gredupedia #7 Karsa Kala
Dijalankan via Blender 5.0 CLI dengan Material PBR & Procedural Textures Autentik
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
# PROCEDURAL TEXTURES GENERATION
# ==============================================================================

def gen_cangkir_blirik_texture(w=256, h=256):
    """Tekstur Cangkir Lurik Blirik Hijau Enamel mottled autentik"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    n1 = np.sin(x * 26.0) * np.cos(y * 24.0)
    n2 = np.sin(x * 52.0 + 1.2) * np.cos(y * 48.0 + 0.8)
    n3 = np.cos(x * 14.0 + y * 28.0)
    noise = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15)
    
    mask = noise > 0.08
    rgba = np.ones((h, w, 4), dtype=np.float32)
    # White base enamel
    rgba[~mask, 0] = 0.94
    rgba[~mask, 1] = 0.95
    rgba[~mask, 2] = 0.92
    # Army green lurik spots (seperti di referensi)
    rgba[mask, 0] = 0.16
    rgba[mask, 1] = 0.36
    rgba[mask, 2] = 0.18
    rgba[:, :, 3] = 1.0
    return rgba

def gen_wood_texture(w=256, h=256, dark=False):
    """Tekstur serat kayu jati hangat / mahoni"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    grain = np.sin(y * 80.0 + np.sin(x * 12.0) * 3.0) * 0.5 + 0.5
    rgba = np.ones((h, w, 4), dtype=np.float32)
    if dark:
        rgba[:, :, 0] = 0.28 + grain * 0.12
        rgba[:, :, 1] = 0.16 + grain * 0.08
        rgba[:, :, 2] = 0.08 + grain * 0.04
    else:
        # Warm golden-brown wood
        rgba[:, :, 0] = 0.58 + grain * 0.16
        rgba[:, :, 1] = 0.36 + grain * 0.10
        rgba[:, :, 2] = 0.16 + grain * 0.06
    rgba[:, :, 3] = 1.0
    return rgba

def gen_copper_hammered_texture(w=256, h=256):
    """Tekstur tembaga tempaan (hammered copper) rose-gold mengilap"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    c1 = np.sin(x * 40.0) * np.sin(y * 40.0)
    c2 = np.cos(x * 60.0 + 0.5) * np.sin(y * 60.0 + 0.5)
    dimple = (c1 + c2) * 0.5
    rgba = np.ones((h, w, 4), dtype=np.float32)
    rgba[:, :, 0] = 0.88 + dimple * 0.08
    rgba[:, :, 1] = 0.48 + dimple * 0.06
    rgba[:, :, 2] = 0.34 + dimple * 0.04
    rgba[:, :, 3] = 1.0
    return rgba

def gen_cloth_filter_texture(w=256, h=256):
    """Tekstur kain blacu tenun dengan gradasi rembesan teh hangat"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    weave = (np.sin(x * 140.0) * np.cos(y * 140.0)) * 0.05
    stain = (1.0 - y) * 0.35 # rembesan teh lebih pekat di bawah
    rgba = np.ones((h, w, 4), dtype=np.float32)
    rgba[:, :, 0] = (0.84 - stain * 0.22) + weave
    rgba[:, :, 1] = (0.76 - stain * 0.28) + weave
    rgba[:, :, 2] = (0.62 - stain * 0.38) + weave
    rgba[:, :, 3] = 1.0
    return rgba

def gen_palm_sugar_texture(w=256, h=256, dark=True):
    """Tekstur padat gula aren bumbung dengan kristal gula karamel"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    noise = np.sin(x * 35.0) * np.cos(y * 35.0) * 0.5 + np.sin(x * 90.0) * 0.3
    rgba = np.ones((h, w, 4), dtype=np.float32)
    if dark:
        rgba[:, :, 0] = 0.32 + noise * 0.08
        rgba[:, :, 1] = 0.16 + noise * 0.05
        rgba[:, :, 2] = 0.06 + noise * 0.03
    else:
        # Amber honey brown
        rgba[:, :, 0] = 0.56 + noise * 0.10
        rgba[:, :, 1] = 0.32 + noise * 0.07
        rgba[:, :, 2] = 0.10 + noise * 0.04
    rgba[:, :, 3] = 1.0
    return rgba

def gen_cinnamon_texture(w=256, h=256):
    """Tekstur kulit kayu manis kering berlapis"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    bark = np.sin(y * 120.0 + np.sin(x * 10.0) * 4.0) * 0.5 + 0.5
    rgba = np.ones((h, w, 4), dtype=np.float32)
    rgba[:, :, 0] = 0.54 + bark * 0.14
    rgba[:, :, 1] = 0.28 + bark * 0.08
    rgba[:, :, 2] = 0.12 + bark * 0.04
    rgba[:, :, 3] = 1.0
    return rgba

def gen_serai_texture(w=256, h=256):
    """Tekstur batang serai dari pangkal gading ke daun hijau segar"""
    y, x = np.mgrid[0:h, 0:w] / float(w)
    lines = np.sin(x * 90.0) * 0.04
    rgba = np.ones((h, w, 4), dtype=np.float32)
    # y=0: pangkal (ivory pinkish), y=1: ujung hijau
    t = y
    rgba[:, :, 0] = (0.88 * (1.0 - t) + 0.35 * t) + lines
    rgba[:, :, 1] = (0.84 * (1.0 - t) + 0.58 * t) + lines
    rgba[:, :, 2] = (0.72 * (1.0 - t) + 0.22 * t) + lines
    rgba[:, :, 3] = 1.0
    return rgba

# ==============================================================================
# MODEL BUILDERS BERDASARKAN GAMBAR REFERENSI
# ==============================================================================

def build_toples_kawruh(textures):
    """
    Model 3D Toples Kawruh Pak Ilmu sesuai 'gambar toples kawruh pak ilmu.png':
    - Badan toples kaca transparan silinder halus dengan bahu membulat
    - Tutup kayu jati/mahoni bundar di bagian atas
    - Tali rami alami melilit leher toples dengan simpul pita cantik
    - Label gantungan berbentuk HATI (heart tag) menggantung di sisi kanan
    - Di dalam toples terisi lipatan kertas naskah kawruh bergaya origami
    """
    objs = []
    
    # 1. Badan Kaca
    bpy.ops.mesh.primitive_cylinder_add(radius=0.54, depth=1.05, vertices=28, location=(0, 0, 0.52))
    jar_obj = bpy.context.active_object
    jar_obj.name = "Toples_Kaca_Badan"
    bev = jar_obj.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.05
    bev.segments = 2
    
    sol = jar_obj.modifiers.new("Solidify", "SOLIDIFY")
    sol.thickness = 0.03
    
    # Material Kaca
    glass_mat = create_pbr_material("Toples_Glass_PBR", base_color=(0.96, 0.98, 0.98, 1.0),
                                   roughness=0.04, transmission=0.95, ior=1.52)
    jar_obj.data.materials.append(glass_mat)
    objs.append(jar_obj)
    
    # 2. Leher Kaca
    bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=0.18, vertices=24, location=(0, 0, 1.10))
    neck_obj = bpy.context.active_object
    neck_obj.name = "Toples_Kaca_Leher"
    neck_obj.data.materials.append(glass_mat)
    objs.append(neck_obj)
    
    # 3. Tutup Kayu (Sesuai gambar referensi: tutup bundar datar kayu hangat)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.48, depth=0.14, vertices=28, location=(0, 0, 1.25))
    lid_obj = bpy.context.active_object
    lid_obj.name = "Toples_Tutup_Kayu"
    bev_lid = lid_obj.modifiers.new("Bevel", "BEVEL")
    bev_lid.width = 0.02
    bev_lid.segments = 2
    wood_mat = create_pbr_material("Wood_Lid_PBR", texture_img=textures['wood'], roughness=0.38)
    lid_obj.data.materials.append(wood_mat)
    objs.append(lid_obj)
    
    # 4. Lilitan Tali Rami (Jute Twine) di Leher Toples (4 lilitan spiral bertumpuk)
    twine_mat = create_pbr_material("Jute_Twine_PBR", base_color=(0.65, 0.52, 0.35, 1.0), roughness=0.85)
    for i in range(4):
        z_offset = 1.05 + i * 0.028
        bpy.ops.mesh.primitive_torus_add(major_radius=0.435, minor_radius=0.014, major_segments=24, minor_segments=8, location=(0, 0, z_offset))
        coil = bpy.context.active_object
        coil.name = f"Toples_Tali_Lilitan_{i}"
        coil.data.materials.append(twine_mat)
        objs.append(coil)
        
    # 5. Simpul Pita Tali Rami (Bow Tie) di Sisi Kanan Depan
    bpy.ops.mesh.primitive_torus_add(major_radius=0.055, minor_radius=0.012, major_segments=16, minor_segments=6, 
                                    location=(0.38, -0.22, 1.12), rotation=(0.4, 0.8, -0.3))
    loop1 = bpy.context.active_object
    loop1.name = "Toples_Pita_Loop1"
    loop1.data.materials.append(twine_mat)
    objs.append(loop1)
    
    bpy.ops.mesh.primitive_torus_add(major_radius=0.048, minor_radius=0.012, major_segments=16, minor_segments=6, 
                                    location=(0.42, -0.16, 1.15), rotation=(-0.3, 0.6, 0.5))
    loop2 = bpy.context.active_object
    loop2.name = "Toples_Pita_Loop2"
    loop2.data.materials.append(twine_mat)
    objs.append(loop2)
    
    # 6. Gantungan Label HATI (Heart Tag) Kraft Paper (Sesuai gambar referensi!)
    # Membuat bentuk hati dari 2 silinder + 1 kerucut segitiga
    bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=0.012, vertices=16, location=(0.38, -0.26, 1.03))
    tag_lobe1 = bpy.context.active_object
    tag_mat = create_pbr_material("Kraft_Tag_PBR", base_color=(0.74, 0.58, 0.40, 1.0), roughness=0.75)
    tag_lobe1.data.materials.append(tag_mat)
    objs.append(tag_lobe1)
    
    bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=0.012, vertices=16, location=(0.44, -0.20, 1.03))
    tag_lobe2 = bpy.context.active_object
    tag_lobe2.data.materials.append(tag_mat)
    objs.append(tag_lobe2)
    
    bpy.ops.mesh.primitive_cone_add(radius1=0.088, radius2=0.005, depth=0.11, vertices=16, location=(0.41, -0.23, 0.96), rotation=(math.pi, 0, 0))
    tag_tip = bpy.context.active_object
    tag_tip.data.materials.append(tag_mat)
    objs.append(tag_tip)
    
    # 7. Isi Gulungan & Lipatan Kertas Naskah Kawruh (Origami Folded Notes) di dalam toples
    paper_mat1 = create_pbr_material("Note_Paper1_PBR", base_color=(0.95, 0.92, 0.82, 1.0), roughness=0.68)
    paper_mat2 = create_pbr_material("Note_Paper2_PBR", base_color=(0.88, 0.82, 0.70, 1.0), roughness=0.72)
    
    np.random.seed(42)
    for n in range(10):
        # Variasi posisi acak di dalam toples
        ang = np.random.uniform(0, math.tau)
        rad = np.random.uniform(0.08, 0.36)
        px = math.cos(ang) * rad
        py = math.sin(ang) * rad
        pz = 0.14 + n * 0.05 + np.random.uniform(-0.02, 0.02)
        
        rx = np.random.uniform(-0.7, 0.7)
        ry = np.random.uniform(-0.7, 0.7)
        rz = np.random.uniform(0, math.tau)
        
        sx = np.random.uniform(0.18, 0.25)
        sy = np.random.uniform(0.14, 0.20)
        sz = 0.008
        
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(px, py, pz), rotation=(rx, ry, rz))
        note = bpy.context.active_object
        note.scale = (sx, sy, sz)
        note.name = f"Toples_Note_{n}"
        note.data.materials.append(paper_mat1 if n % 2 == 0 else paper_mat2)
        objs.append(note)
        
    return objs

def mathutils_matrix_trans(x, y, z):
    import mathutils
    return mathutils.Matrix.Translation((x, y, z))

def build_gula_jawa(textures):
    """
    Model 3D Gula Jawa Aren sesuai 'gula jawa aren.png':
    - 2 silinder gula aren cetakan bumbung (satu tegak gelap, satu miring keemasan)
    - Taburan remahan & pecahan kristal gula aren di bagian depan
    """
    objs = []
    mat_dark = create_pbr_material("Gula_Aren_Dark_PBR", texture_img=textures['palm_dark'], roughness=0.74)
    mat_amber = create_pbr_material("Gula_Aren_Amber_PBR", texture_img=textures['palm_amber'], roughness=0.68)
    
    # 1. Silinder Utama (Tegak - Cokelat Karamel Pekat)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.44, depth=0.58, vertices=32, location=(0.12, 0.05, 0.29))
    c1 = bpy.context.active_object
    c1.name = "Gula_Aren_Silinder_Tegak"
    bev = c1.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.04
    bev.segments = 3
    c1.data.materials.append(mat_dark)
    objs.append(c1)
    
    # 2. Silinder Kedua (Miring di belakang - Cokelat Amber Keemasan)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.40, depth=0.52, vertices=32, location=(-0.25, 0.18, 0.35), rotation=(0.35, -0.45, 0.2))
    c2 = bpy.context.active_object
    c2.name = "Gula_Aren_Silinder_Miring"
    bev2 = c2.modifiers.new("Bevel", "BEVEL")
    bev2.width = 0.04
    bev2.segments = 3
    c2.data.materials.append(mat_amber)
    objs.append(c2)
    
    # 3. Bongkahan & Remahan Gula Aren di Bagian Depan (Granules & Chunks)
    np.random.seed(101)
    for i in range(18):
        ang = np.random.uniform(math.pi * 0.8, math.pi * 1.8)
        rad = np.random.uniform(0.25, 0.58)
        cx = math.cos(ang) * rad - 0.05
        cy = math.sin(ang) * rad - 0.12
        cz = np.random.uniform(0.02, 0.12)
        sz = np.random.uniform(0.035, 0.09)
        
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=sz, location=(cx, cy, cz))
        crumb = bpy.context.active_object
        crumb.name = f"Gula_Crumb_{i}"
        crumb.scale = (np.random.uniform(0.8, 1.4), np.random.uniform(0.8, 1.4), np.random.uniform(0.6, 1.0))
        crumb.data.materials.append(mat_dark if i % 2 == 0 else mat_amber)
        objs.append(crumb)
        
    return objs

def build_saringan_kain(textures):
    """
    Model 3D Saringan Kain Tradisional sesuai 'gambar saringan kain.png':
    - Ring bingkai kayu bundar berprofil halus
    - Gagang kayu pipih ergonomis memanjang ke sisi kanan
    - Kantong kain saring blacu kerucut/pouch menggantung ke bawah
    """
    objs = []
    mat_wood = create_pbr_material("Saringan_Wood_PBR", texture_img=textures['wood'], roughness=0.42)
    mat_cloth = create_pbr_material("Saringan_Cloth_PBR", texture_img=textures['cloth'], roughness=0.88)
    
    # 1. Ring Bingkai Kayu Bundar
    bpy.ops.mesh.primitive_torus_add(major_radius=0.48, minor_radius=0.065, major_segments=36, minor_segments=12, location=(0, 0, 0.55))
    ring = bpy.context.active_object
    ring.name = "Saringan_Ring_Kayu"
    ring.scale = (1.0, 1.0, 0.85)
    ring.data.materials.append(mat_wood)
    objs.append(ring)
    
    # 2. Gagang Kayu Pipih (Paddle Handle) memanjang ke samping (sesuai referensi)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.82, 0, 0.55))
    handle = bpy.context.active_object
    handle.name = "Saringan_Gagang_Kayu"
    handle.scale = (0.75, 0.16, 0.075)
    bev_h = handle.modifiers.new("Bevel", "BEVEL")
    bev_h.width = 0.025
    bev_h.segments = 3
    handle.data.materials.append(mat_wood)
    objs.append(handle)
    
    # 3. Kantong Kain Saring (Cloth Pouch) Menggantung ke Bawah
    bm = bmesh.new()
    segments = 24
    height_steps = 14
    verts_grid = []
    
    for h_idx in range(height_steps):
        v = h_idx / float(height_steps - 1)
        z = 0.55 - v * 0.72 # kedalaman kantong
        # Kurva bentuk kantong kerucut melengkung tumpul
        r = 0.46 * (1.0 - (v ** 1.35) * 0.82)
        row = []
        for s in range(segments):
            angle = s * (math.tau / segments)
            # Kerutan alami kain
            wrinkle = math.sin(s * 4.0) * 0.015 * v
            x = math.cos(angle) * (r + wrinkle)
            y = math.sin(angle) * (r + wrinkle)
            row.append(bm.verts.new((x, y, z)))
        verts_grid.append(row)
        
    for h_idx in range(height_steps - 1):
        for s in range(segments):
            s_next = (s + 1) % segments
            v1 = verts_grid[h_idx][s]
            v2 = verts_grid[h_idx][s_next]
            v3 = verts_grid[h_idx + 1][s_next]
            v4 = verts_grid[h_idx + 1][s]
            bm.faces.new((v1, v2, v3, v4))
            
    # Tutup bagian bawah kantong dengan wajah segitiga berpusat
    tip_vert = bm.verts.new((0, 0, -0.18))
    for s in range(segments):
        s_next = (s + 1) % segments
        bm.faces.new((verts_grid[-1][s], verts_grid[-1][s_next], tip_vert))
        
    cloth_mesh = bpy.data.meshes.new("Cloth_Mesh")
    bm.to_mesh(cloth_mesh)
    bm.free()
    
    cloth_obj = bpy.data.objects.new("Saringan_Kantong_Kain", cloth_mesh)
    bpy.context.collection.objects.link(cloth_obj)
    
    # Solidify tipis pada kain
    sol = cloth_obj.modifiers.new("Solidify", "SOLIDIFY")
    sol.thickness = 0.012
    cloth_obj.data.materials.append(mat_cloth)
    objs.append(cloth_obj)
    
    return objs

def build_sendok_kayu(textures):
    """
    Model 3D Sendok Kayu sesuai 'gambar sendok kayu.png':
    - Cekungan sendok oval halus yang ergonomis
    - Batang gagang memanjang ramping
    - Lubang gantungan bundar di ujung pangkal gagang
    """
    objs = []
    mat_wood = create_pbr_material("Sendok_Wood_PBR", texture_img=textures['wood'], roughness=0.38)
    
    # 1. Mangkuk Sendok Oval Cekung
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=0.36)
    for v in bm.verts:
        v.co.x *= 1.45 # oval panjang
        v.co.y *= 1.05
        v.co.z *= 0.42 # pipih
        if v.co.z > 0.04:
            v.co.z = 0.04 - (v.co.z - 0.04) * 0.45 # cekungan dalam
            
    bowl_mesh = bpy.data.meshes.new("Spoon_Bowl")
    bm.to_mesh(bowl_mesh)
    bm.free()
    
    bowl_obj = bpy.data.objects.new("Sendok_Mangkuk", bowl_mesh)
    bpy.context.collection.objects.link(bowl_obj)
    bowl_obj.location = (0.50, 0, 0.12)
    bowl_obj.data.materials.append(mat_wood)
    objs.append(bowl_obj)
    
    # 2. Gagang Sendok Ramping
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.30, 0, 0.12))
    handle = bpy.context.active_object
    handle.name = "Sendok_Gagang"
    handle.scale = (1.15, 0.12, 0.055)
    bev = handle.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.02
    bev.segments = 3
    handle.data.materials.append(mat_wood)
    objs.append(handle)
    
    # 3. Lubang Gantungan Bundar di Ujung Gagang (Cutout Ring)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.038, depth=0.10, vertices=18, location=(-0.78, 0, 0.12))
    hole_cutter = bpy.context.active_object
    hole_cutter.name = "Hole_Cutter"
    
    bool_mod = handle.modifiers.new("HoleBool", "BOOLEAN")
    bool_mod.operation = 'DIFFERENCE'
    bool_mod.object = hole_cutter
    
    # Terapkan boolean mod
    bpy.context.view_layer.objects.active = handle
    bpy.ops.object.modifier_apply(modifier="HoleBool")
    
    bpy.data.objects.remove(hole_cutter, do_unlink=True)
    return objs

def build_kulit_kayu_manis(textures):
    """
    Model 3D Kulit Kayu Manis sesuai 'gambar kulit kayu manis.png':
    - 4 batang gulungan kayu manis tegak berongga (double-rolled quills)
    - Ikatan tali rami simpul pita melingkari tengah ikatan
    """
    objs = []
    mat_cinnamon = create_pbr_material("Cinnamon_Bark_PBR", texture_img=textures['cinnamon'], roughness=0.76)
    mat_twine = create_pbr_material("Cinnamon_Twine_PBR", base_color=(0.70, 0.58, 0.42, 1.0), roughness=0.82)
    
    # 4 Batang Kayu Manis Berongga
    positions = [
        (-0.16, -0.14, 0.65, 0.05, -0.04),
        ( 0.16, -0.14, 0.65, -0.04, 0.03),
        (-0.14,  0.16, 0.65, -0.03, -0.05),
        ( 0.15,  0.15, 0.65, 0.04, 0.04)
    ]
    
    for i, (px, py, pz, rx, ry) in enumerate(positions):
        # Silinder berongga
        bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=1.28, vertices=24, location=(px, py, pz), rotation=(rx, ry, 0))
        quill = bpy.context.active_object
        quill.name = f"Kayu_Manis_Batang_{i}"
        
        # Solidify tipis berongga
        sol = quill.modifiers.new("Solidify", "SOLIDIFY")
        sol.thickness = -0.032
        
        quill.data.materials.append(mat_cinnamon)
        objs.append(quill)
        
    # Ikatan Tali Rami di Tengah (Torus Wrap + Pita Kupu-Kupu)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.34, minor_radius=0.016, major_segments=32, minor_segments=8, location=(0, 0, 0.68))
    twine = bpy.context.active_object
    twine.name = "Kayu_Manis_Tali_Ikatan"
    twine.data.materials.append(mat_twine)
    objs.append(twine)
    
    # Pita Depan
    bpy.ops.mesh.primitive_torus_add(major_radius=0.055, minor_radius=0.012, major_segments=16, minor_segments=8, 
                                    location=(-0.08, -0.34, 0.68), rotation=(0.5, 0.6, 0))
    bow1 = bpy.context.active_object
    bow1.name = "Kayu_Manis_Pita1"
    bow1.data.materials.append(mat_twine)
    objs.append(bow1)
    
    bpy.ops.mesh.primitive_torus_add(major_radius=0.055, minor_radius=0.012, major_segments=16, minor_segments=8, 
                                    location=(0.08, -0.34, 0.68), rotation=(-0.5, 0.6, 0))
    bow2 = bpy.context.active_object
    bow2.name = "Kayu_Manis_Pita2"
    bow2.data.materials.append(mat_twine)
    objs.append(bow2)
    
    return objs

def build_ceret_tembaga(textures):
    """
    Model 3D Ceret Tembaga Tradisional sesuai 'gambar ceret tembaga.png':
    - Badan bulat tempaan tembaga rose-gold (squat bulbous body)
    - Moncong corong melengkung di sisi kiri
    - Tutup tembaga berkubah dengan kenop kayu gelap
    - Gagang lengkung atas tembaga dengan pegangan silinder kayu berprofil
    """
    objs = []
    mat_copper = create_pbr_material("Ceret_Copper_PBR", texture_img=textures['copper'], metallic=0.94, roughness=0.26)
    mat_wood = create_pbr_material("Ceret_Dark_Wood_PBR", texture_img=textures['wood_dark'], roughness=0.45)
    
    # 1. Badan Ceret Bulat Jongkok (Squat Bulbous Pot)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20, radius=0.62, location=(0, 0, 0.52))
    body = bpy.context.active_object
    body.name = "Ceret_Badan_Tembaga"
    body.scale = (1.08, 1.08, 0.88)
    body.data.materials.append(mat_copper)
    objs.append(body)
    
    # 2. Leher & Mulut Tutup Ceret
    bpy.ops.mesh.primitive_cylinder_add(radius=0.38, depth=0.12, vertices=32, location=(0, 0, 0.96))
    neck = bpy.context.active_object
    neck.name = "Ceret_Mulut_Tembaga"
    neck.data.materials.append(mat_copper)
    objs.append(neck)
    
    # 3. Tutup Ceret Berkubah (Domed Lid)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=14, radius=0.40, location=(0, 0, 0.98))
    lid = bpy.context.active_object
    lid.name = "Ceret_Tutup_Tembaga"
    lid.scale = (1.0, 1.0, 0.35)
    lid.data.materials.append(mat_copper)
    objs.append(lid)
    
    # 4. Kenop Tutup Kayu Gelap
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.12, vertices=16, location=(0, 0, 1.15))
    knob = bpy.context.active_object
    knob.name = "Ceret_Kenop_Kayu"
    knob.scale = (1.2, 1.2, 0.8)
    knob.data.materials.append(mat_wood)
    objs.append(knob)
    
    # 5. Moncong Ceret (Curved S-Spout)
    bm = bmesh.new()
    spout_steps = 12
    spout_verts = []
    for s in range(spout_steps):
        t = s / float(spout_steps - 1)
        # S-curve path
        sx = -0.55 - math.sin(t * 1.3) * 0.42
        sy = 0.0
        sz = 0.38 + t * 0.46
        r = 0.14 * (1.0 - t * 0.45) # moncong menyempit
        ring_v = []
        for a_idx in range(16):
            ang = a_idx * (math.tau / 16)
            rx = sx + math.sin(ang) * r * 0.6
            ry = sy + math.cos(ang) * r
            rz = sz + math.sin(ang) * r * 0.8
            ring_v.append(bm.verts.new((rx, ry, rz)))
        spout_verts.append(ring_v)
        
    for s in range(spout_steps - 1):
        for a_idx in range(16):
            a_next = (a_idx + 1) % 16
            bm.faces.new((spout_verts[s][a_idx], spout_verts[s][a_next], 
                          spout_verts[s + 1][a_next], spout_verts[s + 1][a_idx]))
            
    spout_mesh = bpy.data.meshes.new("Spout_Mesh")
    bm.to_mesh(spout_mesh)
    bm.free()
    
    spout_obj = bpy.data.objects.new("Ceret_Moncong_Tembaga", spout_mesh)
    bpy.context.collection.objects.link(spout_obj)
    spout_obj.data.materials.append(mat_copper)
    objs.append(spout_obj)
    
    # 6. Gagang Lengkung Tembaga (Overhead Bail Handle)
    bm_h = bmesh.new()
    steps = 20
    handle_verts = []
    for i in range(steps):
        t = i / float(steps - 1)
        ang = math.pi * (1.0 - t)
        hx = math.cos(ang) * 0.58
        hy = 0.0
        hz = 0.85 + math.sin(ang) * 0.68
        # Flat copper strap cross section
        v1 = bm_h.verts.new((hx - 0.015, hy - 0.045, hz))
        v2 = bm_h.verts.new((hx + 0.015, hy - 0.045, hz))
        v3 = bm_h.verts.new((hx + 0.015, hy + 0.045, hz))
        v4 = bm_h.verts.new((hx - 0.015, hy + 0.045, hz))
        handle_verts.append((v1, v2, v3, v4))
        
    for i in range(steps - 1):
        r1 = handle_verts[i]
        r2 = handle_verts[i + 1]
        bm_h.faces.new((r1[0], r1[1], r2[1], r2[0]))
        bm_h.faces.new((r1[1], r1[2], r2[2], r2[1]))
        bm_h.faces.new((r1[2], r1[3], r2[3], r2[2]))
        bm_h.faces.new((r1[3], r1[0], r2[0], r2[3]))
        
    h_mesh = bpy.data.meshes.new("Handle_Strap")
    bm_h.to_mesh(h_mesh)
    bm_h.free()
    
    h_obj = bpy.data.objects.new("Ceret_Gagang_Tembaga", h_mesh)
    bpy.context.collection.objects.link(h_obj)
    h_obj.data.materials.append(mat_copper)
    objs.append(h_obj)
    
    # 7. Pegangan Kayu Gelap di Tengah Gagang (Wooden Handle Cylinder Grip)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.075, depth=0.38, vertices=20, location=(0, 0, 1.54), rotation=(0, math.pi/2, 0))
    grip = bpy.context.active_object
    grip.name = "Ceret_Pegangan_Kayu"
    grip.data.materials.append(mat_wood)
    objs.append(grip)
    
    return objs

def build_cengkeh(textures):
    """
    Model 3D Bunga Cengkeh Kering sesuai 'gambar cengkeh.png':
    - 2 buah kuncup cengkeh kering bersisian
    - Batang silinder kecokelatan meruncing
    - 4 kelopak calyx mekar membuka
    - Kepala kuncup bunga bulat bersegmen di tengah
    """
    objs = []
    mat_cengkeh = create_pbr_material("Cengkeh_PBR", base_color=(0.46, 0.24, 0.12, 1.0), roughness=0.55)
    
    offsets = [
        (-0.16, 0.0, 0.25, 0.35, -0.4, 0.1),
        ( 0.18, 0.0, 0.32, 0.25, -0.5, 0.2)
    ]
    
    for idx, (ox, oy, oz, rx, ry, rz) in enumerate(offsets):
        # 1. Batang (Stem / Hypanthium)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.075, depth=0.62, vertices=16, location=(ox, oy, oz), rotation=(rx, ry, rz))
        stem = bpy.context.active_object
        stem.name = f"Cengkeh_Batang_{idx}"
        stem.data.materials.append(mat_cengkeh)
        objs.append(stem)
        
        # 2. Kepala Kuncup Bunga Bulat (Flower Bud Head)
        # Hitung posisi kepala berdasarkan rotasi
        head_x = ox + math.sin(ry) * 0.32
        head_y = oy - math.sin(rx) * 0.32
        head_z = oz + math.cos(ry) * 0.32
        
        bpy.ops.mesh.primitive_uv_sphere_add(segments=18, ring_count=12, radius=0.14, location=(head_x, head_y, head_z))
        head = bpy.context.active_object
        head.name = f"Cengkeh_Kepala_{idx}"
        head.data.materials.append(mat_cengkeh)
        objs.append(head)
        
        # 3. 4 Kelopak Calyx Pelindung
        for k in range(4):
            ang = k * (math.pi / 2.0)
            kx = head_x + math.cos(ang) * 0.11
            ky = head_y + math.sin(ang) * 0.11
            kz = head_z - 0.03
            bpy.ops.mesh.primitive_cone_add(radius1=0.045, radius2=0.01, depth=0.10, location=(kx, ky, kz), rotation=(0.4 * math.sin(ang), 0.4 * math.cos(ang), ang))
            calyx = bpy.context.active_object
            calyx.name = f"Cengkeh_Calyx_{idx}_{k}"
            calyx.data.materials.append(mat_cengkeh)
            objs.append(calyx)
            
    return objs

def build_cangkir_blirik(textures):
    """
    Model 3D Cangkir Blirik Tradisional sesuai 'gambar cangkir.png':
    - Cangkir seng enamel terbuka (TANPA TUTUP, open mug)
    - Bibir cangkir bergaris hitam mengilap (black bead lip)
    - Bagian dalam putih bersih enamel
    - Corak lurik blirik hijau tua tentara khas angkringan di badan dan gagang
    - Gagang D-handle melengkung kokoh di sisi kiri
    """
    objs = []
    mat_blirik = create_pbr_material("Cangkir_Blirik_PBR", texture_img=textures['blirik'], roughness=0.18, coat=1.0)
    mat_black_rim = create_pbr_material("Cangkir_Rim_PBR", base_color=(0.06, 0.06, 0.06, 1.0), roughness=0.12, coat=1.0)
    mat_white_inner = create_pbr_material("Cangkir_White_Inner_PBR", base_color=(0.94, 0.95, 0.94, 1.0), roughness=0.20, coat=0.8)
    
    # 1. Badan Cangkir Terbuka
    bpy.ops.mesh.primitive_cylinder_add(radius=0.48, depth=0.82, vertices=36, location=(0, 0, 0.42))
    cup = bpy.context.active_object
    cup.name = "Cangkir_Badan_Blirik"
    cup.scale = (1.0, 1.0, 1.0)
    # Bevel bawah
    bev = cup.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.04
    bev.segments = 3
    
    # Solidify tipis layaknya cangkir seng
    sol = cup.modifiers.new("Solidify", "SOLIDIFY")
    sol.thickness = 0.024
    
    cup.data.materials.append(mat_blirik)
    objs.append(cup)
    
    # 2. Garis Bibir Hitam (Black Lip Bead Rim) - Sesuai referensi
    bpy.ops.mesh.primitive_torus_add(major_radius=0.48, minor_radius=0.018, major_segments=36, minor_segments=10, location=(0, 0, 0.83))
    rim = bpy.context.active_object
    rim.name = "Cangkir_Bibir_Hitam"
    rim.data.materials.append(mat_black_rim)
    objs.append(rim)
    
    # 3. Gagang D-Handle (Sisi Kiri)
    bm_h = bmesh.new()
    steps = 18
    r_tube = 0.038
    handle_rings = []
    
    for i in range(steps):
        t = i / float(steps - 1)
        ang = math.pi * 0.15 + t * math.pi * 0.70
        hx = -0.48 - math.sin(ang) * 0.32
        hz = 0.42 + math.cos(ang) * 0.30
        
        ring_v = []
        for a_idx in range(12):
            rad = a_idx * (math.tau / 12)
            dx = math.cos(rad) * r_tube
            dy = math.sin(rad) * r_tube
            dz = math.cos(rad) * r_tube * 0.3
            ring_v.append(bm_h.verts.new((hx + dx, dy, hz + dz)))
        handle_rings.append(ring_v)
        
    for i in range(steps - 1):
        for a_idx in range(12):
            a_next = (a_idx + 1) % 12
            bm_h.faces.new((handle_rings[i][a_idx], handle_rings[i][a_next],
                            handle_rings[i + 1][a_next], handle_rings[i + 1][a_idx]))
            
    h_mesh = bpy.data.meshes.new("Cup_Handle_Mesh")
    bm_h.to_mesh(h_mesh)
    bm_h.free()
    
    h_obj = bpy.data.objects.new("Cangkir_Gagang_Blirik", h_mesh)
    bpy.context.collection.objects.link(h_obj)
    h_obj.data.materials.append(mat_blirik)
    objs.append(h_obj)
    
    return objs

def build_serai_wangi(textures):
    """
    Model 3D Batang Serai Wangi sesuai 'gambar batang serai wangi.png':
    - 2 batang serai terikat rapi di tengah
    - Pangkal umbi bulat putih kekuningan (ivory) dengan serabut akar halus
    - Batang hijau muda segar memanjang
    - Helai daun atas meruncing dan menyebar anggun
    """
    objs = []
    mat_serai = create_pbr_material("Serai_Texture_PBR", texture_img=textures['serai'], roughness=0.62)
    mat_tie = create_pbr_material("Serai_Tie_PBR", base_color=(0.42, 0.58, 0.28, 1.0), roughness=0.75)
    mat_root = create_pbr_material("Serai_Root_PBR", base_color=(0.55, 0.45, 0.32, 1.0), roughness=0.90)
    
    stalk_offsets = [
        (-0.11, 0, 0.65, 0.05, -0.06),
        ( 0.11, 0, 0.65, -0.04, 0.05)
    ]
    
    for idx, (sx, sy, sz, rx, ry) in enumerate(stalk_offsets):
        # 1. Pangkal Umbi Bulat (Bulbous Base)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, radius=0.18, location=(sx, sy, 0.18))
        bulb = bpy.context.active_object
        bulb.name = f"Serai_Umbi_{idx}"
        bulb.scale = (0.95, 0.95, 1.45)
        bulb.data.materials.append(mat_serai)
        objs.append(bulb)
        
        # Serabut akar di bawah pangkal
        for r_i in range(8):
            ang = r_i * (math.tau / 8)
            rx_i = sx + math.cos(ang) * 0.08
            ry_i = sy + math.sin(ang) * 0.08
            bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.12, vertices=8, location=(rx_i, ry_i, 0.02), rotation=(0.3 * math.sin(ang), 0.3 * math.cos(ang), 0))
            root = bpy.context.active_object
            root.name = f"Serai_Root_{idx}_{r_i}"
            root.data.materials.append(mat_root)
            objs.append(root)
            
        # 2. Batang Utama (Main Stalk)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.95, vertices=20, location=(sx, sy, 0.68), rotation=(rx, ry, 0))
        stalk = bpy.context.active_object
        stalk.name = f"Serai_Batang_{idx}"
        stalk.data.materials.append(mat_serai)
        objs.append(stalk)
        
        # 3. Helai Daun Atas Menyebar (Fanning Leaves)
        for lf in range(4):
            l_ang = lf * (math.pi / 2.0) + idx * 0.5
            lx = sx + math.cos(l_ang) * 0.16
            ly = sy + math.sin(l_ang) * 0.16
            lz = 1.35
            bpy.ops.mesh.primitive_cone_add(radius1=0.065, radius2=0.005, depth=0.55, location=(lx, ly, lz), rotation=(0.35 * math.sin(l_ang), 0.35 * math.cos(l_ang), l_ang))
            leaf = bpy.context.active_object
            leaf.name = f"Serai_Daun_{idx}_{lf}"
            leaf.data.materials.append(mat_serai)
            objs.append(leaf)
            
    # Ikatan Daun Hijau di Tengah Batang (Green Leaf Knot)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.022, major_segments=28, minor_segments=8, location=(0, 0, 0.72))
    knot = bpy.context.active_object
    knot.name = "Serai_Tali_Ikatan"
    knot.scale = (1.2, 0.9, 1.0)
    knot.data.materials.append(mat_tie)
    objs.append(knot)
    
    return objs

def build_jahe_emprit():
    """Jahe emprit bakar multi-cabang dengan bercak gosong anglo"""
    objs = []
    mat_ginger = create_pbr_material("Ginger_Skin_PBR", base_color=(0.68, 0.52, 0.34, 1.0), roughness=0.72)
    mat_char = create_pbr_material("Ginger_Char_PBR", base_color=(0.12, 0.08, 0.05, 1.0), roughness=0.92)
    
    # Tubuh utama
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, radius=0.36, location=(0, 0, 0.28))
    main = bpy.context.active_object
    main.name = "Jahe_Utama"
    main.scale = (1.55, 0.95, 0.75)
    main.data.materials.append(mat_ginger)
    objs.append(main)
    
    # 3 Cabang Rimpang
    branches = [
        ( 0.42,  0.22, 0.35,  0.3, -0.4, 0.22),
        (-0.38,  0.25, 0.32, -0.2,  0.5, 0.18),
        (-0.15, -0.28, 0.28,  0.4,  0.2, 0.20)
    ]
    for b_i, (bx, by, bz, rx, ry, sz) in enumerate(branches):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=sz, location=(bx, by, bz), rotation=(rx, ry, 0))
        b_obj = bpy.context.active_object
        b_obj.name = f"Jahe_Cabang_{b_i}"
        b_obj.scale = (1.3, 0.9, 0.8)
        b_obj.data.materials.append(mat_ginger)
        objs.append(b_obj)
        
    # Bercak Gosong Bakar
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.14, location=(0.18, 0.10, 0.46))
    char = bpy.context.active_object
    char.name = "Jahe_Bercak_Gosong"
    char.scale = (1.4, 0.8, 0.3)
    char.data.materials.append(mat_char)
    objs.append(char)
    
    return objs

def build_cobek_ulekan():
    """Cobek dan Ulekan Batu Andesit Gunung Merapi"""
    objs = []
    mat_stone = create_pbr_material("Andesite_Stone_PBR", base_color=(0.28, 0.29, 0.30, 1.0), roughness=0.92)
    
    # Cobek Cekung
    bpy.ops.mesh.primitive_cylinder_add(radius=0.62, depth=0.22, vertices=32, location=(0, 0, 0.11))
    bowl = bpy.context.active_object
    bowl.name = "Cobek_Batu"
    bev = bowl.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.05
    bev.segments = 3
    bowl.data.materials.append(mat_stone)
    objs.append(bowl)
    
    # Cekungan Cobek Dalam
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.48, location=(0, 0, 0.26))
    cavity = bpy.context.active_object
    cavity.name = "Cavity_Cutter"
    
    b_mod = bowl.modifiers.new("CavBool", "BOOLEAN")
    b_mod.operation = 'DIFFERENCE'
    b_mod.object = cavity
    bpy.context.view_layer.objects.active = bowl
    bpy.ops.object.modifier_apply(modifier="CavBool")
    bpy.data.objects.remove(cavity, do_unlink=True)
    
    # Ulekan (Munthu L-shape)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.52, vertices=18, location=(0.12, 0.14, 0.32), rotation=(0.4, 0.6, 0.3))
    munthu = bpy.context.active_object
    munthu.name = "Munthu_Ulekan"
    bev_m = munthu.modifiers.new("Bevel", "BEVEL")
    bev_m.width = 0.03
    bev_m.segments = 2
    munthu.data.materials.append(mat_stone)
    objs.append(munthu)
    
    return objs

def build_kunyit():
    """Rimpang kunyit dengan penampang irisan oranye kunyit segar"""
    objs = []
    mat_skin = create_pbr_material("Kunyit_Skin_PBR", base_color=(0.58, 0.44, 0.26, 1.0), roughness=0.75)
    mat_core = create_pbr_material("Kunyit_Core_PBR", base_color=(0.95, 0.52, 0.04, 1.0), roughness=0.38)
    
    # Rimpang Kunyit
    bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.85, vertices=20, location=(0, 0, 0.42), rotation=(0.1, 0.25, 0))
    root = bpy.context.active_object
    root.name = "Kunyit_Rimpang"
    root.data.materials.append(mat_skin)
    objs.append(root)
    
    # Irisan Muka Oranye Kuning Pekat
    bpy.ops.mesh.primitive_cylinder_add(radius=0.138, depth=0.02, vertices=20, location=(0.08, 0, 0.84), rotation=(0.1, 0.25, 0))
    face = bpy.context.active_object
    face.name = "Kunyit_Irisan"
    face.data.materials.append(mat_core)
    objs.append(face)
    
    return objs

# ==============================================================================
# MAIN EXECUTION PIPELINE
# ==============================================================================

def main():
    print("=== MEMULAI GENERASI 3D MODEL BERDASARKAN GAMBAR REFERENSI ASLI ===")
    clear_all()
    
    # Buat tekstur prosedural
    textures = {
        'blirik': create_image_texture("Tex_Blirik", 256, 256, gen_cangkir_blirik_texture()),
        'wood': create_image_texture("Tex_Wood", 256, 256, gen_wood_texture(dark=False)),
        'wood_dark': create_image_texture("Tex_Wood_Dark", 256, 256, gen_wood_texture(dark=True)),
        'copper': create_image_texture("Tex_Copper", 256, 256, gen_copper_hammered_texture()),
        'cloth': create_image_texture("Tex_Cloth", 256, 256, gen_cloth_filter_texture()),
        'palm_dark': create_image_texture("Tex_Palm_Dark", 256, 256, gen_palm_sugar_texture(dark=True)),
        'palm_amber': create_image_texture("Tex_Palm_Amber", 256, 256, gen_palm_sugar_texture(dark=False)),
        'cinnamon': create_image_texture("Tex_Cinnamon", 256, 256, gen_cinnamon_texture()),
        'serai': create_image_texture("Tex_Serai", 256, 256, gen_serai_texture())
    }
    
    items = [
        ("toples.glb", build_toples_kawruh, "Toples Kawruh Kaca"),
        ("gula_aren.glb", build_gula_jawa, "Gula Jawa Aren"),
        ("saringan.glb", build_saringan_kain, "Saringan Kain"),
        ("sendok.glb", build_sendok_kayu, "Sendok Kayu"),
        ("kayu_manis.glb", build_kulit_kayu_manis, "Kulit Kayu Manis"),
        ("ceret.glb", build_ceret_tembaga, "Ceret Tembaga"),
        ("cengkeh.glb", build_cengkeh, "Bunga Cengkeh"),
        ("cangkir.glb", build_cangkir_blirik, "Cangkir Blirik"),
        ("serai.glb", build_serai_wangi, "Batang Serai Wangi"),
        ("jahe.glb", lambda t: build_jahe_emprit(), "Jahe Emprit Bakar"),
        ("cobek.glb", lambda t: build_cobek_ulekan(), "Cobek & Ulekan"),
        ("kunyit.glb", lambda t: build_kunyit(), "Rimpang Kunyit")
    ]
    
    all_created_objects = []
    
    for filename, builder_func, title in items:
        # Hapus objek mesh sementara sebelum build item berikutnya
        for obj in bpy.data.objects:
            bpy.data.objects.remove(obj, do_unlink=True)
            
        print(f"-> Membangun Model 3D: {title} ({filename})...")
        objs = builder_func(textures)
        
        # Gabungkan objek menjadi satu mesh gabungan per GLB
        bpy.ops.object.select_all(action='DESELECT')
        for o in objs:
            o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]
        bpy.ops.object.join()
        
        joined_obj = bpy.context.active_object
        joined_obj.name = filename.replace('.glb', '')
        
        # Ekspor ke GLB
        target_path = os.path.join(OUTPUT_DIR, filename)
        export_object_to_glb(joined_obj, target_path)
        all_created_objects.append(joined_obj)
        
    # Simpan master .blend
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print(f"=== SEMUA MODEL SELESAI DIEKSPOR! PROYEK TERSIMPAN DI {BLEND_PATH} ===")

if __name__ == "__main__":
    main()
