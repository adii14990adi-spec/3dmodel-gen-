export interface ShowcaseModelItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  glb_url: string;
  preview_url?: string;
  front_axis: '+Z' | '-Z';
  vertices: number;
  triangles: number;
  sub_meshes: number;
  bones: number;
  skeleton: string;
  embedded_textures: number;
  size_mb: number;
  height_m: number;
  tags: string[];
  swatches?: Record<string, string>;
  isLocalUpload?: boolean;
  fileFormat?: string;
}

export interface ShowcaseCatalog {
  viewer_name: string;
  repository: string;
  model_count: number;
  models: ShowcaseModelItem[];
}

export interface ExtractedTextureInfo {
  id: string;
  channel: 'albedo' | 'normal' | 'orm' | 'ao';
  materialName: string;
  width: number;
  height: number;
  dataUrl: string;
}

export interface LiveSceneMetrics {
  vertices: number;
  triangles: number;
  meshes: number;
  materials: number;
  bones: number;
  boneNames: string[];
  textures: ExtractedTextureInfo[];
  dimensions: [number, number, number]; // [width X, height Y, depth Z] in meters
  animations: string[];
}

export type ViewerShadingMode =
  | 'pbr'
  | 'albedo'
  | 'texwire'
  | 'wireframe'
  | 'normals'
  | 'clay'
  | 'chrome';

export type StudioEnvPreset = 'neutral' | 'cyber' | 'golden' | 'dramatic';
export type BackdropTheme = 'void' | 'slate' | 'light';
export type CameraBookmark = 'hero' | 'front' | 'back' | 'side' | 'portrait' | 'fit';
