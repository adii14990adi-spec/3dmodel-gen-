import React, { useEffect, useMemo, useState } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { AssetEntry, AssetManifest, RuntimeGeometryStats } from './types/asset';

type InspectorTab = 'geometry' | 'materials' | 'project' | 'quality';

export const App: React.FC = () => {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState<AssetEntry | null>(null);
  const [previewFormat, setPreviewFormat] = useState<'GLB' | 'FBX'>('GLB');

  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [activeTab, setActiveTab] = useState<InspectorTab>('geometry');
  const [runtimeStats, setRuntimeStats] = useState<RuntimeGeometryStats | null>(null);

  useEffect(() => {
    fetch('./manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: AssetManifest) => {
        setManifest(data);
        if (data.assets.length > 0) {
          setSelectedAsset(data.assets[0]);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const categories = useMemo(() => {
    if (!manifest) return ['All'];
    const set = new Set(manifest.assets.map((a) => a.category));
    return ['All', ...Array.from(set)];
  }, [manifest]);

  const filteredAssets = useMemo(() => {
    if (!manifest) return [];
    return manifest.assets.filter((a) => {
      const matchCat = category === 'All' || a.category === category;
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [manifest, category, search]);

  const handleSelectAsset = (asset: AssetEntry) => {
    setSelectedAsset(asset);
    setPreviewFormat(asset.glbPath ? 'GLB' : 'FBX');
    setRuntimeStats(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <span className="brand-dot" />
          <span>Forge3D</span>
          <span className="badge">Unity 6</span>
        </div>
        <div className="stats-pill">
          {manifest ? `${manifest.totalAssets} Assets` : 'Loading...'}
        </div>
      </header>

      {error && <div className="error-banner">Failed to load manifest: {error}</div>}

      <main className="main-layout">
        {/* Asset Library Sidebar / Top Drawer on Mobile */}
        <aside className="library-panel">
          <div className="search-box">
            <input
              type="search"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="asset-list">
            {filteredAssets.map((asset) => (
              <button
                key={asset.id}
                className={`asset-card ${selectedAsset?.id === asset.id ? 'selected' : ''}`}
                onClick={() => handleSelectAsset(asset)}
              >
                <div className="asset-card-header">
                  <strong>{asset.name}</strong>
                  <span className={`status-tag ${asset.validation?.valid ? 'pass' : 'warn'}`}>
                    {asset.validation?.valid ? 'PASS' : 'CHECK'}
                  </span>
                </div>
                <div className="asset-card-meta">
                  <span>{asset.category}</span>
                  <span>{asset.formats.join(' · ')}</span>
                  {asset.validation && <span>{asset.validation.face_count} faces</span>}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* 3D Viewport + Inspector */}
        <section className="workspace-panel">
          {selectedAsset ? (
            <>
              <div className="viewer-toolbar">
                <div className="toolbar-group">
                  <button
                    className={`tool-btn ${previewFormat === 'GLB' ? 'active' : ''}`}
                    disabled={!selectedAsset.glbPath}
                    onClick={() => setPreviewFormat('GLB')}
                  >
                    GLB
                  </button>
                  <button
                    className={`tool-btn ${previewFormat === 'FBX' ? 'active' : ''}`}
                    disabled={!selectedAsset.fbxPath}
                    onClick={() => setPreviewFormat('FBX')}
                  >
                    FBX
                  </button>
                </div>

                <div className="toolbar-group">
                  <button
                    className={`tool-btn ${wireframe ? 'active' : ''}`}
                    onClick={() => setWireframe((v) => !v)}
                  >
                    Wire
                  </button>
                  <button
                    className={`tool-btn ${showGrid ? 'active' : ''}`}
                    onClick={() => setShowGrid((v) => !v)}
                  >
                    Grid
                  </button>
                  <button
                    className={`tool-btn ${showAxes ? 'active' : ''}`}
                    onClick={() => setShowAxes((v) => !v)}
                  >
                    Axes
                  </button>
                  <button
                    className="tool-btn"
                    onClick={() => setResetSignal((n) => n + 1)}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <ModelViewer
                modelUrl={previewFormat === 'GLB' ? selectedAsset.glbPath : selectedAsset.fbxPath}
                format={previewFormat}
                wireframe={wireframe}
                showGrid={showGrid}
                showAxes={showAxes}
                resetSignal={resetSignal}
                onStatsLoaded={setRuntimeStats}
              />

              {/* Download Bar */}
              <div className="download-bar">
                {selectedAsset.fbxPath && (
                  <a className="dl-btn primary" href={selectedAsset.fbxPath} download>
                    Download FBX ({formatBytes(selectedAsset.fbxSizeBytes)})
                  </a>
                )}
                {selectedAsset.glbPath && (
                  <a className="dl-btn" href={selectedAsset.glbPath} download>
                    Download GLB ({formatBytes(selectedAsset.glbSizeBytes)})
                  </a>
                )}
                {selectedAsset.projectPath && (
                  <a className="dl-btn" href={selectedAsset.projectPath} download>
                    .assetproj
                  </a>
                )}
              </div>

              {/* Inspector Tabs */}
              <div className="inspector-panel">
                <div className="inspector-tabs">
                  <button
                    className={activeTab === 'geometry' ? 'active' : ''}
                    onClick={() => setActiveTab('geometry')}
                  >
                    Geometry
                  </button>
                  <button
                    className={activeTab === 'materials' ? 'active' : ''}
                    onClick={() => setActiveTab('materials')}
                  >
                    Materials ({selectedAsset.materials.length})
                  </button>
                  <button
                    className={activeTab === 'project' ? 'active' : ''}
                    onClick={() => setActiveTab('project')}
                  >
                    .assetproj
                  </button>
                  <button
                    className={activeTab === 'quality' ? 'active' : ''}
                    onClick={() => setActiveTab('quality')}
                  >
                    QA Report
                  </button>
                </div>

                <div className="inspector-body">
                  {activeTab === 'geometry' && (
                    <div className="kv-grid">
                      <div><span>Meshes</span><strong>{runtimeStats?.meshes ?? '-'}</strong></div>
                      <div><span>Vertices (WebGL)</span><strong>{runtimeStats?.vertices ?? '-'}</strong></div>
                      <div><span>Triangles</span><strong>{runtimeStats?.triangles ?? '-'}</strong></div>
                      <div><span>Materials</span><strong>{runtimeStats?.materials ?? '-'}</strong></div>
                      <div>
                        <span>Bounds (m)</span>
                        <strong>
                          {runtimeStats
                            ? `${runtimeStats.boundingBox.x} × ${runtimeStats.boundingBox.y} × ${runtimeStats.boundingBox.z}`
                            : '-'}
                        </strong>
                      </div>
                      <div><span>Components</span><strong>{selectedAsset.components.length}</strong></div>
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="list-table">
                      {selectedAsset.materials.map((m) => (
                        <div key={m.id} className="list-row">
                          <strong>{m.name}</strong>
                          <span>Metallic: {m.metallic} | Roughness: {m.roughness}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'project' && (
                    <div className="kv-grid">
                      {Object.entries(selectedAsset.parameters).map(([k, v]) => (
                        <div key={k}>
                          <span>{k}</span>
                          <strong>{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'quality' && selectedAsset.validation && (
                    <div className="kv-grid">
                      <div><span>Geometry Valid</span><strong>{selectedAsset.validation.valid ? 'PASS' : 'FAIL'}</strong></div>
                      <div><span>Watertight</span><strong>{selectedAsset.validation.watertight ? 'YES' : 'OPEN'}</strong></div>
                      <div><span>Non-Manifold Edges</span><strong>{selectedAsset.validation.non_manifold_edges}</strong></div>
                      <div><span>Degenerate Faces</span><strong>{selectedAsset.validation.degenerate_faces}</strong></div>
                      <div><span>Target Engine</span><strong>{selectedAsset.targetEngine}</strong></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">Select an asset to inspect.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
