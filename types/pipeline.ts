export type CropMode = 'fit' | 'fill' | 'crop' | 'scale';
export type ImageFormat = 'auto' | 'webp' | 'avif' | 'jpg' | 'png';

export interface TransformationConfig {
  width: number | null;
  height: number | null;
  crop: CropMode;
  format: ImageFormat;
  quality: number; // 10-100
  autoFormat: boolean;
  autoQuality: boolean;
  autoDpr: boolean;
  smartCrop: boolean;
  stripMetadata: boolean;
}

export interface CloudinaryAsset {
  publicId: string;
  cloudName: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt?: string;
  isSample?: boolean;
}

export interface SavedPipeline {
  id: string;
  name: string;
  description?: string;
  config: TransformationConfig;
  savedAt: string;
}

export interface BenchmarkRow {
  id: string;
  name: string;
  url: string;
  sizeFormatted: string;
  bytes: number | null;
  dimensions: string;
  format: string;
  loadTime: string;
  durationMs: number;
}
