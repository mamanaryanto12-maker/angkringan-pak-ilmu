import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  const modelRef = useRef(null);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !modelPath) return;

    setLoading(true);
    setError(false);

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const width = container.clientWidth || 300;
    const heightPx = typeof height === 'number' ? height : parseInt(height, 10) || 220;
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 50);
    camera.position.set(2.0, 1.4, 2.4);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup (Harmonis dengan Palet Angkringan & PBR Shaders)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff2e0, 2.4);
    keyLight.position.set(3.2, 4.0, 2.8);
    scene.add(keyLight);

    // Teal fill rim light khas identitas Gredupedia
    const fillLight = new THREE.DirectionalLight(0x358c88, 1.1);
    fillLight.position.set(-3.0, 1.8, -2.5);
    scene.add(fillLight);

    // Warm amber backlight untuk memunculkan siluet & pantulan logam/kayu
    const warmRimLight = new THREE.PointLight(0xffaa44, 1.8, 8.0, 1.4);
    warmRimLight.position.set(0.0, -1.2, 1.5);
    scene.add(warmRimLight);

    // Shadow receiver plane halus di bawah objek
    const shadowGeo = new THREE.PlaneGeometry(3.0, 3.0);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.75;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enablePan = false;
    controls.enableZoom = interactive;
    controls.enableRotate = interactive;
    controls.minDistance = 1.3;
    controls.maxDistance = 4.2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    const onStart = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      controls.autoRotate = false;
    };
    const onEnd = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        controls.autoRotate = true;
      }, 1500);
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);

    // 6. Load GLB Model
    const loader = new GLTFLoader();
    let isDisposed = false;

    loader.load(
      modelPath,
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;
        modelRef.current = root;

        // Auto-center and auto-scale to bounding box
        const bbox = new THREE.Box3().setFromObject(root);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1.0;

        // Skala standar agar pas di viewport
        const targetScale = 1.55 / maxDim;
        root.scale.setScalar(targetScale);

        // Recenter
        bbox.setFromObject(root);
        bbox.getCenter(center);
        root.position.sub(center);

        // Sedikit miringkan sudut pandang default agar estetis
        root.rotation.y = 0.35;

        // Aktifkan shadows & specular
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.0;
              child.material.needsUpdate = true;
            }
          }
        });

        scene.add(root);
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

    // 7. Render Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
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

    // Cleanup
    return () => {
      isDisposed = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
      controls.dispose();

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, height, autoRotateSpeed]);

  const handleResetCamera = (e) => {
    e.stopPropagation();
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.autoRotate = true;
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
              width: '26px',
              height: '26px',
              border: '2.5px solid rgba(255, 170, 68, 0.25)',
              borderTopColor: 'var(--color-orange)',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite'
            }}
          />
          <span>Memuat model 3D...</span>
        </div>
      )}

      {/* Fallback Image jika WebGL/Model gagal */}
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

      {/* Badge Interaktif 3D */}
      {!compact && showBadge && !loading && !error && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            background: 'rgba(18, 18, 24, 0.72)',
            backdropFilter: 'blur(4px)',
            borderRadius: '999px',
            border: '1px solid rgba(255, 170, 68, 0.35)',
            color: 'var(--color-orange)',
            fontSize: '0.68rem',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <Box size={11} />
          <span>3D Interaktif</span>
        </div>
      )}

      {/* Tombol Reset Tampilan */}
      {!compact && !loading && !error && (
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Sudut Pandang"
          aria-label="Reset sudut pandang 3D"
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(20, 20, 28, 0.75)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--color-cream-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 3
          }}
        >
          <RotateCw size={13} />
        </button>
      )}

      {/* Hint Teks Geser */}
      {!compact && !loading && !error && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            color: 'rgba(245, 242, 235, 0.55)',
            fontSize: '0.65rem',
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          Geser untuk memutar
        </div>
      )}
    </div>
  );
}
