import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type {
  BackdropTheme,
  CameraBookmark,
  ExtractedTextureInfo,
  LiveSceneMetrics,
  StudioEnvPreset,
  ViewerShadingMode,
} from '../types';

export interface ModelCanvasHandle {
  captureScreenshot: () => string | null;
}

interface ModelCanvasProps {
  modelUrl: string | null;
  fileFormat: string;
  frontAxis: '+Z' | '-Z';
  companionFiles?: Map<string, string>;
  shading: ViewerShadingMode;
  envPreset: StudioEnvPreset;
  backdrop: BackdropTheme;
  exposure: number;
  lightAzimuthDeg: number;
  showSkeleton: boolean;
  showBounds: boolean;
  showGrid: boolean;
  turntableSpeed: number;
  armRelaxDeg: number;
  headYawDeg: number;
  cameraBookmark: CameraBookmark;
  cameraTrigger: number;
  onMetricsReady: (metrics: LiveSceneMetrics) => void;
  onFileDrop: (files: FileList) => void;
}

const ENV_LIGHTING: Record<
  StudioEnvPreset,
  { keyColor: number; keyInt: number; fillColor: number; fillInt: number; rimColor: number; rimInt: number }
> = {
  neutral: {
    keyColor: 0xfff9f2,
    keyInt: 2.4,
    fillColor: 0xc3dcff,
    fillInt: 1.05,
    rimColor: 0xe2eeff,
    rimInt: 1.65,
  },
  cyber: {
    keyColor: 0x5eead4,
    keyInt: 2.6,
    fillColor: 0x818cf8,
    fillInt: 1.4,
    rimColor: 0x38bdf8,
    rimInt: 2.45,
  },
  golden: {
    keyColor: 0xffcf96,
    keyInt: 2.75,
    fillColor: 0x93c5fd,
    fillInt: 0.82,
    rimColor: 0xfde68a,
    rimInt: 1.85,
  },
  dramatic: {
    keyColor: 0xffffff,
    keyInt: 3.25,
    fillColor: 0x1e293b,
    fillInt: 0.3,
    rimColor: 0x60a5fa,
    rimInt: 2.7,
  },
};

const BACKDROP_COLORS: Record<BackdropTheme, { bg: number; pedestal: number; gridA: number; gridB: number }> = {
  void: { bg: 0x090c13, pedestal: 0x101624, gridA: 0x223049, gridB: 0x131b2b },
  slate: { bg: 0x182030, pedestal: 0x202b40, gridA: 0x334463, gridB: 0x25324a },
  light: { bg: 0xe6ebf2, pedestal: 0xd5dde8, gridA: 0x94a3b8, gridB: 0xcbd5e1 },
};

export const ModelCanvas = React.forwardRef<ModelCanvasHandle, ModelCanvasProps>(
  (
    {
      modelUrl,
      fileFormat,
      frontAxis,
      companionFiles,
      shading,
      envPreset,
      backdrop,
      exposure,
      lightAzimuthDeg,
      showSkeleton,
      showBounds,
      showGrid,
      turntableSpeed,
      armRelaxDeg,
      headYawDeg,
      cameraBookmark,
      cameraTrigger,
      onMetricsReady,
      onFileDrop,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadPct, setLoadPct] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const rootGroupRef = useRef<THREE.Group | null>(null);
    const pedestalRef = useRef<THREE.Mesh | null>(null);
    const gridGroupRef = useRef<THREE.Group | null>(null);
    const skelHelperRef = useRef<THREE.SkeletonHelper | null>(null);
    const boxHelperRef = useRef<THREE.Box3Helper | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const origMatsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());
    const restPoseQuatsRef = useRef<Map<THREE.Bone, THREE.Quaternion>>(new Map());
    const rigBonesRef = useRef<Map<string, THREE.Bone>>(new Map());
    const modelDimsRef = useRef<[number, number, number]>([0.6, 1.7, 0.4]);

    const lightsRef = useRef<{
      rigGroup: THREE.Group;
      key: THREE.DirectionalLight;
      fill: THREE.DirectionalLight;
      rim: THREE.DirectionalLight;
    } | null>(null);

    const speedRef = useRef(turntableSpeed);
    speedRef.current = turntableSpeed;

    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        if (!renderer || !scene || !camera) return null;
        renderer.render(scene, camera);
        return renderer.domElement.toDataURL('image/png');
      },
    }));

    // Initialize WebGL2 Studio Scene once
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(BACKDROP_COLORS.void.bg);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        36,
        Math.max(1, el.clientWidth) / Math.max(1, el.clientHeight),
        0.03,
        80,
      );
      camera.position.set(0.76, 1.18, 2.52);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.innerHTML = '';
      el.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.72;
      pmrem.dispose();

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.065;
      controls.minDistance = 0.28;
      controls.maxDistance = 12.0;
      controls.target.set(0, 0.9, 0);
      controls.update();
      controlsRef.current = controls;

      // Ground Group
      const gridGroup = new THREE.Group();
      const pedGeo = new THREE.CircleGeometry(1.5, 72);
      pedGeo.rotateX(-Math.PI / 2);
      const pedMat = new THREE.MeshStandardMaterial({
        color: BACKDROP_COLORS.void.pedestal,
        roughness: 0.74,
        metalness: 0.14,
      });
      const pedestal = new THREE.Mesh(pedGeo, pedMat);
      pedestal.receiveShadow = true;
      pedestal.position.y = -0.001;
      pedestalRef.current = pedestal;
      gridGroup.add(pedestal);

      const ringGeo = new THREE.RingGeometry(0.72, 0.74, 72);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.001;
      gridGroup.add(ring);

      const grid = new THREE.GridHelper(5.0, 25, BACKDROP_COLORS.void.gridA, BACKDROP_COLORS.void.gridB);
      grid.position.y = 0.0005;
      gridGroup.add(grid);
      scene.add(gridGroup);
      gridGroupRef.current = gridGroup;

      // Rotatable 3-Point Studio Light Rig
      const lightGroup = new THREE.Group();
      const key = new THREE.DirectionalLight(0xfff9f2, 2.4);
      key.position.set(2.2, 3.2, 2.5);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.near = 0.4;
      key.shadow.camera.far = 10.0;
      const d = 1.5;
      key.shadow.camera.left = -d;
      key.shadow.camera.right = d;
      key.shadow.camera.top = d * 1.5;
      key.shadow.camera.bottom = -0.2;
      key.shadow.bias = -0.0004;
      lightGroup.add(key);

      const fill = new THREE.DirectionalLight(0xc3dcff, 1.05);
      fill.position.set(-2.5, 1.8, 1.6);
      lightGroup.add(fill);

      const rim = new THREE.DirectionalLight(0xe2eeff, 1.65);
      rim.position.set(0.0, 2.5, -2.6);
      lightGroup.add(rim);

      scene.add(lightGroup);
      lightsRef.current = { rigGroup: lightGroup, key, fill, rim };

      const modelRoot = new THREE.Group();
      scene.add(modelRoot);
      rootGroupRef.current = modelRoot;

      let raf = 0;
      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const dt = clock.getDelta();
        if (speedRef.current > 0 && rootGroupRef.current) {
          rootGroupRef.current.rotation.y += dt * speedRef.current;
        }
        if (mixerRef.current) {
          mixerRef.current.update(dt);
        }
        controls.update();
        renderer.render(scene, camera);
      };
      tick();

      const ro = new ResizeObserver(() => {
        if (!el || !rendererRef.current || !cameraRef.current) return;
        const w = Math.max(1, el.clientWidth);
        const h = Math.max(1, el.clientHeight);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      });
      ro.observe(el);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        controls.dispose();
        renderer.dispose();
        envTex.dispose();
      };
    }, []);

    // Load 3D Model (.glb, .gltf, .fbx, .obj, .stl, .ply)
    useEffect(() => {
      const scene = sceneRef.current;
      const root = rootGroupRef.current;
      const renderer = rendererRef.current;
      if (!scene || !root || !modelUrl) return;

      let cancelled = false;
      setLoading(true);
      setLoadPct(0);
      setErrorMsg(null);

      if (skelHelperRef.current) {
        scene.remove(skelHelperRef.current);
        skelHelperRef.current.dispose();
        skelHelperRef.current = null;
      }
      if (boxHelperRef.current) {
        scene.remove(boxHelperRef.current);
        boxHelperRef.current.dispose();
        boxHelperRef.current = null;
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      while (root.children.length > 0) {
        root.remove(root.children[0]);
      }
      root.rotation.set(0, 0, 0);
      origMatsRef.current.clear();
      restPoseQuatsRef.current.clear();
      rigBonesRef.current.clear();

      const manager = new THREE.LoadingManager();
      if (companionFiles && companionFiles.size > 0) {
        manager.setURLModifier((url) => {
          const clean = decodeURIComponent(url.split('/').pop() || url).toLowerCase();
          return companionFiles.get(clean) || url;
        });
      }

      const maxAniso = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
      const draco = new DRACOLoader(manager);
      // Relative ./draco/ works on GitHub Pages project subpaths AND root hosts!
      draco.setDecoderPath('./draco/');

      const onProgress = (ev: ProgressEvent<EventTarget>) => {
        if (ev.total > 0) {
          setLoadPct(Math.min(99, Math.round((ev.loaded / ev.total) * 100)));
        }
      };

      const finalizeObject = (obj: THREE.Object3D, clips: THREE.AnimationClip[] = []) => {
        if (cancelled) {
          draco.dispose();
          return;
        }

        if (frontAxis === '-Z') {
          obj.rotation.y = Math.PI;
        }

        // Normalize absurdly huge CAD/FBX centimeter models (> 8m tall) to studio meter scale
        const rawBox = new THREE.Box3().setFromObject(obj);
        if (!rawBox.isEmpty()) {
          const rawSize = rawBox.getSize(new THREE.Vector3());
          const maxSpan = Math.max(rawSize.x, rawSize.y, rawSize.z);
          if (maxSpan > 8.0 || maxSpan < 0.08) {
            const scaleFactor = 1.72 / Math.max(maxSpan, 1e-5);
            obj.scale.multiplyScalar(scaleFactor);
          }
        }

        const box = new THREE.Box3().setFromObject(obj);
        let dims: [number, number, number] = [0.6, 1.7, 0.4];
        if (!box.isEmpty()) {
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          obj.position.x -= center.x;
          obj.position.z -= center.z;
          obj.position.y -= box.min.y;
          dims = [
            Number(size.x.toFixed(3)),
            Number(size.y.toFixed(3)),
            Number(size.z.toFixed(3)),
          ];
          modelDimsRef.current = dims;
        }

        let verts = 0;
        let tris = 0;
        let meshes = 0;
        const matSet = new Set<string>();
        const extractedTextures: ExtractedTextureInfo[] = [];
        const seenTexUuid = new Set<string>();
        let skelRoot: THREE.Object3D | null = null;
        let maxBoneCnt = 0;
        let boneNames: string[] = [];

        obj.traverse((node) => {
          if ((node as THREE.Bone).isBone) {
            const b = node as THREE.Bone;
            restPoseQuatsRef.current.set(b, b.quaternion.clone());
            rigBonesRef.current.set(b.name.toLowerCase(), b);
          }

          const mesh = node as THREE.Mesh;
          if (mesh.isMesh) {
            meshes += 1;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const geo = mesh.geometry;
            if (geo) {
              const posCount = geo.attributes.position?.count || 0;
              verts += posCount;
              tris += geo.index ? Math.round(geo.index.count / 3) : Math.round(posCount / 3);
              if (!geo.attributes.normal) {
                geo.computeVertexNormals();
              }
            }

            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const m of mats) {
              if (!m) continue;
              matSet.add(m.uuid);
              const std = m as THREE.MeshStandardMaterial;
              const slots: Array<[THREE.Texture | null | undefined, ExtractedTextureInfo['channel']]> = [
                [std.map, 'albedo'],
                [std.normalMap, 'normal'],
                [std.roughnessMap || std.metalnessMap, 'orm'],
                [std.aoMap, 'ao'],
              ];
              for (const [tex, ch] of slots) {
                if (tex) {
                  tex.anisotropy = maxAniso;
                  tex.needsUpdate = true;
                  if (!seenTexUuid.has(tex.uuid)) {
                    seenTexUuid.add(tex.uuid);
                    const snap = snapshotThreeTexture(tex, ch, std.name || 'PBR_Material');
                    if (snap) extractedTextures.push(snap);
                  }
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
                  // Ignore degenerate UV triangles
                }
              }
            }

            origMatsRef.current.set(mesh.uuid, mesh.material);

            const skinned = mesh as THREE.SkinnedMesh;
            if (skinned.isSkinnedMesh && skinned.skeleton) {
              if (skinned.skeleton.bones.length > maxBoneCnt) {
                maxBoneCnt = skinned.skeleton.bones.length;
                boneNames = skinned.skeleton.bones.map((b) => b.name);
                skelRoot = skinned.skeleton.bones[0]?.parent || obj;
              }
            }
          }
        });

        root.add(obj);

        const groundedBox = new THREE.Box3().setFromObject(obj);
        const bHelper = new THREE.Box3Helper(groundedBox, new THREE.Color(0x38bdf8));
        bHelper.visible = showBounds;
        scene.add(bHelper);
        boxHelperRef.current = bHelper;

        if (skelRoot && maxBoneCnt > 0) {
          const sHelper = new THREE.SkeletonHelper(skelRoot);
          const lMat = sHelper.material as THREE.LineBasicMaterial;
          lMat.depthTest = false;
          sHelper.renderOrder = 999;
          sHelper.visible = showSkeleton;
          scene.add(sHelper);
          skelHelperRef.current = sHelper;
        }

        if (clips.length > 0) {
          const mixer = new THREE.AnimationMixer(obj);
          mixer.clipAction(clips[0]).play();
          mixerRef.current = mixer;
        }

        applyShading(root, shading, origMatsRef.current);
        frameCameraToDimensions(cameraRef.current, controlsRef.current, dims, 'hero');

        onMetricsReady({
          vertices: verts,
          triangles: tris,
          meshes,
          materials: matSet.size,
          bones: maxBoneCnt,
          boneNames,
          textures: extractedTextures,
          dimensions: dims,
          animations: clips.map((c) => c.name || 'Clip'),
        });

        setLoading(false);
        draco.dispose();
      };

      const failLoad = (err: unknown) => {
        if (cancelled) return;
        draco.dispose();
        setErrorMsg(err instanceof Error ? err.message : 'Unable to parse 3D model file');
        setLoading(false);
      };

      const fmt = fileFormat.toLowerCase().replace(/^\./, '');
      if (fmt === 'fbx') {
        new FBXLoader(manager).load(modelUrl, (group) => finalizeObject(group, group.animations), onProgress, failLoad);
      } else if (fmt === 'obj') {
        new OBJLoader(manager).load(
          modelUrl,
          (group) => {
            group.traverse((n) => {
              const m = n as THREE.Mesh;
              if (m.isMesh && !m.material) {
                m.material = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.48 });
              }
            });
            finalizeObject(group);
          },
          onProgress,
          failLoad,
        );
      } else if (fmt === 'stl') {
        new STLLoader(manager).load(
          modelUrl,
          (geo) => {
            geo.computeVertexNormals();
            const mesh = new THREE.Mesh(
              geo,
              new THREE.MeshStandardMaterial({ color: 0xb8c4d4, roughness: 0.42, metalness: 0.12 }),
            );
            const g = new THREE.Group();
            g.add(mesh);
            finalizeObject(g);
          },
          onProgress,
          failLoad,
        );
      } else if (fmt === 'ply') {
        new PLYLoader(manager).load(
          modelUrl,
          (geo) => {
            geo.computeVertexNormals();
            const hasVCol = Boolean(geo.attributes.color);
            const mesh = new THREE.Mesh(
              geo,
              new THREE.MeshStandardMaterial({
                color: 0xdbeafe,
                vertexColors: hasVCol,
                roughness: 0.45,
              }),
            );
            const g = new THREE.Group();
            g.add(mesh);
            finalizeObject(g);
          },
          onProgress,
          failLoad,
        );
      } else {
        const gltfLoader = new GLTFLoader(manager);
        gltfLoader.setDRACOLoader(draco);
        gltfLoader.load(
          modelUrl,
          (gltf) => finalizeObject(gltf.scene, gltf.animations || []),
          onProgress,
          failLoad,
        );
      }

      return () => {
        cancelled = true;
      };
    }, [modelUrl, fileFormat, frontAxis, companionFiles]);

    // Shading updates
    useEffect(() => {
      if (!rootGroupRef.current) return;
      applyShading(rootGroupRef.current, shading, origMatsRef.current);
    }, [shading]);

    // Lighting, Azimuth & Exposure updates
    useEffect(() => {
      const cfg = ENV_LIGHTING[envPreset];
      if (lightsRef.current) {
        lightsRef.current.key.color.setHex(cfg.keyColor);
        lightsRef.current.key.intensity = cfg.keyInt;
        lightsRef.current.fill.color.setHex(cfg.fillColor);
        lightsRef.current.fill.intensity = cfg.fillInt;
        lightsRef.current.rim.color.setHex(cfg.rimColor);
        lightsRef.current.rim.intensity = cfg.rimInt;
        lightsRef.current.rigGroup.rotation.y = THREE.MathUtils.degToRad(lightAzimuthDeg);
      }
      if (rendererRef.current) {
        rendererRef.current.toneMappingExposure = exposure;
      }
    }, [envPreset, exposure, lightAzimuthDeg]);

    // Backdrop & Grid updates
    useEffect(() => {
      const theme = BACKDROP_COLORS[backdrop];
      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(theme.bg);
      }
      if (pedestalRef.current) {
        (pedestalRef.current.material as THREE.MeshStandardMaterial).color.setHex(theme.pedestal);
      }
      if (gridGroupRef.current) {
        gridGroupRef.current.visible = showGrid;
      }
    }, [backdrop, showGrid]);

    // Skeleton & Bounds visibility
    useEffect(() => {
      if (skelHelperRef.current) skelHelperRef.current.visible = showSkeleton;
      if (boxHelperRef.current) boxHelperRef.current.visible = showBounds;
    }, [showSkeleton, showBounds]);

    // Live Rig Pose Driver (Arm T-Pose <-> Relaxed A-Pose & Head Yaw)
    useEffect(() => {
      const bones = rigBonesRef.current;
      const rests = restPoseQuatsRef.current;
      if (bones.size === 0) return;

      // Reset all bones to rest quaternion first
      rests.forEach((q, bone) => {
        bone.quaternion.copy(q);
      });
      rootGroupRef.current?.updateMatrixWorld(true);

      const rotateBoneInWorldAxis = (boneNames: string[], worldAxis: THREE.Vector3, deg: number) => {
        if (Math.abs(deg) < 0.05) return;
        for (const name of boneNames) {
          const bone = bones.get(name);
          const rest = bone ? rests.get(bone) : undefined;
          if (!bone || !rest || !bone.parent) continue;
          const parentWorldQ = new THREE.Quaternion();
          bone.parent.getWorldQuaternion(parentWorldQ);
          const localAxis = worldAxis.clone().applyQuaternion(parentWorldQ.invert()).normalize();
          const qDelta = new THREE.Quaternion().setFromAxisAngle(
            localAxis,
            THREE.MathUtils.degToRad(deg),
          );
          bone.quaternion.copy(qDelta.multiply(rest));
          bone.updateMatrixWorld(true);
          break;
        }
      };

      // Lower Left & Right Upper Arms cleanly in frontal plane (+Z world axis)
      rotateBoneInWorldAxis(['upperarm_l', 'leftarm', 'mixamorigleftarm'], new THREE.Vector3(0, 0, 1), armRelaxDeg);
      rotateBoneInWorldAxis(['upperarm_r', 'rightarm', 'mixamorigrightarm'], new THREE.Vector3(0, 0, 1), -armRelaxDeg);
      rotateBoneInWorldAxis(['head', 'mixamorighead'], new THREE.Vector3(0, 1, 0), headYawDeg);
    }, [armRelaxDeg, headYawDeg]);

    // Camera Bookmarks
    useEffect(() => {
      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.y = 0;
      }
      frameCameraToDimensions(
        cameraRef.current,
        controlsRef.current,
        modelDimsRef.current,
        cameraBookmark,
      );
    }, [cameraBookmark, cameraTrigger]);

    return (
      <div
        className={`mv-canvas-wrap ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileDrop(e.dataTransfer.files);
          }
        }}
      >
        <div ref={containerRef} className="mv-canvas-host" />

        {dragOver && (
          <div className="mv-drop-shield">
            <div className="mv-drop-box">
              <strong>Drop 3D Model to View Instantly</strong>
              <span>Supports .GLB · .GLTF · .FBX · .OBJ · .STL · .PLY (+ companion textures)</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="mv-loading-overlay">
            <div className="mv-spinner" />
            <div className="mv-loading-title">
              Decoding 3D Model {loadPct > 0 ? `(${loadPct}%)` : ''}
            </div>
            <div className="mv-loading-sub">
              Decompressing Draco geometry &amp; uploading WebP PBR maps to WebGL2 GPU…
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mv-loading-overlay mv-error">
            <div className="mv-loading-title">Could Not Load 3D Model</div>
            <div className="mv-loading-sub">{errorMsg}</div>
          </div>
        )}
      </div>
    );
  },
);

function snapshotThreeTexture(
  tex: THREE.Texture,
  channel: ExtractedTextureInfo['channel'],
  materialName: string,
): ExtractedTextureInfo | null {
  try {
    const img = tex.image as HTMLImageElement | ImageBitmap | HTMLCanvasElement | undefined;
    if (!img || !('width' in img) || !img.width || !img.height) return null;
    const canvas = document.createElement('canvas');
    const maxSide = 256;
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img as CanvasImageSource, 0, 0, canvas.width, canvas.height);
    return {
      id: tex.uuid,
      channel,
      materialName,
      width: img.width,
      height: img.height,
      dataUrl: canvas.toDataURL('image/webp', 0.85),
    };
  } catch {
    return null;
  }
}

function applyShading(
  root: THREE.Group,
  mode: ViewerShadingMode,
  origMap: Map<string, THREE.Material | THREE.Material[]>,
) {
  const clayMat = new THREE.MeshStandardMaterial({
    color: 0xb6b0a8,
    roughness: 0.43,
    metalness: 0.04,
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
  });
  const normalMat = new THREE.MeshNormalMaterial({ flatShading: false });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.09,
    metalness: 0.94,
  });

  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    const orig = origMap.get(mesh.uuid);
    if (!orig) return;

    if (mode === 'pbr') {
      mesh.material = orig;
      toggleWire(mesh.material, false);
    } else if (mode === 'texwire') {
      const cloneWire = (m: THREE.Material) => {
        const c = m.clone() as THREE.MeshStandardMaterial;
        c.wireframe = true;
        return c;
      };
      mesh.material = Array.isArray(orig) ? orig.map(cloneWire) : cloneWire(orig);
    } else if (mode === 'albedo') {
      const toUnlit = (m: THREE.Material) => {
        const std = m as THREE.MeshStandardMaterial;
        return new THREE.MeshBasicMaterial({
          map: std.map || null,
          color: std.map ? 0xffffff : std.color || 0xe2e8f0,
        });
      };
      mesh.material = Array.isArray(orig) ? orig.map(toUnlit) : toUnlit(orig);
    } else if (mode === 'wireframe') {
      mesh.material = wireMat;
    } else if (mode === 'normals') {
      mesh.material = normalMat;
    } else if (mode === 'clay') {
      mesh.material = clayMat;
    } else if (mode === 'chrome') {
      mesh.material = chromeMat;
    }
  });
}

function toggleWire(mat: THREE.Material | THREE.Material[], flag: boolean) {
  if (Array.isArray(mat)) {
    mat.forEach((m) => {
      if ('wireframe' in m) (m as THREE.MeshStandardMaterial).wireframe = flag;
    });
  } else if ('wireframe' in mat) {
    (mat as THREE.MeshStandardMaterial).wireframe = flag;
  }
}

function frameCameraToDimensions(
  cam: THREE.PerspectiveCamera | null,
  ctrl: OrbitControls | null,
  dims: [number, number, number],
  bookmark: CameraBookmark,
) {
  if (!cam || !ctrl) return;
  const h = Math.max(0.25, dims[1]);
  const midY = h * 0.53;
  const dist = Math.max(0.85, h * 1.48);

  switch (bookmark) {
    case 'front':
      cam.position.set(0, h * 0.58, dist * 1.05);
      ctrl.target.set(0, midY, 0);
      break;
    case 'back':
      cam.position.set(0, h * 0.58, -dist * 1.05);
      ctrl.target.set(0, midY, 0);
      break;
    case 'side':
      cam.position.set(dist * 1.05, h * 0.56, 0);
      ctrl.target.set(0, midY, 0);
      break;
    case 'portrait':
      cam.position.set(h * 0.1, h * 0.9, Math.max(0.36, h * 0.42));
      ctrl.target.set(0, h * 0.88, 0);
      break;
    case 'hero':
    case 'fit':
    default:
      cam.position.set(dist * 0.34, h * 0.68, dist);
      ctrl.target.set(0, midY, 0);
      break;
  }
  ctrl.update();
}
