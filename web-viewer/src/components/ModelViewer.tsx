import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RuntimeGeometryStats } from '../types/asset';

interface ModelViewerProps {
  modelUrl: string;
  format: 'GLB' | 'FBX' | 'OBJ' | 'STL';
  wireframe: boolean;
  showGrid: boolean;
  showAxes: boolean;
  resetSignal: number;
  onStatsLoaded?: (stats: RuntimeGeometryStats) => void;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  format,
  wireframe,
  showGrid,
  showAxes,
  resetSignal,
  onStatsLoaded,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRootRef = useRef<THREE.Object3D | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const axesRef = useRef<THREE.AxesHelper | null>(null);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d1117');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 2000);
    camera.position.set(3, 2, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controlsRef.current = controls;

    // Lighting
    const hemi = new THREE.HemisphereLight(0xddeeff, 0x222831, 1.2);
    scene.add(hemi);

    const dir1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dir1.position.set(6, 10, 8);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x88aaff, 0.8);
    dir2.position.set(-6, 4, -6);
    scene.add(dir2);

    const grid = new THREE.GridHelper(20, 20, 0x30363d, 0x1c2128);
    scene.add(grid);
    gridRef.current = grid;

    const axes = new THREE.AxesHelper(2);
    scene.add(axes);
    axesRef.current = axes;

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Toggle grid & axes
  useEffect(() => {
    if (gridRef.current) gridRef.current.visible = showGrid;
    if (axesRef.current) axesRef.current.visible = showAxes;
  }, [showGrid, showAxes]);

  // Toggle wireframe
  useEffect(() => {
    if (!modelRootRef.current) return;
    modelRootRef.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          if (m && 'wireframe' in m) {
            (m as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        });
      }
    });
  }, [wireframe]);

  // Frame camera to bounding box
  const frameModel = (root: THREE.Object3D) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.5);
    const dist = maxDim * 1.8;

    camera.position.set(center.x + dist * 0.7, center.y + dist * 0.45, center.z + dist * 0.7);
    camera.near = Math.max(0.01, maxDim * 0.005);
    camera.far = Math.max(200, maxDim * 25);
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();
  };

  useEffect(() => {
    if (modelRootRef.current) {
      frameModel(modelRootRef.current);
    }
  }, [resetSignal]);

  // Load model when URL or format changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !modelUrl) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    if (modelRootRef.current) {
      scene.remove(modelRootRef.current);
      modelRootRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => mat?.dispose());
        }
      });
      modelRootRef.current = null;
    }

    const finalize = (root: THREE.Object3D, animCount = 0) => {
      if (cancelled) return;
      modelRootRef.current = root;
      scene.add(root);
      frameModel(root);

      // Compute runtime stats
      let meshes = 0;
      let vertices = 0;
      let triangles = 0;
      const matSet = new Set<THREE.Material>();

      root.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          meshes++;
          const mesh = obj as THREE.Mesh;
          const geom = mesh.geometry;
          if (geom) {
            const pos = geom.getAttribute('position');
            if (pos) vertices += pos.count;
            if (geom.index) {
              triangles += Math.floor(geom.index.count / 3);
            } else if (pos) {
              triangles += Math.floor(pos.count / 3);
            }
          }
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            if (m) {
              matSet.add(m);
              if ('wireframe' in m) {
                (m as THREE.MeshStandardMaterial).wireframe = wireframe;
              }
            }
          });
        }
      });

      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());

      onStatsLoaded?.({
        meshes,
        vertices,
        triangles,
        materials: matSet.size,
        animations: animCount,
        boundingBox: {
          x: Number(size.x.toFixed(2)),
          y: Number(size.y.toFixed(2)),
          z: Number(size.z.toFixed(2)),
        },
      });
      setLoading(false);
    };

    const onError = (err: unknown) => {
      if (cancelled) return;
      setError(err instanceof Error ? err.message : 'Failed to load 3D model');
      setLoading(false);
    };

    if (format === 'GLB') {
      new GLTFLoader().load(
        modelUrl,
        (gltf) => finalize(gltf.scene, gltf.animations?.length || 0),
        undefined,
        onError
      );
    } else if (format === 'FBX') {
      new FBXLoader().load(
        modelUrl,
        (fbx) => finalize(fbx, fbx.animations?.length || 0),
        undefined,
        onError
      );
    } else if (format === 'OBJ') {
      new OBJLoader().load(modelUrl, (obj) => finalize(obj, 0), undefined, onError);
    } else if (format === 'STL') {
      new STLLoader().load(
        modelUrl,
        (geom) => {
          const mat = new THREE.MeshStandardMaterial({ color: 0x8b949e, roughness: 0.4, metalness: 0.3 });
          finalize(new THREE.Mesh(geom, mat), 0);
        },
        undefined,
        onError
      );
    }

    return () => {
      cancelled = true;
    };
  }, [modelUrl, format]);

  return (
    <div className="viewer-canvas-wrap">
      <div ref={containerRef} className="viewer-canvas" />
      {loading && <div className="viewer-overlay">Loading {format} model...</div>}
      {error && <div className="viewer-overlay error">{error}</div>}
    </div>
  );
};
