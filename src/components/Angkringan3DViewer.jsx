import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, Compass } from 'lucide-react';

export default function Angkringan3DViewer({ modelPath = '/assets/models/angkringan.glb' }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const defaultCamPos = useRef(new THREE.Vector3(2.6, 1.8, 3.2));
  const defaultTarget = useRef(new THREE.Vector3(0, 0.95, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 380;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.copy(defaultCamPos.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup (Atmosphere Malam Angkringan yang Hangat & Alami)
    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.1);
    scene.add(ambientLight);

    // Key Light - Cahaya Utama Hangat (Matahari petang / lampu jalan)
    const keyLight = new THREE.DirectionalLight(0xfff0db, 1.8);
    keyLight.position.set(3.5, 4.2, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light - Teal khas Palet Gredupedia dari sudut belakang
    const fillLight = new THREE.DirectionalLight(0x358c88, 0.9);
    fillLight.position.set(-3.2, 2.8, -2.5);
    scene.add(fillLight);

    // Point Light - Cahaya Lentera Sentir / Anglo (Pusat kehangatan gerobak)
    const lanternLight = new THREE.PointLight(0xffa238, 2.2, 6.0, 1.2);
    lanternLight.position.set(0.0, 1.6, 0.1);
    scene.add(lanternLight);

    // Anglo Light - Bara arang kompor
    const angloLight = new THREE.PointLight(0xff5511, 1.8, 3.5, 1.5);
    angloLight.position.set(0.68, 1.0, 0.0);
    scene.add(angloLight);

    // Ground Shadow Receiver (Lingkaran bayangan lembut di bawah gerobak)
    const shadowGeo = new THREE.PlaneGeometry(3.6, 2.4);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.002;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 5. OrbitControls (Interaksi Putar Halus)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.75;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.2;
    controls.maxDistance = 5.2;
    controls.minPolarAngle = Math.PI / 6; // 30 deg
    controls.maxPolarAngle = Math.PI / 2 + 0.02; // Tidak tembus bawah tanah
    controls.target.copy(defaultTarget.current);
    controlsRef.current = controls;

    const onUserInteractionStart = () => {
      setHasInteracted(true);
    };
    controls.addEventListener('start', onUserInteractionStart);

    // 6. Load 3D GLB Model
    let modelRoot = null;
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        modelRoot = gltf.scene;

        // Optimasi bayangan dan material dua sisi untuk terpal
        modelRoot.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              child.material.side = THREE.DoubleSide; // Terpal tampak dari luar dan dalam
              child.material.needsUpdate = true;
            }
          }
        });

        // Hitung bounding box agar model berada tepat di atas tanah
        const box = new THREE.Box3().setFromObject(modelRoot);
        const center = box.getCenter(new THREE.Vector3());
        
        // Posisikan alas gerobak tepat di Y=0
        modelRoot.position.x = -center.x;
        modelRoot.position.z = -center.z;
        modelRoot.position.y = -box.min.y;

        scene.add(modelRoot);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading Angkringan 3D model:', error);
        setLoading(false);
      }
    );

    // 7. Animation Loop (Breathing Animation & Subtle Hover)
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle breathing floating effect
      if (modelRoot) {
        modelRoot.position.y = Math.sin(elapsedTime * 1.2) * 0.012;
      }

      // Dynamic flickering of lantern & anglo lights
      lanternLight.intensity = 2.0 + Math.sin(elapsedTime * 4.5) * 0.18 + Math.cos(elapsedTime * 7.2) * 0.12;
      angloLight.intensity = 1.6 + Math.cos(elapsedTime * 5.0) * 0.22;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      controls.removeEventListener('start', onUserInteractionStart);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      scene.clear();
    };
  }, [modelPath]);

  // Handler: Reset Camera View
  const handleResetCamera = (e) => {
    e.stopPropagation();
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.copy(defaultCamPos.current);
      controlsRef.current.target.copy(defaultTarget.current);
      controlsRef.current.update();
    }
  };

  // Handler: Toggle Auto Rotate
  const handleToggleRotate = (e) => {
    e.stopPropagation();
    if (controlsRef.current) {
      const nextState = !controlsRef.current.autoRotate;
      controlsRef.current.autoRotate = nextState;
      setIsRotating(nextState);
    }
  };

  return (
    <div className="angkringan-3d-stage">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="angkringan-3d-canvas-wrap" />

      {/* Loading Overlay */}
      {loading && (
        <div className="angkringan-3d-loading">
          <div className="angkringan-loading-spinner" />
          <p>Memuat Model Gerobak 3D...</p>
        </div>
      )}

      {/* Floating Interactive Badge (Petunjuk Putar 360) */}
      {!loading && (
        <div className="angkringan-3d-overlay-ui">
          <div className={`interaction-hint-pill ${hasInteracted ? 'subtle' : ''}`}>
            <Compass size={14} className="pulse-icon" />
            <span>Sentuh & Geser untuk Memutar Gerobak 360°</span>
          </div>

          <div className="model-view-controls">
            <button
              className={`view-btn ${isRotating ? 'active' : ''}`}
              onClick={handleToggleRotate}
              title={isRotating ? 'Jeda Putaran Otomatis' : 'Aktifkan Putaran Otomatis'}
            >
              <RotateCw size={14} />
              <span>{isRotating ? 'Auto Putar' : 'Jeda'}</span>
            </button>
            <button
              className="view-btn"
              onClick={handleResetCamera}
              title="Kembalikan Sudut Pandang Awal"
            >
              <Compass size={14} />
              <span>Sudut Depan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
