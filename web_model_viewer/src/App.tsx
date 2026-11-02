import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModelCanvas, ModelCanvasHandle } from './components/ModelCanvas';
import type {
  BackdropTheme,
  CameraBookmark,
  ExtractedTextureInfo,
  LiveSceneMetrics,
  ShowcaseCatalog,
  ShowcaseModelItem,
  StudioEnvPreset,
  ViewerShadingMode,
} from './types';

type RightTab = 'studio' | 'pose' | 'textures';

const SUPPORTED_MESH_EXTS = new Set(['glb', 'gltf', 'fbx', 'obj', 'stl', 'ply']);

export const App: React.FC = () => {
  const canvasRef = useRef<ModelCanvasHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [models, setModels] = useState<ShowcaseModelItem[]>([]);
  const [repoUrl, setRepoUrl] = useState('https://github.com/adii14990adi-spec/3dmodel-gen-');
  const [selected, setSelected] = useState<ShowcaseModelItem | null>(null);
  const [companionFiles, setCompanionFiles] = useState<Map<string, string>>(new Map());
  const [liveMetrics, setLiveMetrics] = useState<LiveSceneMetrics | null>(null);

  // Studio Controls
  const [shading, setShading] = useState<ViewerShadingMode>('pbr');
  const [envPreset, setEnvPreset] = useState<StudioEnvPreset>('neutral');
  const [backdrop, setBackdrop] = useState<BackdropTheme>('void');
  const [exposure, setExposure] = useState<number>(1.1);
  const [lightAzimuth, setLightAzimuth] = useState<number>(0);
  const [turntableSpeed, setTurntableSpeed] = useState<number>(0.42);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [showBounds, setShowBounds] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Live Rig Pose Test Controls
  const [armRelaxDeg, setArmRelaxDeg] = useState<number>(0);
  const [headYawDeg, setHeadYawDeg] = useState<number>(0);

  // Camera & UI State
  const [cameraBookmark, setCameraBookmark] = useState<CameraBookmark>('hero');
  const [cameraTrigger, setCameraTrigger] = useState<number>(0);
  const [rightTab, setRightTab] = useState<RightTab>('studio');
  const [texFilter, setTexFilter] = useState<'all' | 'albedo' | 'normal' | 'orm'>('all');
  const [zoomedTex, setZoomedTex] = useState<ExtractedTextureInfo | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [copiedBanner, setCopiedBanner] = useState<string | null>(null);

  // Load static ./models/catalog.json & support ?model= deep links on GitHub Pages
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const resp = await fetch('./models/catalog.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const cat = (await resp.json()) as ShowcaseCatalog;
        if (!active) return;
        setModels(cat.models || []);
        if (cat.repository) setRepoUrl(cat.repository);

        const params = new URLSearchParams(window.location.search);
        const queryModel = params.get('model');
        if (queryModel) {
          const byId = (cat.models || []).find((m) => m.id === queryModel);
          if (byId) {
            setSelected(byId);
            return;
          }
          if (/^https?:\/\//i.test(queryModel) || queryModel.endsWith('.glb')) {
            const ext = (queryModel.split('?')[0].split('.').pop() || 'glb').toLowerCase();
            const remoteItem: ShowcaseModelItem = {
              id: 'remote-url-model',
              name: queryModel.split('/').pop() || 'Remote_3D_Model',
              subtitle: 'Loaded from ?model= URL parameter',
              category: 'Remote URL Asset',
              description: `Streamed directly from ${queryModel}`,
              glb_url: queryModel,
              front_axis: '+Z',
              vertices: 0,
              triangles: 0,
              sub_meshes: 1,
              bones: 0,
              skeleton: 'Auto-Detected',
              embedded_textures: 0,
              size_mb: 0,
              height_m: 1.7,
              tags: [ext.toUpperCase(), 'Remote Stream'],
              fileFormat: ext,
            };
            setModels([remoteItem, ...(cat.models || [])]);
            setSelected(remoteItem);
            return;
          }
        }

        if (cat.models && cat.models.length > 0) {
          setSelected(cat.models[0]);
        }
      } catch (err) {
        console.error('Failed loading catalog.json:', err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSelectModel = (item: ShowcaseModelItem) => {
    setSelected(item);
    setArmRelaxDeg(0);
    setHeadYawDeg(0);
    // Sync URL bar cleanly without page reload so GitHub Pages links are bookmarkable
    if (!item.isLocalUpload && item.id !== 'remote-url-model') {
      const url = new URL(window.location.href);
      url.searchParams.set('model', item.id);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleFilesLoaded = useCallback((fileList: FileList) => {
    const files = Array.from(fileList);
    let primaryMesh: File | null = null;
    const extras = new Map<string, string>();

    for (const f of files) {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (!primaryMesh && SUPPORTED_MESH_EXTS.has(ext)) {
        primaryMesh = f;
      } else {
        extras.set(f.name.toLowerCase(), URL.createObjectURL(f));
      }
    }

    if (!primaryMesh) return;
    const ext = (primaryMesh.name.split('.').pop() || 'glb').toLowerCase();
    const blobUrl = URL.createObjectURL(primaryMesh);
    const localItem: ShowcaseModelItem = {
      id: `local-${Date.now()}`,
      name: primaryMesh.name.replace(/\.[^.]+$/, ''),
      subtitle: `Local ${ext.toUpperCase()} · ${(primaryMesh.size / (1024 * 1024)).toFixed(2)} MB`,
      category: 'Browser Local File',
      description: 'Rendered 100% client-side in your browser WebGL2 context (zero server upload).',
      glb_url: blobUrl,
      front_axis: '+Z',
      vertices: 0,
      triangles: 0,
      sub_meshes: 1,
      bones: 0,
      skeleton: 'Auto-Inspected',
      embedded_textures: 0,
      size_mb: Number((primaryMesh.size / (1024 * 1024)).toFixed(2)),
      height_m: 1.7,
      tags: [ext.toUpperCase(), 'Local File'],
      isLocalUpload: true,
      fileFormat: ext,
    };

    setCompanionFiles(extras);
    setModels((prev) => [localItem, ...prev]);
    setSelected(localItem);
    setArmRelaxDeg(0);
    setHeadYawDeg(0);
  }, []);

  const handleLoadRemoteUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;
    const ext = (trimmed.split('?')[0].split('.').pop() || 'glb').toLowerCase();
    const remoteItem: ShowcaseModelItem = {
      id: `url-${Date.now()}`,
      name: trimmed.split('/').pop() || 'Remote_Model',
      subtitle: `Streamed ${ext.toUpperCase()} URL`,
      category: 'Remote URL',
      description: trimmed,
      glb_url: trimmed,
      front_axis: '+Z',
      vertices: 0,
      triangles: 0,
      sub_meshes: 1,
      bones: 0,
      skeleton: 'Auto-Inspected',
      embedded_textures: 0,
      size_mb: 0,
      height_m: 1.7,
      tags: [ext.toUpperCase(), 'Remote'],
      fileFormat: ext,
    };
    setModels((prev) => [remoteItem, ...prev]);
    setSelected(remoteItem);
    setCustomUrlInput('');
  };

  const handleCapturePng = () => {
    const dataUrl = canvasRef.current?.captureScreenshot();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${selected?.name || 'model_view'}_render.png`;
    a.click();
  };

  const handleCopyShareLink = async () => {
    const url = new URL(window.location.href);
    if (selected && !selected.isLocalUpload) {
      url.searchParams.set('model', selected.id.startsWith('url-') ? selected.glb_url : selected.id);
    }
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedBanner('Copied shareable GitHub Pages model link to clipboard!');
      setTimeout(() => setCopiedBanner(null), 2600);
    } catch {
      setCopiedBanner(url.toString());
      setTimeout(() => setCopiedBanner(null), 4000);
    }
  };

  const triggerCamera = (bm: CameraBookmark) => {
    setCameraBookmark(bm);
    setCameraTrigger((c) => c + 1);
  };

  const filteredTextures = useMemo(() => {
    const list = liveMetrics?.textures || [];
    if (texFilter === 'all') return list;
    return list.filter((t) => t.channel === texFilter);
  }, [liveMetrics, texFilter]);

  return (
    <div className="mv-shell">
      {/* Top GitHub Pages Studio Navbar */}
      <header className="mv-header">
        <div className="mv-brand">
          <div className="mv-logo">MV</div>
          <div>
            <div className="mv-title-row">
              <span className="mv-title">3DModel View</span>
              <span className="mv-gh-badge">GITHUB PAGES EDITION</span>
            </div>
            <div className="mv-subtitle">
              Static WebGL2 High-Poly PBR Model Viewer · GLB / GLTF / FBX / OBJ / STL / PLY
            </div>
          </div>
        </div>

        <div className="mv-header-actions">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".glb,.gltf,.fbx,.obj,.stl,.ply,.png,.jpg,.jpeg,.webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesLoaded(e.target.files);
                e.target.value = '';
              }
            }}
          />
          <button
            type="button"
            className="mv-btn mv-btn-accent"
            onClick={() => fileInputRef.current?.click()}
          >
            + Open Local 3D File
          </button>
          <button type="button" className="mv-btn" onClick={handleCapturePng}>
            Snapshot PNG
          </button>
          <button type="button" className="mv-btn" onClick={handleCopyShareLink}>
            Share Link
          </button>
          {selected && (
            <a
              href={selected.glb_url}
              download={`${selected.name}.${selected.fileFormat || 'glb'}`}
              className="mv-btn"
            >
              Download Model
            </a>
          )}
          <a href={repoUrl} target="_blank" rel="noreferrer" className="mv-btn mv-btn-ghost">
            GitHub Repo
          </a>
        </div>
      </header>

      {copiedBanner && <div className="mv-toast">{copiedBanner}</div>}

      {/* Main 3-Pane Model Viewer Layout */}
      <main className="mv-workspace">
        {/* LEFT PANE: Pre-Bundled High-Poly Showcase + Drag-Drop + Remote URL */}
        <aside className="mv-sidebar mv-left">
          <div className="mv-pane-head">
            <span>3D MODEL LIBRARY ({models.length})</span>
            <span className="mv-pill-mini">100% Static</span>
          </div>

          <div className="mv-scroll">
            <div
              className="mv-drop-card"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.length) handleFilesLoaded(e.dataTransfer.files);
              }}
            >
              <strong>Drag &amp; Drop Any 3D Model</strong>
              <span>.glb · .gltf · .fbx · .obj · .stl · .ply (client-side only)</span>
            </div>

            <form onSubmit={handleLoadRemoteUrl} className="mv-url-form">
              <input
                type="url"
                placeholder="Paste remote .glb / .obj URL…"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
              />
              <button type="submit">Load</button>
            </form>

            <div className="mv-card-list">
              {models.map((m) => (
                <div
                  key={m.id}
                  className={`mv-model-card ${selected?.id === m.id ? 'active' : ''}`}
                  onClick={() => handleSelectModel(m)}
                >
                  {m.preview_url && (
                    <img src={m.preview_url} alt={m.name} className="mv-card-thumb" />
                  )}
                  <div className="mv-card-body">
                    <div className="mv-card-title-row">
                      <span className="mv-card-title">{m.name}</span>
                      <span className="mv-size-tag">{m.size_mb > 0 ? `${m.size_mb} MB` : 'URL'}</span>
                    </div>
                    <div className="mv-card-sub">{m.subtitle}</div>
                    <div className="mv-tag-row">
                      {m.tags.map((t) => (
                        <span key={t} className="mv-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER STAGE: Real-Time 3D Viewport + HUD + Floating Shading/Camera Dock */}
        <section className="mv-stage-col">
          {/* Quick Showcase Switcher Strip */}
          <div className="mv-quick-strip">
            <span className="mv-quick-label">QUICK VIEW:</span>
            <div className="mv-quick-chips">
              {models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`mv-quick-chip ${selected?.id === m.id ? 'active' : ''}`}
                  onClick={() => handleSelectModel(m)}
                >
                  {m.preview_url && <img src={m.preview_url} alt="" />}
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mv-stage-box">
            <ModelCanvas
              ref={canvasRef}
              modelUrl={selected?.glb_url || null}
              fileFormat={selected?.fileFormat || 'glb'}
              frontAxis={selected?.front_axis || '+Z'}
              companionFiles={companionFiles}
              shading={shading}
              envPreset={envPreset}
              backdrop={backdrop}
              exposure={exposure}
              lightAzimuthDeg={lightAzimuth}
              showSkeleton={showSkeleton}
              showBounds={showBounds}
              showGrid={showGrid}
              turntableSpeed={turntableSpeed}
              armRelaxDeg={armRelaxDeg}
              headYawDeg={headYawDeg}
              cameraBookmark={cameraBookmark}
              cameraTrigger={cameraTrigger}
              onMetricsReady={setLiveMetrics}
              onFileDrop={handleFilesLoaded}
            />

            {/* Top-Left Live GPU Telemetry Pills */}
            {liveMetrics && (
              <div className="mv-hud-tl">
                <span className="mv-hud-pill mv-hud-cyan">
                  {liveMetrics.triangles.toLocaleString()} TRIS
                </span>
                <span className="mv-hud-pill mv-hud-emerald">
                  {liveMetrics.textures.length > 0
                    ? `${liveMetrics.textures.length} PBR TEXTURES`
                    : `${liveMetrics.materials} MATERIALS`}
                </span>
                <span className="mv-hud-pill">{liveMetrics.meshes} SUB-MESHES</span>
                {liveMetrics.bones > 0 && (
                  <span className="mv-hud-pill">{liveMetrics.bones} BONES</span>
                )}
                <span className="mv-hud-pill">
                  {liveMetrics.dimensions[1]}m H × {liveMetrics.dimensions[0]}m W
                </span>
              </div>
            )}

            {/* Bottom Floating Shading + Camera Dock */}
            <div className="mv-floating-dock">
              <div className="mv-dock-group">
                {(
                  [
                    ['pbr', 'Textured PBR'],
                    ['albedo', 'Albedo'],
                    ['texwire', 'Tex + Wire'],
                    ['wireframe', 'Wireframe'],
                    ['normals', 'Normals'],
                    ['clay', 'Clay'],
                    ['chrome', 'Chrome'],
                  ] as Array<[ViewerShadingMode, string]>
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    className={shading === mode ? 'active' : ''}
                    onClick={() => setShading(mode)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mv-dock-sep" />

              <div className="mv-dock-group">
                <button type="button" onClick={() => triggerCamera('hero')}>
                  3/4
                </button>
                <button type="button" onClick={() => triggerCamera('front')}>
                  Front
                </button>
                <button type="button" onClick={() => triggerCamera('side')}>
                  Side
                </button>
                <button type="button" onClick={() => triggerCamera('back')}>
                  Back
                </button>
                <button type="button" onClick={() => triggerCamera('portrait')}>
                  Close-Up
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANE: Studio Lighting, Live Rig Pose & Embedded Texture Inspector */}
        <aside className="mv-sidebar mv-right">
          <div className="mv-tabs">
            <button
              type="button"
              className={rightTab === 'studio' ? 'active' : ''}
              onClick={() => setRightTab('studio')}
            >
              Studio &amp; Light
            </button>
            <button
              type="button"
              className={rightTab === 'pose' ? 'active' : ''}
              onClick={() => setRightTab('pose')}
            >
              Rig &amp; Pose ({liveMetrics?.bones || 0})
            </button>
            <button
              type="button"
              className={rightTab === 'textures' ? 'active' : ''}
              onClick={() => setRightTab('textures')}
            >
              Textures ({liveMetrics?.textures.length || 0})
            </button>
          </div>

          <div className="mv-scroll">
            {rightTab === 'studio' && (
              <div className="mv-stack">
                {selected && (
                  <div className="mv-info-box">
                    <h4>{selected.name}</h4>
                    <p>{selected.description}</p>
                  </div>
                )}

                <div className="mv-control-block">
                  <label>HDR Studio Lighting Preset</label>
                  <div className="mv-seg-grid">
                    {(
                      [
                        ['neutral', '3-Point Studio'],
                        ['cyber', 'Cyber Neon'],
                        ['golden', 'Golden Hour'],
                        ['dramatic', 'Dramatic Rim'],
                      ] as Array<[StudioEnvPreset, string]>
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        className={envPreset === id ? 'active' : ''}
                        onClick={() => setEnvPreset(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mv-control-block">
                  <label>Key-Light Orbit Azimuth ({lightAzimuth}°)</label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={lightAzimuth}
                    onChange={(e) => setLightAzimuth(Number(e.target.value))}
                  />
                </div>

                <div className="mv-control-block">
                  <label>ACES Filmic Exposure ({exposure.toFixed(2)}×)</label>
                  <input
                    type="range"
                    min={0.45}
                    max={2.0}
                    step={0.05}
                    value={exposure}
                    onChange={(e) => setExposure(Number(e.target.value))}
                  />
                </div>

                <div className="mv-control-block">
                  <label>Turntable Speed ({turntableSpeed.toFixed(2)} rad/s)</label>
                  <input
                    type="range"
                    min={0}
                    max={1.6}
                    step={0.05}
                    value={turntableSpeed}
                    onChange={(e) => setTurntableSpeed(Number(e.target.value))}
                  />
                </div>

                <div className="mv-control-block">
                  <label>Viewport Backdrop</label>
                  <div className="mv-seg-row">
                    {(
                      [
                        ['void', 'Void Dark'],
                        ['slate', 'Slate Grey'],
                        ['light', 'Daylight'],
                      ] as Array<[BackdropTheme, string]>
                    ).map(([b, lbl]) => (
                      <button
                        key={b}
                        type="button"
                        className={backdrop === b ? 'active' : ''}
                        onClick={() => setBackdrop(b)}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mv-toggle-list">
                  <label className="mv-check">
                    <input
                      type="checkbox"
                      checked={showSkeleton}
                      onChange={(e) => setShowSkeleton(e.target.checked)}
                    />
                    3D Skeleton X-Ray Overlay
                  </label>
                  <label className="mv-check">
                    <input
                      type="checkbox"
                      checked={showBounds}
                      onChange={(e) => setShowBounds(e.target.checked)}
                    />
                    Metric Bounding Box Wireframe
                  </label>
                  <label className="mv-check">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                    />
                    Studio Ground Pedestal &amp; Grid
                  </label>
                </div>
              </div>
            )}

            {rightTab === 'pose' && (
              <div className="mv-stack">
                <div className="mv-info-box">
                  <h4>Interactive Rig &amp; Skinning Test</h4>
                  <p>
                    Drag the sliders below to deform skinned humanoid joints (UE5 Mannequin /
                    Mixamo) live in real-time WebGL2.
                  </p>
                </div>

                <label className="mv-check">
                  <input
                    type="checkbox"
                    checked={showSkeleton}
                    onChange={(e) => setShowSkeleton(e.target.checked)}
                  />
                  Display 3D Bone Hierarchy in Viewport
                </label>

                <div className="mv-control-block">
                  <label>Arm Pose: T-Pose ↔ Relaxed A-Pose ({armRelaxDeg}°)</label>
                  <input
                    type="range"
                    min={-15}
                    max={52}
                    step={1}
                    value={armRelaxDeg}
                    onChange={(e) => setArmRelaxDeg(Number(e.target.value))}
                    disabled={!liveMetrics || liveMetrics.bones === 0}
                  />
                </div>

                <div className="mv-control-block">
                  <label>Head Look Yaw ({headYawDeg}°)</label>
                  <input
                    type="range"
                    min={-38}
                    max={38}
                    step={1}
                    value={headYawDeg}
                    onChange={(e) => setHeadYawDeg(Number(e.target.value))}
                    disabled={!liveMetrics || liveMetrics.bones === 0}
                  />
                </div>

                <button
                  type="button"
                  className="mv-btn mv-w-full"
                  onClick={() => {
                    setArmRelaxDeg(0);
                    setHeadYawDeg(0);
                  }}
                >
                  Reset to Bind T-Pose
                </button>

                {liveMetrics && liveMetrics.boneNames.length > 0 && (
                  <div className="mv-bone-box">
                    <div className="mv-subhead">
                      Active Armature Joints ({liveMetrics.boneNames.length})
                    </div>
                    <div className="mv-bone-scroll">
                      {liveMetrics.boneNames.map((bn, idx) => (
                        <div key={`${bn}-${idx}`} className="mv-bone-item">
                          <span>{String(idx).padStart(2, '0')}</span>
                          <strong>{bn}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {rightTab === 'textures' && (
              <div className="mv-stack">
                <div className="mv-filter-row">
                  {(['all', 'albedo', 'normal', 'orm'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      className={texFilter === ch ? 'active' : ''}
                      onClick={() => setTexFilter(ch)}
                    >
                      {ch === 'all' ? 'All' : ch.toUpperCase()}
                    </button>
                  ))}
                </div>

                {filteredTextures.length === 0 ? (
                  <div className="mv-empty">No embedded textures in this channel.</div>
                ) : (
                  <div className="mv-tex-grid">
                    {filteredTextures.map((tex) => (
                      <div
                        key={tex.id}
                        className="mv-tex-card"
                        onClick={() => setZoomedTex(tex)}
                      >
                        <img src={tex.dataUrl} alt={tex.materialName} />
                        <div className="mv-tex-meta">
                          <span className={`mv-ch mv-ch-${tex.channel}`}>
                            {tex.channel.toUpperCase()}
                          </span>
                          <div className="mv-tex-name">{tex.materialName}</div>
                          <div className="mv-tex-dim">
                            {tex.width}×{tex.height}px
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Zoomed Texture Modal */}
      {zoomedTex && (
        <div className="mv-modal" onClick={() => setZoomedTex(null)}>
          <div className="mv-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="mv-modal-head">
              <div>
                <strong>{zoomedTex.materialName}</strong>
                <span>
                  {zoomedTex.channel.toUpperCase()} Map · {zoomedTex.width}×{zoomedTex.height}px
                </span>
              </div>
              <button type="button" className="mv-btn" onClick={() => setZoomedTex(null)}>
                Close
              </button>
            </div>
            <img src={zoomedTex.dataUrl} alt={zoomedTex.materialName} />
          </div>
        </div>
      )}
    </div>
  );
};
