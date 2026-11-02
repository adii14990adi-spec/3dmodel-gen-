export interface ArchetypeSpec {
  id: string;
  name: string;
  title: string;
  badge: string;
  description: string;
  swatches: Record<string, string>;
  hair_melanin: number;
  proportions: {
    shoulder_scale: number;
    waist_scale: number;
    hip_scale: number;
  };
}

export interface MicroDetailProfile {
  id: string;
  label: string;
  description: string;
}

export interface SubsurfTier {
  level: number;
  label: string;
  approx_tris: string;
  target: string;
}

export interface ProCatalog {
  product_name: string;
  tagline: string;
  bpy_available: boolean;
  archetypes: ArchetypeSpec[];
  micro_detail_profiles: MicroDetailProfile[];
  subsurf_tiers: SubsurfTier[];
}

export interface LodEntry {
  lod: string;
  label: string;
  vertices: number;
  triangles: number;
  ratio: number;
  filename: string;
  size_mb: number;
  url?: string;
}

export interface MaterialSlot {
  slot: string;
  type: string;
  hex: string;
}

export interface TextureMapCard {
  slot: string;
  label: string;
  channel: 'albedo' | 'normal' | 'orm' | string;
  channel_title: string;
  filename: string;
  url?: string;
}

export interface SkeletonBone {
  index: number;
  name: string;
  parent: string | null;
  region: string;
  position: [number, number, number];
}

export interface SkeletonData {
  backend?: string;
  num_joints?: number;
  bones?: SkeletonBone[];
}

export interface HighPolyAsset {
  model_id: string;
  title: string;
  workflow: 'ue5_character_forge' | 'highpoly_upres_lab' | string;
  archetype: string;
  archetype_title: string;
  is_flagship?: boolean;
  showcase_order?: number;
  front_axis?: '+Z' | '-Z';
  created_at: string;
  created_ts: number;
  elapsed_seconds: number;
  subsurf_level: number;
  texture_resolution?: number;
  embedded_texture_count?: number;
  cycles_samples?: number;
  micro_detail?: string;
  mesh_components: number;
  vertices: number;
  triangles: number;
  surface_area_m2: number;
  dimensions_m: [number, number, number];
  height_m: number;
  skeleton_standard: string;
  armature_name: string;
  bone_count: number;
  ue5_ready: boolean;
  swatches: Record<string, string>;
  proportions?: Record<string, number>;
  materials: MaterialSlot[];
  texture_maps?: TextureMapCard[];
  lod_chain: LodEntry[];
  files: Record<string, string>;
  primary_glb_url?: string;
  fbx_url?: string;
  pack_zip_url?: string;
  lookdev_url?: string;
  rig_preview_url?: string;
  skeleton?: SkeletonData;
}

export type ShadingMode = 'pbr' | 'albedo' | 'texwire' | 'clay' | 'normals';
export type LightingPreset = 'studio' | 'cyber' | 'warm' | 'dramatic';
export type CameraPreset = 'three_quarter' | 'front' | 'back' | 'portrait' | 'reset';
