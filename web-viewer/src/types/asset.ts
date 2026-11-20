export interface AssetComponent {
  id: number;
  name: string;
  material_id: number;
}

export interface AssetMaterial {
  id: number;
  name: string;
  metallic: number;
  roughness: number;
}

export interface AssetValidation {
  vertex_count: number;
  face_count: number;
  valid: boolean;
  watertight: boolean;
  non_manifold_edges: number;
  degenerate_faces: number;
}

export interface AssetEntry {
  id: string;
  name: string;
  category: string;
  version: string;
  targetEngine: string;
  formats: string[];
  previewPath: string;
  fbxPath: string;
  glbPath: string;
  projectPath: string;
  glbSizeBytes: number;
  fbxSizeBytes: number;
  parameters: Record<string, string>;
  components: AssetComponent[];
  materials: AssetMaterial[];
  validation: AssetValidation | null;
}

export interface AssetManifest {
  generatedAt: string;
  totalAssets: number;
  assets: AssetEntry[];
}

export interface RuntimeGeometryStats {
  meshes: number;
  vertices: number;
  triangles: number;
  materials: number;
  animations: number;
  boundingBox: { x: number; y: number; z: number };
}
