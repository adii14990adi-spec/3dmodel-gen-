import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RuntimeGeometryStats } from '../types/asset';

export type CameraPreset = 'reset' | 'front' | 'side' | 'rear';

export interface AnimationClipInfo {
  name: string;
  duration: number;
}

interface ModelViewerProps {
  modelUrl: string;
  format: 'GLB' | 'FBX' | 'OBJ' | 'STL';
  wireframe: boolean;
  showGrid: boolean;
  showAxes: boolean;
  resetSignal: number;
  cameraPreset?: CameraPreset;
  selectedClip?: string;
  isPlaying?: boolean;
  loop?: boolean;
  playbackSpeed?: number;
  scrubTime?: number | null;
  movePreview?: boolean;
  intendedSpeed?: number;
  onStatsLoaded?: (stats: RuntimeGeometryStats) => void;
  onAnimationsLoaded?: (clips: AnimationClipInfo[]) => void;
  onTimeUpdate?: (time: number) => void;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  format,
  wireframe,
  showGrid,
  showAxes,
  resetSignal,
  cameraPreset = 'reset',
  selectedClip,
  isPlaying = true,
  loop = true,
  playbackSpeed = 1.0,
  scrubTime = null,
  movePreview = false,
  intendedSpeed = 1.35,
  onStatsLoaded,
  onAnimationsLoaded,
  onTimeUpdate,
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

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);

  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(playbackSpeed);
  const movePreviewRef = useRef(movePreview);
  const intendedSpeedRef = useRef(intendedSpeed);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  isPlayingRef.current = isPlaying;
  speedRef.current = playbackSpeed;
  movePreviewRef.current = movePreview;
  intendedSpeedRef.current = intendedSpeed;
  onTimeUpdateRef.current = onTimeUpdate;

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0f3f6');
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

    const hemi = new THREE.HemisphereLight(0xddeeff, 0x222831, 1.2);
    scene.add(hemi);

    const dir1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dir1.position.set(6, 10, 8);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x88aaff, 0.8);
    dir2.position.set(-6, 4, -6);
    scene.add(dir2);

    const grid = new THREE.GridHelper(20, 20, 0xb8c0c8, 0xd8dee4);
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

    const clock = new THREE.Clock();
    let animId = 0;
    let lastUiReport = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      if (mixerRef.current && isPlayingRef.current) {
        mixerRef.current.update(dt * speedRef.current);
        if (activeActionRef.current && onTimeUpdateRef.current) {
          const now = performance.now();
          if (now - lastUiReport > 50) {
            onTimeUpdateRef.current(activeActionRef.current.time);
            lastUiReport = now;
          }
        }
        if (movePreviewRef.current && modelRootRef.current) {
          modelRootRef.current.position.z += dt * intendedSpeedRef.current * speedRef.current;
          if (modelRootRef.current.position.z > 6.0) {
            modelRootRef.current.position.z = -6.0;
          }
        }
      }

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

  useEffect(() => {
    if (gridRef.current) gridRef.current.visible = showGrid;
    if (axesRef.current) axesRef.current.visible = showAxes;
  }, [showGrid, showAxes]);

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

  const frameModel = (root: THREE.Object3D, preset: CameraPreset = 'reset') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.5);
    const dist = maxDim * 1.8;

    if (preset === 'front') {
      camera.position.set(center.x, center.y + dist * 0.15, center.z + dist);
    } else if (preset === 'side') {
      camera.position.set(center.x + dist, center.y + dist * 0.15, center.z);
    } else if (preset === 'rear') {
      camera.position.set(center.x, center.y + dist * 0.15, center.z - dist);
    } else {
      camera.position.set(center.x + dist * 0.7, center.y + dist * 0.45, center.z + dist * 0.7);
    }

    camera.near = Math.max(0.01, maxDim * 0.005);
    camera.far = Math.max(200, maxDim * 25);
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();
  };

  useEffect(() => {
    if (modelRootRef.current) {
      modelRootRef.current.position.set(0, 0, 0);
      frameModel(modelRootRef.current, cameraPreset);
    }
  }, [resetSignal, cameraPreset]);

  // Update active animation clip & loop mode
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions.size || !selectedClip) return;
    const nextAction = actions.get(selectedClip);
    if (!nextAction) return;

    if (activeActionRef.current && activeActionRef.current !== nextAction) {
      activeActionRef.current.stop();
    }
    nextAction.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    nextAction.clampWhenFinished = !loop;
    nextAction.play();
    activeActionRef.current = nextAction;
  }, [selectedClip, loop]);

  // Scrubbing (updates pose even when paused)
  useEffect(() => {
    if (scrubTime === null || !mixerRef.current || !activeActionRef.current) return;
    activeActionRef.current.time = scrubTime;
    mixerRef.current.update(0);
  }, [scrubTime]);

  // Load model when URL or format changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !modelUrl) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    actionsRef.current.clear();
    activeActionRef.current = null;

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

    const finalize = (root: THREE.Object3D, animations: THREE.AnimationClip[] = []) => {
      if (cancelled) return;
      modelRootRef.current = root;
      scene.add(root);
      frameModel(root, 'reset');

      if (animations.length > 0) {
        const mixer = new THREE.AnimationMixer(root);
        mixerRef.current = mixer;
        const clipInfos: AnimationClipInfo[] = [];
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          actionsRef.current.set(clip.name, action);
          clipInfos.push({ name: clip.name, duration: clip.duration });
        });
        const first = mixer.clipAction(animations[0]);
        first.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
        first.play();
        activeActionRef.current = first;
        onAnimationsLoaded?.(clipInfos);
      } else {
        onAnimationsLoaded?.([]);
      }

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
        animations: animations.length,
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
        (gltf) => finalize(gltf.scene, gltf.animations || []),
        undefined,
        onError
      );
    } else if (format === 'FBX') {
      new FBXLoader().load(
        modelUrl,
        (fbx) => finalize(fbx, fbx.animations || []),
        undefined,
        onError
      );
    } else if (format === 'OBJ') {
      new OBJLoader().load(modelUrl, (obj) => finalize(obj, []), undefined, onError);
    } else if (format === 'STL') {
      new STLLoader().load(
        modelUrl,
        (geom) => {
          const mat = new THREE.MeshStandardMaterial({ color: 0x8b949e, roughness: 0.4, metalness: 0.3 });
          finalize(new THREE.Mesh(geom, mat), []);
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
