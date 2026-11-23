import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Box } from 'lucide-react';

export default function Item3DViewer({
  modelPath,
  itemName = 'Item Angkringan',
  height = 220,
  fallbackImage = null,
  showBadge = true,
  autoRotateSpeed = 2.0,
  compact = false,
  interactive = true,
  onClick = null
}) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const controlsRef = useRef(null);
  const turntableRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const autoRotateRef = useRef(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !modelPath) return;

    setLoading(true);
    setError(false);

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera Setup (Jarak pandang proporsional, seimbang & tidak terpotong)
    const width = container.clientWidth || 300;
    const heightPx = typeof height === 'number' ? height : parseInt(height, 10) || 220;
    const camera = new THREE.PerspectiveCamera(34, width / heightPx, 0.05, 50);
    camera.position.set(0.28, 0.48, 2.40);

    // 3. Renderer dengan ACESFilmic Tone Mapping & High Precision
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Room Environment (PBR Refleksi Kaca & Logam Realistis seperti di Blender)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // 5. Studio Multi-Point Lighting (Pencahayaan Statis Konsisten)
    const ambientLight = new THREE.AmbientLight(0xfff7ee, 1.25);
    scene.add(ambientLight);

    // Key Light - Cahaya Utama Atas-Kanan Menyinari Objek
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(2.2, 3.6, 2.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    scene.add(keyLight);

    // Fill Light - Sudut Kiri Bawah Lembut
    const fillLight = new THREE.DirectionalLight(0x358c88, 1.1);
    fillLight.position.set(-2.6, 1.8, -2.0);
    scene.add(fillLight);

    // Rim Light - Hangat dari Belakang
    const warmRimLight = new THREE.PointLight(0xffaa44, 1.8, 6.0, 1.2);
    warmRimLight.position.set(0.0, -0.6, 1.8);
    scene.add(warmRimLight);

    // 6. Sistem Bayangan Statis Menapak Tanah (Tidak Berputar Sendiri Secara Liar)
    // A. Contact Shadow Radial Texture (Pijakan Alami)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(25, 16, 10, 0.42)');
    grad.addColorStop(0.35, 'rgba(35, 22, 14, 0.22)');
    grad.addColorStop(0.70, 'rgba(50, 32, 20, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const contactShadowTex = new THREE.CanvasTexture(shadowCanvas);

    const contactGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const contactMesh = new THREE.Mesh(contactGeo, contactMat);
    contactMesh.rotation.x = -Math.PI / 2;
    contactMesh.position.y = -0.52;
    scene.add(contactMesh);

    // B. Real Directional Shadow Receiver Plane
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.24, depthWrite: false });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.518;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 7. Turntable Group (Hanya Objek yang Berputar di Atas Dudukan, Bayangan Tetap Menapak Alami)
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);
    turntableRef.current = turntableGroup;

    // 8. OrbitControls (Hanya untuk Interaksi Pengguna, Tidak Memutar Kamera Otomatis)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = false; // Kamera tetap diam; animasi putar dilakukan oleh Turntable Group
    controls.enablePan = false;
    controls.enableZoom = interactive;
    controls.enableRotate = interactive;
    controls.minDistance = 1.20; // Batas zoom in aman agar objek tidak terpotong
    controls.maxDistance = 4.2;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.target.set(0, 0.04, 0);
    controlsRef.current = controls;

    const onStart = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      autoRotateRef.current = false;
    };
    const onEnd = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        autoRotateRef.current = true;
      }, 1600);
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);

    // 9. Load GLB Model
    const loader = new GLTFLoader();
    let isDisposed = false;

    loader.load(
      modelPath,
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        // Auto-center and auto-scale to bounding box
        const bbox = new THREE.Box3().setFromObject(root);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1.0;

        // Skala proporsional: seluruh bentuk objek tampak utuh, indah, dan tidak terpotong
        const targetScale = (compact ? 0.95 : 1.08) / maxDim;
        root.scale.setScalar(targetScale);

        // Recenter
        bbox.setFromObject(root);
        bbox.getCenter(center);
        root.position.sub(center);

        // Posisikan alas model persis di atas bayangan lantai
        const updatedBox = new THREE.Box3().setFromObject(root);
        root.position.y += (-0.51 - updatedBox.min.y);

        // Optimalkan material PBR (refleksi kaca, logam, enamel, dan batu)
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              const matName = (child.material.name || '').toLowerCase();
              // Cek Material Kaca Toples Kawruh
              if (matName.includes('glass') || child.material.transmission > 0.1) {
                child.material.transparent = true;
                child.material.transmission = 0.94;
                child.material.roughness = 0.04;
                child.material.ior = 1.52;
                child.material.thickness = 0.45;
                child.material.envMapIntensity = 2.2;
                child.castShadow = true;
              } else if (child.material.metallic > 0.5) {
                child.material.envMapIntensity = 1.5;
              } else {
                child.material.envMapIntensity = 1.15;
              }
              child.material.needsUpdate = true;
            }
          }
        });

        turntableGroup.add(root);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn('Failed to load item 3D model:', modelPath, err);
        if (!isDisposed) {
          setError(true);
          setLoading(false);
        }
      }
    );

    // 10. Render Loop (Animasi Putar Turntable Halus & Alami)
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Putar turntable objek secara halus pada sumbu Y
      if (autoRotateRef.current && turntableRef.current) {
        turntableRef.current.rotation.y += autoRotateSpeed * 0.007;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 11. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = typeof height === 'number' ? height : container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 12. Cleanup
    return () => {
      isDisposed = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
      controls.dispose();

      contactShadowTex.dispose();
      envTexture.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, height, autoRotateSpeed, interactive, compact]);

  const handleResetCamera = (e) => {
    e.stopPropagation();
    if (controlsRef.current) {
      controlsRef.current.reset();
      autoRotateRef.current = true;
    }
    if (turntableRef.current) {
      turntableRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div
      className="item-3d-viewer-container"
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 248, 238, 0.08) 0%, rgba(20, 20, 26, 0.35) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100%', cursor: 'grab' }}
        title={`${itemName} - Geser kursor atau sentuh untuk memutar 3D`}
      />

      {/* Loading Indicator */}
      {loading && !error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(26, 26, 36, 0.65)',
            backdropFilter: 'blur(3px)',
            color: 'var(--color-cream-light)',
            fontSize: '0.8rem',
            zIndex: 2
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: 'var(--color-orange)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span>Memuat 3D...</span>
        </div>
      )}

      {/* Fallback Image jika Model Gagal */}
      {error && fallbackImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <img
            src={fallbackImage}
            alt={itemName}
            style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Floating Badge & Interactivity Controls */}
      {!loading && !error && (
        <>
          {showBadge && (
            <div
              style={{
                position: 'absolute',
                top: compact ? '4px' : '8px',
                left: compact ? '4px' : '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: compact ? '2px 6px' : '3px 8px',
                background: 'rgba(20, 20, 26, 0.75)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                fontSize: compact ? '0.62rem' : '0.68rem',
                color: 'var(--color-gold)',
                fontWeight: 700,
                letterSpacing: '0.4px',
                pointerEvents: 'none',
                zIndex: 3
              }}
            >
              <Box size={compact ? 10 : 12} />
              <span>3D</span>
            </div>
          )}

          {interactive && (
            <div
              style={{
                position: 'absolute',
                bottom: compact ? '4px' : '8px',
                right: compact ? '4px' : '8px',
                display: 'flex',
                gap: '4px',
                zIndex: 3
              }}
            >
              <button
                type="button"
                onClick={handleResetCamera}
                title="Reset Sudut Pandang Kamera"
                style={{
                  background: 'rgba(20, 20, 26, 0.75)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: compact ? '22px' : '28px',
                  height: compact ? '22px' : '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-cream-light)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <RotateCw size={compact ? 11 : 14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
