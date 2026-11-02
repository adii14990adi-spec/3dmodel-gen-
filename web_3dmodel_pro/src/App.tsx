import React, { useEffect, useMemo, useState } from 'react';
import {
  deleteModel,
  fetchCatalog,
  fetchModelDetail,
  fetchModels,
  forgeHighPolyCharacter,
  seedFlagshipModel,
  upresToHighPoly,
} from './api';
import { Viewport3D } from './components/Viewport3D';
import {
  CameraPreset,
  HighPolyAsset,
  LightingPreset,
  ProCatalog,
  ShadingMode,
  TextureMapCard,
} from './types';

type LeftTab = 'vault' | 'forge' | 'upres';
type RightTab = 'textures' | 'lods' | 'rig' | 'renders';

const SWATCH_LABELS: Array<{ key: string; label: string }> = [
  { key: 'skin_hex', label: 'Epidermal Skin SSS' },
  { key: 'hair_hex', label: 'Strand Groom Albedo' },
  { key: 'top_hex', label: 'Camisole Rib-Knit' },
  { key: 'denim_hex', label: 'Stonewash Denim Twill' },
  { key: 'belt_hex', label: 'Pebbled Leather Belt' },
  { key: 'metal_hex', label: 'Brushed Metal Hardware' },
  { key: 'shoes_hex', label: 'Tumbled Leather Sneakers' },
];

export const App: React.FC = () => {
  const [catalog, setCatalog] = useState<ProCatalog | null>(null);
  const [models, setModels] = useState<HighPolyAsset[]>([]);
  const [selected, setSelected] = useState<HighPolyAsset | null>(null);
  const [activeLod, setActiveLod] = useState<string>('LOD0');

  const [leftTab, setLeftTab] = useState<LeftTab>('vault');
  const [rightTab, setRightTab] = useState<RightTab>('textures');
  const [texFilter, setTexFilter] = useState<'all' | 'albedo' | 'normal' | 'orm'>('all');
  const [zoomedTex, setZoomedTex] = useState<TextureMapCard | null>(null);

  // Viewport controls
  const [shading, setShading] = useState<ShadingMode>('pbr');
  const [lighting, setLighting] = useState<LightingPreset>('studio');
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [autoTurn, setAutoTurn] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('three_quarter');
  const [cameraTrigger, setCameraTrigger] = useState<number>(0);

  // Character Forge form state
  const [forgeTitle, setForgeTitle] = useState('SK_UE5_CustomTextured');
  const [archetype, setArchetype] = useState('ue5_realistic_female');
  const [subsurfLevel, setSubsurfLevel] = useState(2);
  const [texResolution, setTexResolution] = useState(1024);
  const [cyclesSamples, setCyclesSamples] = useState(16);
  const [forgeLods, setForgeLods] = useState(true);
  const [shoulderScale, setShoulderScale] = useState(1.0);
  const [waistScale, setWaistScale] = useState(1.0);
  const [hipScale, setHipScale] = useState(1.0);
  const [swatches, setSwatches] = useState<Record<string, string>>({
    skin_hex: '#E3B8A3',
    hair_hex: '#1E1613',
    top_hex: '#16161B',
    denim_hex: '#5B82B0',
    belt_hex: '#1F1F25',
    metal_hex: '#DCE0E6',
    shoes_hex: '#F2F0EC',
  });
  const [refFile, setRefFile] = useState<File | null>(null);
  const [adaptRef, setAdaptRef] = useState<boolean>(true);

  // Up-Res & Texture Lab form state
  const [upresTitle, setUpresTitle] = useState('CH_HighPoly_TexturedUpres');
  const [upresSubsurf, setUpresSubsurf] = useState(2);
  const [microDetail, setMicroDetail] = useState('skin_pores');
  const [detailStrength, setDetailStrength] = useState(0.0016);
  const [rigBackend, setRigBackend] = useState('ue5_manny');
  const [upresFile, setUpresFile] = useState<File | null>(null);
  const [useSampleSheet, setUseSampleSheet] = useState(true);

  // Status
  const [busyMsg, setBusyMsg] = useState<string | null>(null);
  const [toastErr, setToastErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cat, list] = await Promise.all([fetchCatalog(), fetchModels()]);
        if (!mounted) return;
        setCatalog(cat);
        setModels(list);
        if (list.length > 0) {
          const full = await fetchModelDetail(list[0].model_id);
          if (mounted) {
            setSelected(full);
            setActiveLod('LOD0');
          }
        } else if (cat.bpy_available) {
          setBusyMsg(
            'Building High-Poly Textured 3D Showcase Collection (Subsurf L2 + 21 PBR Maps + UE5 Rig)…',
          );
          const seeded = await seedFlagshipModel(20);
          const refreshed = await fetchModels();
          if (mounted) {
            setModels(refreshed);
            setSelected(seeded);
            setBusyMsg(null);
          }
        }
      } catch (err) {
        if (mounted) {
          setToastErr(err instanceof Error ? err.message : 'Failed to connect to 3DModel Pro API');
          setBusyMsg(null);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectArchetype = (archId: string) => {
    setArchetype(archId);
    const spec = catalog?.archetypes.find((a) => a.id === archId);
    if (spec) {
      setSwatches({ ...spec.swatches });
      setForgeTitle(spec.name);
      setShoulderScale(spec.proportions.shoulder_scale);
      setWaistScale(spec.proportions.waist_scale);
      setHipScale(spec.proportions.hip_scale);
    }
  };

  const handleSelectModel = async (modelId: string) => {
    try {
      setToastErr(null);
      const detail = await fetchModelDetail(modelId);
      setSelected(detail);
      setActiveLod('LOD0');
    } catch (err) {
      setToastErr(err instanceof Error ? err.message : 'Could not load high-poly asset');
    }
  };

  const handleForgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastErr(null);
    setBusyMsg(
      `Forging High-Poly Textured '${forgeTitle}' (Subsurf L${subsurfLevel} · ${texResolution}px PBR Textures · 23-Bone UE5 Rig)…`,
    );
    try {
      const fd = new FormData();
      fd.append('title', forgeTitle);
      fd.append('archetype', archetype);
      fd.append('subsurf_level', String(subsurfLevel));
      fd.append('texture_resolution', String(texResolution));
      fd.append('cycles_samples', String(cyclesSamples));
      fd.append('generate_lods', String(forgeLods));
      fd.append('shoulder_scale', String(shoulderScale));
      fd.append('waist_scale', String(waistScale));
      fd.append('hip_scale', String(hipScale));
      Object.entries(swatches).forEach(([k, v]) => fd.append(k, v));
      if (refFile) {
        fd.append('reference_file', refFile);
        fd.append('adapt_to_reference', String(adaptRef));
      }

      const created = await forgeHighPolyCharacter(fd);
      const refreshed = await fetchModels();
      setModels(refreshed);
      setSelected(created);
      setActiveLod('LOD0');
      setRightTab('textures');
    } catch (err) {
      setToastErr(err instanceof Error ? err.message : 'Character Forge failed');
    } finally {
      setBusyMsg(null);
    }
  };

  const handleUpresSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastErr(null);
    setBusyMsg(
      `Subdividing & PBR Texturing '${upresTitle}' (Catmull-Clark L${upresSubsurf} + UV Albedo + ${microDetail} Normal Map)…`,
    );
    try {
      const fd = new FormData();
      fd.append('title', upresTitle);
      fd.append('subsurf_level', String(upresSubsurf));
      fd.append('micro_detail', microDetail);
      fd.append('detail_strength', String(detailStrength));
      fd.append('rigging_backend', rigBackend);
      fd.append('generate_lods', 'true');
      if (upresFile) {
        fd.append('file', upresFile);
        fd.append('use_sample_sheet', 'false');
      } else {
        fd.append('use_sample_sheet', String(useSampleSheet));
      }

      const created = await upresToHighPoly(fd);
      const refreshed = await fetchModels();
      setModels(refreshed);
      setSelected(created);
      setActiveLod('LOD0');
      setRightTab('textures');
    } catch (err) {
      setToastErr(err instanceof Error ? err.message : 'High-Poly Up-Res failed');
    } finally {
      setBusyMsg(null);
    }
  };

  const handleDeleteAsset = async (modelId: string) => {
    try {
      await deleteModel(modelId);
      const refreshed = await fetchModels();
      setModels(refreshed);
      if (selected?.model_id === modelId) {
        setSelected(refreshed[0] ? await fetchModelDetail(refreshed[0].model_id) : null);
      }
    } catch (err) {
      setToastErr(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const activeGlbUrl = useMemo(() => {
    if (!selected) return null;
    const lodItem = selected.lod_chain?.find((l) => l.lod === activeLod);
    return lodItem?.url || selected.primary_glb_url || null;
  }, [selected, activeLod]);

  const filteredTextures = useMemo(() => {
    const all = selected?.texture_maps || [];
    if (texFilter === 'all') return all;
    return all.filter((t) => t.channel === texFilter);
  }, [selected, texFilter]);

  const triggerCamera = (preset: CameraPreset) => {
    setCameraPreset(preset);
    setCameraTrigger((n) => n + 1);
  };

  return (
    <div className="pro-app">
      {/* Top Studio Header */}
      <header className="pro-topbar">
        <div className="pro-brand">
          <div className="pro-logo-mark">3D</div>
          <div>
            <div className="pro-brand-row">
              <span className="pro-title">3DModel Pro</span>
              <span className="pro-edition-badge">HIGH-POLY TEXTURED 3D STUDIO</span>
            </div>
            <div className="pro-subtitle">
              High-Poly Subdivided 3D Models with Embedded 1K/2K PBR Textures (Albedo · Normal · ORM) &amp; UE5 Rig
            </div>
          </div>
        </div>

        <div className="pro-topbar-right">
          <div className="pro-status-chip">
            <span className={`pro-dot ${catalog?.bpy_available ? 'ok' : 'warn'}`} />
            {catalog?.bpy_available ? 'Blender 4.5 PBR Baker Ready' : 'Mesh Subdivision Engine'}
          </div>
          <div className="pro-status-chip">{models.length} Textured High-Poly Models</div>
          <a
            href="/api/pro/v1/docs"
            target="_blank"
            rel="noreferrer"
            className="pro-ghost-btn"
          >
            Pro REST API
          </a>
        </div>
      </header>

      {toastErr && (
        <div className="pro-error-banner">
          <span>{toastErr}</span>
          <button onClick={() => setToastErr(null)}>Dismiss</button>
        </div>
      )}

      {/* 3-Column Studio Workspace */}
      <main className="pro-grid">
        {/* LEFT PANEL: Textured Models Vault | Character Forge | Up-Res & Texture */}
        <aside className="pro-panel pro-left">
          <div className="pro-tabs">
            <button
              className={leftTab === 'vault' ? 'active' : ''}
              onClick={() => setLeftTab('vault')}
            >
              Textured Models ({models.length})
            </button>
            <button
              className={leftTab === 'forge' ? 'active' : ''}
              onClick={() => setLeftTab('forge')}
            >
              Character Forge
            </button>
            <button
              className={leftTab === 'upres' ? 'active' : ''}
              onClick={() => setLeftTab('upres')}
            >
              Up-Res &amp; Texture
            </button>
          </div>

          <div className="pro-panel-scroll">
            {leftTab === 'vault' && (
              <div className="pro-vault-list">
                <div className="pro-section-intro">
                  Click any <strong>High-Poly Textured 3D Model</strong> below to stream its UV-mapped
                  PBR textures (BaseColor, Tangent Normal &amp; ORM) into the real-time 3D viewport.
                </div>
                {models.map((m) => (
                  <div
                    key={m.model_id}
                    className={`pro-vault-card ${selected?.model_id === m.model_id ? 'selected' : ''}`}
                    onClick={() => handleSelectModel(m.model_id)}
                  >
                    {m.lookdev_url && (
                      <img src={m.lookdev_url} alt={m.title} className="pro-vault-thumb" />
                    )}
                    <div className="pro-vault-meta">
                      <div className="pro-vault-title-row">
                        <span className="pro-vault-title">{m.title}</span>
                        {m.is_flagship && <span className="pro-mini-tag">SHOWCASE</span>}
                      </div>
                      <div className="pro-vault-sub">
                        {m.triangles.toLocaleString()} tris ·{' '}
                        <strong>{m.embedded_texture_count || m.texture_maps?.length || 3} PBR maps</strong> ·{' '}
                        {m.bone_count} bones
                      </div>
                      <div className="pro-vault-actions">
                        <span className="pro-arch-pill">{m.archetype_title}</span>
                        {!m.is_flagship && (
                          <button
                            type="button"
                            className="pro-del-btn"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              handleDeleteAsset(m.model_id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'forge' && (
              <form onSubmit={handleForgeSubmit} className="pro-form">
                <div className="pro-field">
                  <label>Asset Name / UE5 Skeletal Prefix</label>
                  <input
                    type="text"
                    value={forgeTitle}
                    onChange={(e) => setForgeTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="pro-field">
                  <label>High-Poly Textured Character Archetype</label>
                  <div className="pro-archetype-grid">
                    {(catalog?.archetypes || []).map((arch) => (
                      <button
                        type="button"
                        key={arch.id}
                        className={`pro-arch-card ${archetype === arch.id ? 'selected' : ''}`}
                        onClick={() => handleSelectArchetype(arch.id)}
                      >
                        <div className="pro-arch-top">
                          <span className="pro-arch-name">{arch.title}</span>
                          <span className="pro-arch-badge">{arch.badge}</span>
                        </div>
                        <p>{arch.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pro-field-row">
                  <div className="pro-field">
                    <label>Subdivision Density</label>
                    <select
                      value={subsurfLevel}
                      onChange={(e) => setSubsurfLevel(Number(e.target.value))}
                    >
                      <option value={1}>L1 · ~81K Tris</option>
                      <option value={2}>L2 · ~301K Tris (UE5)</option>
                      <option value={3}>L3 · ~1.12M Tris (Nanite)</option>
                    </select>
                  </div>
                  <div className="pro-field">
                    <label>PBR Texture Resolution</label>
                    <select
                      value={texResolution}
                      onChange={(e) => setTexResolution(Number(e.target.value))}
                    >
                      <option value={512}>512px · Fast Preview</option>
                      <option value={1024}>1024px · 1K Studio PBR</option>
                      <option value={2048}>2048px · 2K Ultra PBR</option>
                    </select>
                  </div>
                </div>

                <div className="pro-field">
                  <label>Cycles LookDev Sheet</label>
                  <select
                    value={cyclesSamples}
                    onChange={(e) => setCyclesSamples(Number(e.target.value))}
                  >
                    <option value={0}>Fast Mesh Turnaround</option>
                    <option value={16}>16 Samples (Cycles Raytraced)</option>
                    <option value={32}>32 Samples (Studio Master)</option>
                  </select>
                </div>

                <div className="pro-field">
                  <label>Baked PBR Texture Palette (Albedo + Normal + ORM)</label>
                  <div className="pro-swatch-grid">
                    {SWATCH_LABELS.map(({ key, label }) => (
                      <label key={key} className="pro-swatch-item">
                        <input
                          type="color"
                          value={swatches[key] || '#ffffff'}
                          onChange={(e) =>
                            setSwatches((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pro-field">
                  <label>Anatomical Proportion Morphs</label>
                  <div className="pro-slider-group">
                    <div>
                      <span>Shoulder Width ({shoulderScale.toFixed(2)}×)</span>
                      <input
                        type="range"
                        min={0.85}
                        max={1.18}
                        step={0.01}
                        value={shoulderScale}
                        onChange={(e) => setShoulderScale(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <span>Waist Taper ({waistScale.toFixed(2)}×)</span>
                      <input
                        type="range"
                        min={0.85}
                        max={1.18}
                        step={0.01}
                        value={waistScale}
                        onChange={(e) => setWaistScale(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <span>Hip / Pelvis Scale ({hipScale.toFixed(2)}×)</span>
                      <input
                        type="range"
                        min={0.88}
                        max={1.18}
                        step={0.01}
                        value={hipScale}
                        onChange={(e) => setHipScale(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="pro-field">
                  <label>Optional Front|Back Turnaround Reference</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setRefFile(e.target.files?.[0] || null)}
                  />
                  {refFile && (
                    <label className="pro-check">
                      <input
                        type="checkbox"
                        checked={adaptRef}
                        onChange={(e) => setAdaptRef(e.target.checked)}
                      />
                      Auto-adapt PBR garment colors &amp; proportions from image
                    </label>
                  )}
                </div>

                <label className="pro-check">
                  <input
                    type="checkbox"
                    checked={forgeLods}
                    onChange={(e) => setForgeLods(e.target.checked)}
                  />
                  Export Textured Multi-LOD Chain (LOD0, LOD1, LOD2, LOD3)
                </label>

                <button type="submit" className="pro-primary-btn" disabled={Boolean(busyMsg)}>
                  Forge High-Poly Textured 3D Character
                </button>
              </form>
            )}

            {leftTab === 'upres' && (
              <form onSubmit={handleUpresSubmit} className="pro-form">
                <div className="pro-section-intro">
                  Convert any low-poly mesh (<code>.glb</code>, <code>.obj</code>) or Dual-View
                  character sheet into a Catmull-Clark subdivided High-Poly 3D model with baked UV
                  Albedo, Tangent-Space Micro-Normal &amp; ORM textures.
                </div>

                <div className="pro-field">
                  <label>Output Asset Title</label>
                  <input
                    type="text"
                    value={upresTitle}
                    onChange={(e) => setUpresTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="pro-field">
                  <label>Upload 3D Mesh (.glb/.obj/.ply) or Turnaround Image</label>
                  <input
                    type="file"
                    accept=".glb,.gltf,.obj,.ply,.stl,image/*"
                    onChange={(e) => setUpresFile(e.target.files?.[0] || null)}
                  />
                  {!upresFile && (
                    <label className="pro-check">
                      <input
                        type="checkbox"
                        checked={useSampleSheet}
                        onChange={(e) => setUseSampleSheet(e.target.checked)}
                      />
                      Use built-in Dual-View Character Sheet (sample_input.jpg)
                    </label>
                  )}
                </div>

                <div className="pro-field-row">
                  <div className="pro-field">
                    <label>Catmull-Clark Level</label>
                    <select
                      value={upresSubsurf}
                      onChange={(e) => setUpresSubsurf(Number(e.target.value))}
                    >
                      <option value={1}>Level 1 (4× Polys)</option>
                      <option value={2}>Level 2 (16× Polys)</option>
                      <option value={3}>Level 3 (64× Nanite)</option>
                    </select>
                  </div>

                  <div className="pro-field">
                    <label>Auto-Rigging</label>
                    <select value={rigBackend} onChange={(e) => setRigBackend(e.target.value)}>
                      <option value="ue5_manny">UE5 Manny (23 Bones)</option>
                      <option value="heuristic">Humanoid (22 Bones)</option>
                      <option value="none">Static High-Poly Prop</option>
                    </select>
                  </div>
                </div>

                <div className="pro-field">
                  <label>Micro-Surface Normal Map &amp; Relief</label>
                  <select value={microDetail} onChange={(e) => setMicroDetail(e.target.value)}>
                    {(catalog?.micro_detail_profiles || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {microDetail !== 'none' && (
                  <div className="pro-field">
                    <label>Displacement Amplitude ({(detailStrength * 1000).toFixed(2)} mm)</label>
                    <input
                      type="range"
                      min={0.0004}
                      max={0.005}
                      step={0.0002}
                      value={detailStrength}
                      onChange={(e) => setDetailStrength(Number(e.target.value))}
                    />
                  </div>
                )}

                <button type="submit" className="pro-primary-btn" disabled={Boolean(busyMsg)}>
                  Build High-Poly Textured Asset + LOD0–LOD3
                </button>
              </form>
            )}
          </div>
        </aside>

        {/* CENTER PANEL: Real-Time High-Poly Textured WebGL2 Viewport + Quick Showcase Switcher */}
        <section className="pro-center">
          {/* Quick High-Poly Textured Showcase Strip */}
          {models.length > 0 && (
            <div className="pro-showcase-strip">
              <span className="pro-strip-label">HIGH-POLY TEXTURED MODELS:</span>
              <div className="pro-strip-chips">
                {models.map((m) => (
                  <button
                    key={m.model_id}
                    type="button"
                    className={`pro-strip-chip ${selected?.model_id === m.model_id ? 'active' : ''}`}
                    onClick={() => handleSelectModel(m.model_id)}
                  >
                    {m.lookdev_url && <img src={m.lookdev_url} alt="" />}
                    <div>
                      <div className="pro-strip-title">{m.title.split('·')[0].trim()}</div>
                      <div className="pro-strip-meta">
                        {Math.round(m.triangles / 1000)}K tris ·{' '}
                        {m.embedded_texture_count || m.texture_maps?.length || 3} maps
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pro-viewport-toolbar">
            <div className="pro-tool-group">
              <span className="pro-tool-label">3D Texture View</span>
              {(
                [
                  ['pbr', 'Textured PBR'],
                  ['albedo', 'Albedo Map'],
                  ['texwire', 'Textured + Wire'],
                  ['normals', 'Normals'],
                  ['clay', 'Untextured Clay'],
                ] as Array<[ShadingMode, string]>
              ).map(([m, lbl]) => (
                <button
                  key={m}
                  className={shading === m ? 'active' : ''}
                  onClick={() => setShading(m)}
                >
                  {lbl}
                </button>
              ))}
            </div>

            <div className="pro-tool-group">
              <span className="pro-tool-label">Rig &amp; Lighting</span>
              <button
                className={showSkeleton ? 'active' : ''}
                onClick={() => setShowSkeleton((s) => !s)}
              >
                UE5 Bones
              </button>
              <button
                className={autoTurn ? 'active' : ''}
                onClick={() => setAutoTurn((s) => !s)}
              >
                Turntable
              </button>
              <select
                value={lighting}
                onChange={(e) => setLighting(e.target.value as LightingPreset)}
                className="pro-mini-select"
              >
                <option value="studio">3-Point Neutral HDR</option>
                <option value="cyber">Cyber Rim Studio</option>
                <option value="warm">Golden Runway</option>
                <option value="dramatic">Dramatic Key</option>
              </select>
            </div>

            <div className="pro-tool-group">
              <span className="pro-tool-label">Camera</span>
              <button onClick={() => triggerCamera('three_quarter')}>3/4</button>
              <button onClick={() => triggerCamera('front')}>Front</button>
              <button onClick={() => triggerCamera('back')}>Back</button>
              <button onClick={() => triggerCamera('portrait')}>Close-Up</button>
            </div>
          </div>

          <div className="pro-viewport-stage">
            <Viewport3D
              glbUrl={activeGlbUrl}
              frontAxis={selected?.front_axis || '-Z'}
              shading={shading}
              lighting={lighting}
              showSkeleton={showSkeleton}
              autoTurn={autoTurn}
              activeLod={activeLod}
              cameraPreset={cameraPreset}
              cameraTrigger={cameraTrigger}
            />

            {busyMsg && (
              <div className="pro-busy-modal">
                <div className="vp-spinner" />
                <div className="pro-busy-title">3DModel Pro PBR Baker &amp; Subdivision Active</div>
                <div className="pro-busy-sub">{busyMsg}</div>
              </div>
            )}
          </div>

          {/* Export Dock */}
          {selected && (
            <div className="pro-export-bar">
              <div className="pro-export-info">
                <strong>{selected.title}</strong>
                <span>
                  {selected.triangles.toLocaleString()} tris ·{' '}
                  {selected.embedded_texture_count || selected.texture_maps?.length || 3} PBR
                  textures · {selected.height_m}m · {selected.skeleton_standard}
                </span>
              </div>
              <div className="pro-export-btns">
                {selected.fbx_url && (
                  <a href={selected.fbx_url} download className="pro-dl-btn pro-dl-ue5">
                    UE5 .FBX (Embedded PBR)
                  </a>
                )}
                {selected.primary_glb_url && (
                  <a href={selected.primary_glb_url} download className="pro-dl-btn">
                    Textured LOD0 .GLB
                  </a>
                )}
                {selected.pack_zip_url && (
                  <a href={selected.pack_zip_url} download className="pro-dl-btn">
                    Full Pack + Textures (.ZIP)
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT PANEL: PBR Texture Inspector, Multi-LOD Switcher, UE5 Bone Hierarchy & Cycles Renders */}
        <aside className="pro-panel pro-right">
          <div className="pro-tabs">
            <button
              className={rightTab === 'textures' ? 'active' : ''}
              onClick={() => setRightTab('textures')}
            >
              PBR Maps ({selected?.texture_maps?.length || 0})
            </button>
            <button
              className={rightTab === 'lods' ? 'active' : ''}
              onClick={() => setRightTab('lods')}
            >
              LODs
            </button>
            <button
              className={rightTab === 'rig' ? 'active' : ''}
              onClick={() => setRightTab('rig')}
            >
              UE5 Rig
            </button>
            <button
              className={rightTab === 'renders' ? 'active' : ''}
              onClick={() => setRightTab('renders')}
            >
              Renders
            </button>
          </div>

          <div className="pro-panel-scroll">
            {!selected && (
              <div className="pro-empty">Select or forge a High-Poly Textured 3D model.</div>
            )}

            {selected && rightTab === 'textures' && (
              <div className="pro-inspector-stack">
                <div className="pro-kpi-grid">
                  <div className="pro-kpi">
                    <span>Embedded PBR Maps</span>
                    <strong>
                      {selected.embedded_texture_count || selected.texture_maps?.length || 3} Maps
                    </strong>
                  </div>
                  <div className="pro-kpi">
                    <span>LOD0 Triangles</span>
                    <strong>{selected.triangles.toLocaleString()}</strong>
                  </div>
                  <div className="pro-kpi">
                    <span>Texture Resolution</span>
                    <strong>{selected.texture_resolution || 1024}×{selected.texture_resolution || 1024}</strong>
                  </div>
                  <div className="pro-kpi">
                    <span>UV Channels</span>
                    <strong>TEXCOORD_0 (100%)</strong>
                  </div>
                </div>

                <div className="pro-tex-filter-row">
                  {(['all', 'albedo', 'normal', 'orm'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      className={texFilter === ch ? 'active' : ''}
                      onClick={() => setTexFilter(ch)}
                    >
                      {ch === 'all'
                        ? 'All Maps'
                        : ch === 'albedo'
                          ? 'Albedo'
                          : ch === 'normal'
                            ? 'Normal'
                            : 'ORM'}
                    </button>
                  ))}
                </div>

                <div className="pro-tex-grid">
                  {filteredTextures.map((tex) => (
                    <div
                      key={tex.filename}
                      className="pro-tex-card"
                      onClick={() => setZoomedTex(tex)}
                    >
                      {tex.url && <img src={tex.url} alt={tex.label} loading="lazy" />}
                      <div className="pro-tex-card-meta">
                        <span className={`pro-ch-tag ch-${tex.channel}`}>
                          {tex.channel.toUpperCase()}
                        </span>
                        <div className="pro-tex-card-title">{tex.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {selected.materials?.length > 0 && (
                  <div className="pro-mat-section">
                    <h4>UE5 Material Slots ({selected.materials.length})</h4>
                    {selected.materials.map((m) => (
                      <div key={m.slot} className="pro-mat-row">
                        <span className="pro-mat-dot" style={{ background: m.hex }} />
                        <div>
                          <div className="pro-mat-name">{m.slot}</div>
                          <div className="pro-mat-type">{m.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selected && rightTab === 'lods' && (
              <div className="pro-inspector-stack">
                <div className="pro-section-intro">
                  Click any <strong>Textured LOD tier</strong> below to stream that geometry tier
                  into the live 3D viewport with full embedded PBR textures &amp; skinning:
                </div>

                <div className="pro-lod-section">
                  {(selected.lod_chain || []).map((lod) => (
                    <button
                      key={lod.lod}
                      type="button"
                      className={`pro-lod-card ${activeLod === lod.lod ? 'active' : ''}`}
                      onClick={() => setActiveLod(lod.lod)}
                    >
                      <div className="pro-lod-row">
                        <span className="pro-lod-id">{lod.lod}</span>
                        <span className="pro-lod-label">{lod.label}</span>
                        <span className="pro-lod-pct">{Math.round(lod.ratio * 100)}%</span>
                      </div>
                      <div className="pro-lod-sub">
                        {lod.triangles.toLocaleString()} tris · {lod.vertices.toLocaleString()}{' '}
                        verts · {lod.size_mb} MB
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selected && rightTab === 'rig' && (
              <div className="pro-rig-panel">
                <div className="pro-rig-summary">
                  <strong>{selected.armature_name}</strong>
                  <span>
                    {selected.bone_count} Deforming Joints · {selected.skeleton_standard}
                  </span>
                </div>
                <button
                  type="button"
                  className="pro-secondary-btn"
                  onClick={() => setShowSkeleton((s) => !s)}
                >
                  {showSkeleton ? 'Hide 3D Bone Overlay' : 'Show 3D Bone Overlay in Viewport'}
                </button>
                <div className="pro-bone-list">
                  {(selected.skeleton?.bones || []).map((b) => (
                    <div key={b.name} className="pro-bone-row">
                      <span className="pro-bone-idx">{String(b.index).padStart(2, '0')}</span>
                      <span className="pro-bone-name">{b.name}</span>
                      <span className="pro-bone-parent">← {b.parent || 'ROOT'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected && rightTab === 'renders' && (
              <div className="pro-renders-stack">
                {selected.lookdev_url && (
                  <div className="pro-render-card">
                    <h4>Cycles Raytraced Textured LookDev</h4>
                    <img src={selected.lookdev_url} alt="Cycles LookDev" />
                  </div>
                )}
                {selected.rig_preview_url && (
                  <div className="pro-render-card">
                    <h4>23-Bone UE5 Skeleton Alignment</h4>
                    <img src={selected.rig_preview_url} alt="Skeleton Alignment" />
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Texture Lightbox Modal */}
      {zoomedTex && (
        <div className="pro-lightbox" onClick={() => setZoomedTex(null)}>
          <div className="pro-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="pro-lightbox-head">
              <div>
                <strong>{zoomedTex.label}</strong>
                <span>{zoomedTex.channel_title} · {zoomedTex.filename}</span>
              </div>
              <div className="pro-lightbox-actions">
                {zoomedTex.url && (
                  <a href={zoomedTex.url} download className="pro-dl-btn">
                    Download PNG
                  </a>
                )}
                <button type="button" className="pro-ghost-btn" onClick={() => setZoomedTex(null)}>
                  Close
                </button>
              </div>
            </div>
            {zoomedTex.url && <img src={zoomedTex.url} alt={zoomedTex.label} />}
          </div>
        </div>
      )}
    </div>
  );
};
