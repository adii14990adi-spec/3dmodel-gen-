import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AssetEntry } from '../types/asset';

type Verdict = 'good' | 'fix';

interface ReviewRecord {
  characterId: string;
  assetVersion: string;
  clipName: string;
  verdict: Verdict;
  notes: string;
  timestamp: string;
}

interface AnimationVerifierProps {
  characters: AssetEntry[];
}

export const AnimationVerifier: React.FC<AnimationVerifierProps> = ({ characters }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '');
  const selectedChar = useMemo(
    () => characters.find((c) => c.id === selectedCharId) || characters[0] || null,
    [characters, selectedCharId]
  );

  const [clips, setClips] = useState<THREE.AnimationClip[]>([]);
  const [selectedClipName, setSelectedClipName] = useState<string>('');
  const [playing, setPlaying] = useState<boolean>(true);
  const [loop, setLoop] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showBones, setShowBones] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [treadmill, setTreadmill] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');

  const [reviews, setReviews] = useState<Record<string, ReviewRecord>>(() => {
    try {
      return JSON.parse(localStorage.getItem('forge3d-anim-verify-v3') || '{}');
    } catch {
      return {};
    }
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const rootRef = useRef<THREE.Object3D | null>(null);
  const skelRef = useRef<THREE.SkeletonHelper | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);

  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const treadmillRef = useRef(treadmill);
  const intendedSpeedRef = useRef(1.35);

  playingRef.current = playing;
  speedRef.current = speed;
  treadmillRef.current = treadmill;
  intendedSpeedRef.current = Number(selectedChar?.parameters?.intended_speed_mps || 1.35);

  const reviewKey = (charId: string, ver: string, clip: string) =>
    `${charId}::${ver}::${clip}`;

  const saveReview = (verdict: Verdict) => {
    if (!selectedChar || !selectedClipName) return;
    const key = reviewKey(selectedChar.id, selectedChar.version, selectedClipName);
    const rec: ReviewRecord = {
      characterId: selectedChar.id,
      assetVersion: selectedChar.version,
      clipName: selectedClipName,
      verdict,
      notes,
      timestamp: new Date().toISOString(),
    };
    const next = { ...reviews, [key]: rec };
    setReviews(next);
    try {
      localStorage.setItem('forge3d-anim-verify-v3', JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const downloadReport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      reviews: Object.values(reviews),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forge3d_animation_review_report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Initialize Three.js once
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth || 360;
    const h = el.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0f3f6');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.05, 200);
    camera.position.set(2.8, 1.6, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.innerHTML = '';
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0.9, 0);
    controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    controlsRef.current = controls;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 1.3));
    const dl = new THREE.DirectionalLight(0xffffff, 1.8);
    dl.position.set(4, 8, 5);
    scene.add(dl);

    const grid = new THREE.GridHelper(20, 20, 0xb8c0c8, 0xd8dee4);
    scene.add(grid);
    gridRef.current = grid;

    const ro = new ResizeObserver(() => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    });
    ro.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    let lastUi = 0;
    let gridOffset = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.1);
      if (mixerRef.current && playingRef.current) {
        mixerRef.current.update(dt * speedRef.current);
        if (treadmillRef.current && gridRef.current) {
          gridOffset = (gridOffset - intendedSpeedRef.current * dt * speedRef.current) % 1;
          gridRef.current.position.z = gridOffset;
        }
        if (activeActionRef.current) {
          const now = performance.now();
          if (now - lastUi > 50) {
            setCurrentTime(activeActionRef.current.time);
            lastUi = now;
          }
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Reset treadmill grid when disabled
  useEffect(() => {
    if (!treadmill && gridRef.current) {
      gridRef.current.position.z = 0;
    }
  }, [treadmill]);

  // Toggle bones & wireframe
  useEffect(() => {
    if (skelRef.current) skelRef.current.visible = showBones;
  }, [showBones]);

  useEffect(() => {
    if (!rootRef.current) return;
    rootRef.current.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mats = Array.isArray((o as THREE.Mesh).material)
          ? ((o as THREE.Mesh).material as THREE.Material[])
          : [(o as THREE.Mesh).material as THREE.Material];
        mats.forEach((m) => {
          if (m && 'wireframe' in m) (m as THREE.MeshStandardMaterial).wireframe = wireframe;
        });
      }
    });
  }, [wireframe]);

  // Load selected character GLB
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !selectedChar?.glbPath) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setClips([]);
    setSelectedClipName('');
    setCurrentTime(0);
    setDuration(0);
    if (gridRef.current) gridRef.current.position.z = 0;

    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    actionsRef.current.clear();
    activeActionRef.current = null;

    if (skelRef.current) {
      scene.remove(skelRef.current);
      skelRef.current.dispose();
      skelRef.current = null;
    }
    if (rootRef.current) {
      scene.remove(rootRef.current);
      rootRef.current.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          (o as THREE.Mesh).geometry?.dispose();
          const mats = Array.isArray((o as THREE.Mesh).material)
            ? ((o as THREE.Mesh).material as THREE.Material[])
            : [(o as THREE.Mesh).material as THREE.Material];
          mats.forEach((m) => m?.dispose());
        }
      });
      rootRef.current = null;
    }

    new GLTFLoader().load(
      selectedChar.glbPath,
      (gltf) => {
        if (cancelled) return;
        const root = gltf.scene;
        rootRef.current = root;
        scene.add(root);

        const skel = new THREE.SkeletonHelper(root);
        skel.visible = showBones;
        scene.add(skel);
        skelRef.current = skel;

        const loadedClips = gltf.animations || [];
        setClips(loadedClips);

        if (loadedClips.length > 0) {
          const mixer = new THREE.AnimationMixer(root);
          mixerRef.current = mixer;
          loadedClips.forEach((c) => {
            actionsRef.current.set(c.name, mixer.clipAction(c));
          });
          // Default to Walk for current review milestone
          const walkClip =
            loadedClips.find((c) => c.name.toLowerCase().includes('walk')) || loadedClips[0];
          setSelectedClipName(walkClip.name);
        }
        setLoading(false);
      },
      undefined,
      (err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load character GLB');
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [selectedChar?.id]);

  // Activate selected clip
  useEffect(() => {
    if (!selectedClipName || !actionsRef.current.size) return;
    const next = actionsRef.current.get(selectedClipName);
    if (!next) return;

    if (activeActionRef.current && activeActionRef.current !== next) {
      activeActionRef.current.stop();
    }
    next.reset();
    next.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    next.clampWhenFinished = !loop;
    next.play();
    activeActionRef.current = next;
    setDuration(next.getClip().duration);
    setCurrentTime(0);
  }, [selectedClipName, loop]);

  const setCam = (preset: 'front' | 'side' | 'back' | 'three') => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const pos: Record<string, [number, number, number]> = {
      front: [0, 1.1, 4.2],
      side: [4.2, 1.1, 0],
      back: [0, 1.1, -4.2],
      three: [2.8, 1.6, 3.2],
    };
    cam.position.set(...pos[preset]);
    ctrl.target.set(0, 0.9, 0);
    ctrl.update();
  };

  const seek = (t: number) => {
    setPlaying(false);
    setCurrentTime(t);
    if (!activeActionRef.current || !mixerRef.current) return;
    activeActionRef.current.enabled = true;
    if (!activeActionRef.current.isRunning()) activeActionRef.current.play();
    activeActionRef.current.time = t;
    mixerRef.current.update(0);
  };

  const currentReview =
    selectedChar && selectedClipName
      ? reviews[reviewKey(selectedChar.id, selectedChar.version, selectedClipName)]
      : undefined;

  return (
    <div className="verifier-shell">
      <div className="verifier-sidebar">
        <div className="verifier-section">
          <small>Character</small>
          <select
            className="tool-btn"
            style={{ width: '100%' }}
            value={selectedChar?.id || ''}
            onChange={(e) => setSelectedCharId(e.target.value)}
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="verifier-section">
          <small>Clips ({clips.length})</small>
          <div className="verifier-clips">
            {clips.length === 0 && <span className="muted-note">No animation clips</span>}
            {clips.map((c) => {
              const r = selectedChar
                ? reviews[reviewKey(selectedChar.id, selectedChar.version, c.name)]
                : undefined;
              return (
                <button
                  key={c.name}
                  className={`tool-btn ${selectedClipName === c.name ? 'active' : ''}`}
                  onClick={() => setSelectedClipName(c.name)}
                >
                  {c.name} {r ? (r.verdict === 'good' ? '✓' : '!') : ''}
                </button>
              );
            })}
          </div>
        </div>

        <div className="verifier-section">
          <small>Playback</small>
          <div className="toolbar-group">
            <button className="tool-btn active" onClick={() => setPlaying((p) => !p)}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button className="tool-btn" onClick={() => seek(0)}>Restart</button>
            <button className={`tool-btn ${loop ? 'active' : ''}`} onClick={() => setLoop((l) => !l)}>
              Loop: {loop ? 'ON' : 'OFF'}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            style={{ width: '100%', marginTop: 6 }}
          />
          <small>{currentTime.toFixed(2)}s / {duration.toFixed(2)}s</small>
        </div>

        <div className="verifier-section">
          <small>Speed & View</small>
          <div className="toolbar-group" style={{ flexWrap: 'wrap' }}>
            <select className="tool-btn" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
            <button className={`tool-btn ${showBones ? 'active' : ''}`} onClick={() => setShowBones((b) => !b)}>
              Bones
            </button>
            <button className={`tool-btn ${wireframe ? 'active' : ''}`} onClick={() => setWireframe((w) => !w)}>
              Wire
            </button>
            <button className={`tool-btn ${treadmill ? 'active' : ''}`} onClick={() => setTreadmill((t) => !t)}>
              Treadmill
            </button>
          </div>
        </div>

        <div className="verifier-section">
          <small>Camera</small>
          <div className="toolbar-group">
            <button className="tool-btn" onClick={() => setCam('front')}>Front</button>
            <button className="tool-btn" onClick={() => setCam('side')}>Side</button>
            <button className="tool-btn" onClick={() => setCam('back')}>Back</button>
            <button className="tool-btn" onClick={() => setCam('three')}>3/4</button>
          </div>
        </div>

        <div className="verifier-section">
          <small>Owner Review ({currentReview ? currentReview.verdict.toUpperCase() : 'UNREVIEWED'})</small>
          <input
            type="text"
            className="search-input"
            placeholder="Optional feedback notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="toolbar-group" style={{ marginTop: 6 }}>
            <button className="tool-btn active" onClick={() => saveReview('good')}>Looks good</button>
            <button className="tool-btn" onClick={() => saveReview('fix')}>Needs fix</button>
            <button className="tool-btn" onClick={downloadReport}>Export JSON</button>
          </div>
        </div>
      </div>

      <div className="viewer-canvas-wrap" style={{ flex: 1 }}>
        <div ref={mountRef} className="viewer-canvas" />
        {loading && <div className="viewer-overlay">Loading character GLB...</div>}
        {error && <div className="viewer-overlay error">{error}</div>}
      </div>
    </div>
  );
};
