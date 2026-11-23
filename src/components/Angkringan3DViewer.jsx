import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Angkringan3DViewer({ modelPath = '/assets/models/angkringan.glb' }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const defaultCamPos = useRef(new THREE.Vector3(2.35, 1.45, 2.95));
  const defaultTarget = useRef(new THREE.Vector3(0, 0.82, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup (Area Viewport Sangat Luas, Framing Proporsional & Bebas Terpotong)
    const width = container.clientWidth || 1080;
    const height = container.clientHeight || 560;
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.05, 100);
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
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 4. Atmospheric Warm Lighting (Nuansa Angkringan Elegan & Hidup)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.15);
    scene.add(ambientLight);

    // Key Light - Cahaya Hangat
    const keyLight = new THREE.DirectionalLight(0xfff0db, 1.85);
    keyLight.position.set(3.5, 4.2, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light - Teal khas Palet Gredupedia dari sudut belakang
    const fillLight = new THREE.DirectionalLight(0x358c88, 0.95);
    fillLight.position.set(-3.2, 2.8, -2.5);
    scene.add(fillLight);

    // Point Light - Lentera Sentir di bawah atap
    const lanternLight = new THREE.PointLight(0xffa238, 2.3, 6.0, 1.2);
    lanternLight.position.set(0.0, 1.6, 0.1);
    scene.add(lanternLight);

    // Anglo Light - Bara arang kompor
    const angloLight = new THREE.PointLight(0xff5511, 1.9, 3.5, 1.5);
    angloLight.position.set(0.68, 1.0, 0.0);
    scene.add(angloLight);

    // Ground Shadow Receiver (Bayangan lembut menapak tanah)
    const shadowGeo = new THREE.PlaneGeometry(3.8, 2.6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.002;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 5. OrbitControls (Animasi Putar Otomatis 360° & Zoom In/Out Luas)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.95; // Kecepatan rotasi natural & halus
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 0.95; // Jangkauan zoom in sangat dekat untuk melihat detail perkakas & teko
    controls.maxDistance = 6.0;  // Jangkauan zoom out luas dan leluasa tanpa terpotong
    controls.minPolarAngle = Math.PI / 6; // ~30 deg (tampak atas anggun)
    controls.maxPolarAngle = Math.PI / 2 + 0.04; // Tidak tembus bawah tanah
    controls.target.copy(defaultTarget.current);
    controlsRef.current = controls;

    // Saat pengunjung menyentuh/menggeser: hentikan putaran otomatis seketika
    const handleInteractionStart = () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      controls.autoRotate = false;
    };

    // Setelah interaksi selesai: jalankan kembali rotasi otomatis secara halus
    const handleInteractionEnd = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        controls.autoRotate = true;
      }, 1600);
    };

    controls.addEventListener('start', handleInteractionStart);
    controls.addEventListener('end', handleInteractionEnd);

    // 6. Load Model GLB
    let modelRoot = null;
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        modelRoot = gltf.scene;

        modelRoot.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
            }
          }
        });

        // Skala gerobak proporsional dan gagah di dalam panggung luas
        const dominantScale = 1.08;
        modelRoot.scale.setScalar(dominantScale);

        // Posisikan alas gerobak tepat di atas tanah & titik tumpu kamera seimbang
        const box = new THREE.Box3().setFromObject(modelRoot);
        const center = box.getCenter(new THREE.Vector3());
        modelRoot.position.x = -center.x;
        modelRoot.position.z = -center.z;
        modelRoot.position.y = -box.min.y;

        // Target kamera di tengah vertikal gerobak
        const heightCart = box.max.y - box.min.y;
        defaultTarget.current.set(0, heightCart * 0.46, 0);
        controls.target.copy(defaultTarget.current);

        scene.add(modelRoot);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading Angkringan 3D model:', error);
        setLoading(false);
      }
    );

    // 7. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gerakan mengambang / bernapas mikro yang sangat halus
      if (modelRoot) {
        modelRoot.position.y = Math.sin(elapsedTime * 1.2) * 0.01;
      }

      // Kedipan hangat api lentera & bara arang
      lanternLight.intensity = 2.1 + Math.sin(elapsedTime * 4.5) * 0.18 + Math.cos(elapsedTime * 7.2) * 0.12;
      angloLight.intensity = 1.7 + Math.cos(elapsedTime * 5.0) * 0.20;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Responsive Resize
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
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      controls.removeEventListener('start', handleInteractionStart);
      controls.removeEventListener('end', handleInteractionEnd);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      scene.clear();
    };
  }, [modelPath]);

  return (
    <div className="angkringan-3d-stage">
      <div ref={mountRef} className="angkringan-3d-canvas-wrap" />

      {loading && (
        <div className="angkringan-3d-loading">
          <div className="angkringan-loading-spinner" />
          <p>Menyiapkan Gerobak 3D...</p>
        </div>
      )}
    </div>
  );
}
