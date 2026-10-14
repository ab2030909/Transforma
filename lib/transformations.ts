import { TransformationConfig } from '@/types/pipeline';

export const DEFAULT_CONFIG: TransformationConfig = {
  width: 1200,
  height: 800,
  crop: 'fit',
  format: 'webp',
  quality: 80,
  autoFormat: true,
  autoQuality: false,
  autoDpr: false,
  smartCrop: false,
  stripMetadata: true,
};

export const PRESETS_LIST = [
  {
    id: 'web-optimized',
    name: 'Web Optimized',
    desc: 'Auto format, balanced compression & limit width',
    config: {
      width: 1200,
      height: 800,
      crop: 'fit' as const,
      format: 'webp' as const,
      quality: 80,
      autoFormat: true,
      autoQuality: false,
      autoDpr: false,
      smartCrop: false,
      stripMetadata: true,
    },
  },
  {
    id: 'mobile',
    name: 'Mobile Image',
    desc: 'Compact 640px viewport for mobile networks',
    config: {
      width: 640,
      height: 480,
      crop: 'fit' as const,
      format: 'webp' as const,
      quality: 75,
      autoFormat: true,
      autoQuality: true,
      autoDpr: true,
      smartCrop: false,
      stripMetadata: true,
    },
  },
  {
    id: 'desktop-hero',
    name: 'Desktop Hero',
    desc: 'Crisp 1920px banner for large monitors',
    config: {
      width: 1920,
      height: 900,
      crop: 'fill' as const,
      format: 'webp' as const,
      quality: 85,
      autoFormat: true,
      autoQuality: false,
      autoDpr: false,
      smartCrop: true,
      stripMetadata: true,
    },
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail',
    desc: '320x320 square thumbnail',
    config: {
      width: 320,
      height: 320,
      crop: 'fill' as const,
      format: 'webp' as const,
      quality: 80,
      autoFormat: false,
      autoQuality: false,
      autoDpr: false,
      smartCrop: true,
      stripMetadata: true,
    },
  },
  {
    id: 'high-quality',
    name: 'High Quality',
    desc: 'Preserve 95% fidelity for photography portfolios',
    config: {
      width: 1600,
      height: 1000,
      crop: 'fit' as const,
      format: 'avif' as const,
      quality: 90,
      autoFormat: false,
      autoQuality: false,
      autoDpr: false,
      smartCrop: false,
      stripMetadata: false,
    },
  },
];

export function buildTransformationString(config: TransformationConfig): string {
  const parts: string[] = [];

  // Format
  if (config.autoFormat) {
    parts.push('f_auto');
  } else if (config.format) {
    parts.push(`f_${config.format}`);
  }

  // Quality
  if (config.autoQuality) {
    parts.push('q_auto');
  } else if (config.quality) {
    parts.push(`q_${config.quality}`);
  }

  // Dimensions & Crop
  if (config.width && config.width > 0) {
    parts.push(`w_${config.width}`);
  }
  if (config.height && config.height > 0) {
    parts.push(`h_${config.height}`);
  }
  if (config.crop) {
    parts.push(`c_${config.crop}`);
  }

  // Smart Crop / Gravity
  if (config.smartCrop) {
    parts.push('g_auto');
  }

  // DPR
  if (config.autoDpr) {
    parts.push('dpr_auto');
  }

  // Strip metadata
  if (config.stripMetadata) {
    parts.push('fl_strip_profile');
  }

  return parts.join(',');
}

export function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  config: TransformationConfig
): string {
  const cleanId = publicId.replace(/^\/+/, '');
  const trans = buildTransformationString(config);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${trans}/${cleanId}`;
}

export function buildOriginalUrl(cloudName: string, publicId: string): string {
  const cleanId = publicId.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanId}`;
}
