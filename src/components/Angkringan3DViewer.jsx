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
  const defaultCamPos = useRef(new THREE.Vector3(2.60, 1.50, 3.10));
  const defaultTarget = useRef(new THREE.Vector3(0, 0.95, 0));

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

    // 4. Atmospheric Warm Lighting (Pencahayaan Statis Konsisten)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    // Key Light - Cahaya Hangat Utama (Arah selalu dari depan-kanan atas agar bayangan jatuh alami di belakang/bawah gerobak)
    const keyLight = new THREE.DirectionalLight(0xfff0db, 1.9);
    keyLight.position.set(2.4, 4.2, 2.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.camera.left = -2.6;
    keyLight.shadow.camera.right = 2.6;
    keyLight.shadow.camera.top = 2.6;
    keyLight.shadow.camera.bottom = -2.6;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 4;
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

    // 1. Real 3D Ground Shadow Receiver (Bayangan jatuh nyata di belakang/bawah gerobak, mengikuti siluet & roda)
    const groundShadowGeo = new THREE.PlaneGeometry(8.5, 8.5);
    const groundShadowMat = new THREE.ShadowMaterial({
      color: 0x24160c,
      opacity: 0.34,
      depthWrite: false
    });
    const groundShadowMesh = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadowMesh.rotation.x = -Math.PI / 2;
    groundShadowMesh.position.set(0, 0.001, 0);
    groundShadowMesh.receiveShadow = true;
    scene.add(groundShadowMesh);

    // 2. Contact Shadow Lembut di Bawah Pijakan Roda (Agar gerobak menapak mantap & tidak melayang)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 122);
    grad.addColorStop(0.0, 'rgba(30, 18, 10, 0.36)');
    grad.addColorStop(0.45, 'rgba(38, 24, 14, 0.18)');
    grad.addColorStop(0.78, 'rgba(48, 30, 18, 0.05)');
    grad.addColorStop(1.0, 'rgba(48, 30, 18, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const contactShadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactGeo = new THREE.PlaneGeometry(2.1, 2.1);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const contactShadowMesh = new THREE.Mesh(contactGeo, contactMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.set(0, 0.003, 0);
    scene.add(contactShadowMesh);

    // Grup Turntable Terpisah: Hanya Gerobak yang Berputar, Bayangan Tetap Diam di Satu Titik
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);

    // 5. OrbitControls (Interaksi Manual Pengguna; Putar Otomatis Dilakukan pada Gerobak Saja)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1.80; // Batas zoom in aman agar atap dan roda tidak pernah terpotong
    controls.maxDistance = 6.5;  // Jangkauan zoom out luas dan leluasa tanpa terpotong
    controls.minPolarAngle = Math.PI / 6; // ~30 deg (tampak atas anggun)
    controls.maxPolarAngle = Math.PI / 2 + 0.03; // Tidak tembus bawah tanah
    controls.target.copy(defaultTarget.current);
    controlsRef.current = controls;

    let isAutoSpinning = true;

    // Saat pengunjung menyentuh/menggeser: hentikan putaran otomatis seketika
    const handleInteractionStart = () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      isAutoSpinning = false;
    };

    // Setelah interaksi selesai: lanjutkan putaran lembut gerobak
    const handleInteractionEnd = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        isAutoSpinning = true;
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

        // Skala gerobak proporsional dan gagah di dalam panggung luas (tidak terpotong saat zoom)
        const dominantScale = 0.94;
        modelRoot.scale.setScalar(dominantScale);

        // Posisikan alas gerobak menapak mantap tepat di atas bayangan tanah
        const box = new THREE.Box3().setFromObject(modelRoot);
        const center = box.getCenter(new THREE.Vector3());
        modelRoot.position.x = -center.x;
        modelRoot.position.z = -center.z;
        modelRoot.position.y = -box.min.y;

        // Target kamera tepat di titik pusat vertikal gerobak (antara atap dan roda)
        const heightCart = box.max.y - box.min.y;
        defaultTarget.current.set(0, heightCart * 0.51, 0);
        controls.target.copy(defaultTarget.current);
        camera.lookAt(controls.target);

        turntableGroup.add(modelRoot);
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
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.elapsedTime;

      // Putar gerobak secara halus pada porosnya sementara bayangan jatuh tetap di belakang/bawah gerobak
      if (isAutoSpinning && modelRoot) {
        turntableGroup.rotation.y += delta * 0.28;
      }

      // Jaga arah keyLight selalu dari depan-kanan atas sudut pandang kamera
      // sehingga bayangan nyata tetap berada di belakang/bawah gerobak meski kamera diputar 360 derajat
      const camAzimuth = Math.atan2(camera.position.x, camera.position.z);
      const lightAngle = camAzimuth + 0.42; // sedikit ke kanan depan kamera
      keyLight.position.set(
        Math.sin(lightAngle) * 3.6,
        4.3,
        Math.cos(lightAngle) * 3.6
      );

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
