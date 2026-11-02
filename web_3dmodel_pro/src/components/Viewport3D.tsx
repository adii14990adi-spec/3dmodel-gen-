import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CameraPreset, LightingPreset, ShadingMode } from '../types';

interface Viewport3DProps {
  glbUrl: string | null;
  frontAxis: '+Z' | '-Z';
  shading: ShadingMode;
  lighting: LightingPreset;
  showSkeleton: boolean;
  autoTurn: boolean;
  activeLod: string;
  cameraPreset: CameraPreset;
  cameraTrigger: number;
}

const LIGHT_CONFIGS: Record<
  LightingPreset,
  {
    keyColor: number;
    keyInt: number;
    fillColor: number;
    fillInt: number;
    rimColor: number;
    rimInt: number;
    exposure: number;
  }
> = {
  studio: {
    keyColor: 0xfff8f0,
    keyInt: 2.35,
    fillColor: 0xbfd9ff,
    fillInt: 1.05,
    rimColor: 0xe6f0ff,
    rimInt: 1.65,
    exposure: 1.1,
  },
  cyber: {
    keyColor: 0x5eead4,
    keyInt: 2.5,
    fillColor: 0x818cf8,
    fillInt: 1.35,
    rimColor: 0x38bdf8,
    rimInt: 2.4,
    exposure: 1.15,
  },
  warm: {
    keyColor: 0xffd5a1,
    keyInt: 2.55,
    fillColor: 0x93c5fd,
    fillInt: 0.85,
    rimColor: 0xfde68a,
    rimInt: 1.75,
    exposure: 1.12,
  },
  dramatic: {
    keyColor: 0xffffff,
    keyInt: 3.1,
    fillColor: 0x1e293b,
    fillInt: 0.35,
    rimColor: 0x60a5fa,
    rimInt: 2.6,
    exposure: 1.04,
  },
};

export const Viewport3D: React.FC<Viewport3DProps> = ({
  glbUrl,
  frontAxis,
  shading,
  lighting,
  showSkeleton,
  autoTurn,
  activeLod,
  cameraPreset,
  cameraTrigger,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [meshStats, setMeshStats] = useState<{
    meshes: number;
    tris: number;
    bones: number;
    textures: number;
  }>({
    meshes: 0,
    tris: 0,
    bones: 0,
    textures: 0,
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const wireOverlayGroupRef = useRef<THREE.Group | null>(null);
  const skeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);
  const origMaterialsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());
  const lightsRef = useRef<{
    key: THREE.DirectionalLight;
    fill: THREE.DirectionalLight;
    rim: THREE.DirectionalLight;
  } | null>(null);
  const autoTurnRef = useRef(autoTurn);
  autoTurnRef.current = autoTurn;

  // Initialize Three.js Studio WebGL2 Context once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0e15);
    scene.fog = new THREE.FogExp2(0x0b0e15, 0.085);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      36,
      Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight),
      0.04,
      60,
    );
    camera.position.set(0.72, 1.18, 2.55);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.72;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.minDistance = 0.38;
    controls.maxDistance = 8.5;
    controls.target.set(0, 0.92, 0);
    controls.update();
    controlsRef.current = controls;

    // Studio Ground Disc + Calibration Grid
    const pedestalGeo = new THREE.CircleGeometry(1.45, 72);
    pedestalGeo.rotateX(-Math.PI / 2);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.72,
      metalness: 0.18,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.receiveShadow = true;
    pedestal.position.y = -0.001;
    scene.add(pedestal);

    const ringGeo = new THREE.RingGeometry(0.68, 0.7, 72);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.001;
    scene.add(ring);

    const grid = new THREE.GridHelper(4.8, 24, 0x1e293b, 0x141b29);
    grid.position.y = 0.0005;
    scene.add(grid);

    const key = new THREE.DirectionalLight(0xfff8f0, 2.35);
    key.position.set(2.2, 3.2, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 9.5;
    const d = 1.4;
    key.shadow.camera.left = -d;
    key.shadow.camera.right = d;
    key.shadow.camera.top = d * 1.5;
    key.shadow.camera.bottom = -0.2;
    key.shadow.bias = -0.0004;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xbfd9ff, 1.05);
    fill.position.set(-2.5, 1.8, 1.6);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xe6f0ff, 1.65);
    rim.position.set(0.0, 2.5, -2.6);
    scene.add(rim);

    lightsRef.current = { key, fill, rim };

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelRootRef.current = modelGroup;

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      if (autoTurnRef.current && modelRootRef.current) {
        modelRootRef.current.rotation.y += dt * 0.48;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      envTex.dispose();
    };
  }, []);

  // Load High-Poly Textured GLB whenever URL changes
  useEffect(() => {
    const scene = sceneRef.current;
    const root = modelRootRef.current;
    const renderer = rendererRef.current;
    if (!scene || !root || !glbUrl) return;

    let cancelled = false;
    setLoading(true);
    setLoadPct(0);
    setLoadErr(null);

    if (skeletonHelperRef.current) {
      scene.remove(skeletonHelperRef.current);
      skeletonHelperRef.current.dispose();
      skeletonHelperRef.current = null;
    }
    wireOverlayGroupRef.current = null;
    while (root.children.length > 0) {
      root.remove(root.children[0]);
    }
    root.rotation.set(0, 0, 0);
    origMaterialsRef.current.clear();

    const maxAniso = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      (gltf) => {
        if (cancelled) return;
        const loaded = gltf.scene;
        if (frontAxis === '-Z') {
          loaded.rotation.y = Math.PI;
        }

        const box = new THREE.Box3().setFromObject(loaded);
        if (!box.isEmpty()) {
          const center = box.getCenter(new THREE.Vector3());
          loaded.position.x -= center.x;
          loaded.position.z -= center.z;
          loaded.position.y -= box.min.y;
        }

        let meshCnt = 0;
        let triCnt = 0;
        let maxBones = 0;
        let skelRoot: THREE.Object3D | null = null;
        const uniqueTextures = new Set<string>();

        loaded.traverse((node) => {
          const mesh = node as THREE.Mesh;
          if (mesh.isMesh) {
            meshCnt += 1;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const geo = mesh.geometry;
            if (geo) {
              triCnt += geo.index
                ? Math.round(geo.index.count / 3)
                : Math.round((geo.attributes.position?.count || 0) / 3);
            }

            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const m of mats) {
              const std = m as THREE.MeshStandardMaterial;
              if (!std) continue;
              const texSlots = [std.map, std.normalMap, std.roughnessMap, std.metalnessMap, std.aoMap];
              for (const t of texSlots) {
                if (t) {
                  t.anisotropy = maxAniso;
                  t.needsUpdate = true;
                  uniqueTextures.add(t.uuid);
                }
              }
              if (
                std.normalMap &&
                geo &&
                geo.index &&
                geo.attributes.position &&
                geo.attributes.normal &&
                geo.attributes.uv &&
                !geo.attributes.tangent
              ) {
                try {
                  geo.computeTangents();
                } catch {
                  // Ignore non-manifold tangent edge cases
                }
              }
            }

            origMaterialsRef.current.set(mesh.uuid, mesh.material);
            const skinned = mesh as THREE.SkinnedMesh;
            if (skinned.isSkinnedMesh && skinned.skeleton) {
              if (skinned.skeleton.bones.length > maxBones) {
                maxBones = skinned.skeleton.bones.length;
                skelRoot = skinned.skeleton.bones[0]?.parent || loaded;
              }
            }
          }
        });

        root.add(loaded);

        if (skelRoot && maxBones > 0) {
          const helper = new THREE.SkeletonHelper(skelRoot);
          const helperMat = helper.material as THREE.LineBasicMaterial;
          helperMat.linewidth = 2;
          helperMat.depthTest = false;
          helper.renderOrder = 999;
          helper.visible = showSkeleton;
          scene.add(helper);
          skeletonHelperRef.current = helper;
        }

        setMeshStats({
          meshes: meshCnt,
          tris: triCnt,
          bones: maxBones,
          textures: uniqueTextures.size,
        });
        applyShadingToRoot(root, shading, origMaterialsRef.current);
        setLoading(false);
      },
      (ev) => {
        if (ev.total > 0) {
          setLoadPct(Math.min(99, Math.round((ev.loaded / ev.total) * 100)));
        }
      },
      (err) => {
        if (cancelled) return;
        setLoadErr(err instanceof Error ? err.message : 'Failed to load GLB stream');
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [glbUrl, frontAxis]);

  // Apply Shading Mode dynamically
  useEffect(() => {
    if (!modelRootRef.current) return;
    applyShadingToRoot(modelRootRef.current, shading, origMaterialsRef.current);
  }, [shading]);

  // Toggle Skeleton Overlay
  useEffect(() => {
    if (skeletonHelperRef.current) {
      skeletonHelperRef.current.visible = showSkeleton;
    }
  }, [showSkeleton]);

  // Apply Studio Lighting Rig Preset
  useEffect(() => {
    const cfg = LIGHT_CONFIGS[lighting];
    if (lightsRef.current) {
      lightsRef.current.key.color.setHex(cfg.keyColor);
      lightsRef.current.key.intensity = cfg.keyInt;
      lightsRef.current.fill.color.setHex(cfg.fillColor);
      lightsRef.current.fill.intensity = cfg.fillInt;
      lightsRef.current.rim.color.setHex(cfg.rimColor);
      lightsRef.current.rim.intensity = cfg.rimInt;
    }
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = cfg.exposure;
    }
  }, [lighting]);

  // Apply Camera Framing Presets
  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    if (modelRootRef.current) {
      modelRootRef.current.rotation.y = 0;
    }
    switch (cameraPreset) {
      case 'front':
        cam.position.set(0, 1.04, 2.65);
        ctrl.target.set(0, 0.92, 0);
        break;
      case 'back':
        cam.position.set(0, 1.04, -2.65);
        ctrl.target.set(0, 0.92, 0);
        break;
      case 'portrait':
        cam.position.set(0.18, 1.56, 0.72);
        ctrl.target.set(0, 1.52, 0);
        break;
      case 'three_quarter':
      case 'reset':
      default:
        cam.position.set(0.78, 1.18, 2.52);
        ctrl.target.set(0, 0.92, 0);
        break;
    }
    ctrl.update();
  }, [cameraPreset, cameraTrigger]);

  return (
    <div className="vp-shell">
      <div ref={mountRef} className="vp-canvas" />

      <div className="vp-hud-top">
        <span className="vp-pill vp-pill-accent">{activeLod}</span>
        <span className="vp-pill vp-pill-tex">
          {meshStats.textures > 0
            ? `${meshStats.textures} PBR TEXTURES · 16x ANISO`
            : 'UNTEX / SCALAR'}
        </span>
        <span className="vp-pill">{meshStats.tris.toLocaleString()} TRIS</span>
        <span className="vp-pill">{meshStats.meshes} SUB-MESHES</span>
        {meshStats.bones > 0 && <span className="vp-pill">{meshStats.bones} UE5 BONES</span>}
      </div>

      {loading && (
        <div className="vp-overlay">
          <div className="vp-spinner" />
          <div className="vp-loading-title">
            Streaming High-Poly Textured GLB {loadPct > 0 ? `(${loadPct}%)` : ''}
          </div>
          <div className="vp-loading-sub">
            Uploading 1K/2K PBR Albedo, Normal &amp; ORM textures to WebGL2 GPU…
          </div>
        </div>
      )}

      {loadErr && (
        <div className="vp-overlay vp-error">
          <div className="vp-loading-title">Viewport Load Error</div>
          <div className="vp-loading-sub">{loadErr}</div>
        </div>
      )}
    </div>
  );
};

function applyShadingToRoot(
  root: THREE.Group,
  mode: ShadingMode,
  origMap: Map<string, THREE.Material | THREE.Material[]>,
) {
  const clayMat = new THREE.MeshStandardMaterial({
    color: 0xb5afa8,
    roughness: 0.44,
    metalness: 0.04,
  });
  const normalMat = new THREE.MeshNormalMaterial({ flatShading: false });

  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    const orig = origMap.get(mesh.uuid);
    if (!orig) return;

    if (mode === 'pbr') {
      mesh.material = orig;
      setWireframeFlag(mesh.material, false);
    } else if (mode === 'texwire') {
      // Clone original textured PBR material with wireframe=true so textured yarns/colors show on topology!
      if (Array.isArray(orig)) {
        mesh.material = orig.map((m) => {
          const c = m.clone() as THREE.MeshStandardMaterial;
          c.wireframe = true;
          return c;
        });
      } else {
        const c = orig.clone() as THREE.MeshStandardMaterial;
        c.wireframe = true;
        mesh.material = c;
      }
    } else if (mode === 'albedo') {
      // Pure unlit UV BaseColor texture map inspection
      const toUnlit = (m: THREE.Material) => {
        const std = m as THREE.MeshStandardMaterial;
        return new THREE.MeshBasicMaterial({
          map: std.map || null,
          color: std.map ? 0xffffff : std.color || 0xdbeafe,
        });
      };
      mesh.material = Array.isArray(orig) ? orig.map(toUnlit) : toUnlit(orig);
    } else if (mode === 'clay') {
      mesh.material = clayMat;
    } else if (mode === 'normals') {
      mesh.material = normalMat;
    }
  });
}

function setWireframeFlag(mat: THREE.Material | THREE.Material[], flag: boolean) {
  if (Array.isArray(mat)) {
    mat.forEach((m) => {
      if ('wireframe' in m) (m as THREE.MeshStandardMaterial).wireframe = flag;
    });
  } else if ('wireframe' in mat) {
    (mat as THREE.MeshStandardMaterial).wireframe = flag;
  }
}
