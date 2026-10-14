import { CloudinaryAsset, BenchmarkRow, TransformationConfig } from '@/types/pipeline';
import { buildCloudinaryUrl, buildOriginalUrl } from './transformations';

export async function runLiveBenchmarkSuite(asset: CloudinaryAsset): Promise<BenchmarkRow[]> {
  const configs: { id: string; name: string; config: TransformationConfig | null }[] = [
    {
      id: 'original',
      name: 'Original',
      config: null,
    },
    {
      id: 'auto_f_q',
      name: 'Auto (f_auto, q_auto)',
      config: {
        width: null,
        height: null,
        crop: 'fit',
        format: 'auto',
        quality: 80,
        autoFormat: true,
        autoQuality: true,
        autoDpr: false,
        smartCrop: false,
        stripMetadata: true,
      },
    },
    {
      id: 'resized',
      name: 'Resized (1200 × 800)',
      config: {
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
      },
    },
    {
      id: 'high_quality',
      name: 'High Quality (q_90)',
      config: {
        width: 1200,
        height: 800,
        crop: 'fit',
        format: 'webp',
        quality: 90,
        autoFormat: false,
        autoQuality: false,
        autoDpr: false,
        smartCrop: false,
        stripMetadata: false,
      },
    },
  ];

  const rows: BenchmarkRow[] = [];

  for (const item of configs) {
    const url = item.config
      ? buildCloudinaryUrl(asset.cloudName, asset.publicId, item.config)
      : buildOriginalUrl(asset.cloudName, asset.publicId);

    const start = performance.now();
    try {
      const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}bench_ts=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
      });
      const durationMs = Math.round(performance.now() - start);

      let bytes: number | null = null;
      const cl = res.headers.get('content-length');
      if (cl) {
        bytes = parseInt(cl, 10);
      } else {
        const blob = await res.blob();
        bytes = blob.size;
      }

      const formatHeader = res.headers.get('content-type')?.replace('image/', '').toUpperCase() || 'WEBP';
      
      const sizeStr = bytes
        ? bytes > 1024 * 1024
          ? (bytes / (1024 * 1024)).toFixed(1) + ' MB'
          : Math.round(bytes / 1024) + ' KB'
        : 'Unknown';

      const loadTimeStr = durationMs >= 1000 ? (durationMs / 1000).toFixed(2) + ' s' : durationMs + ' ms';

      rows.push({
        id: item.id,
        name: item.name,
        url,
        sizeFormatted: sizeStr,
        bytes,
        dimensions: item.config?.width && item.config?.height ? `${item.config.width} × ${item.config.height}` : `${asset.width} × ${asset.height}`,
        format: formatHeader,
        loadTime: loadTimeStr,
        durationMs,
      });
    } catch {
      rows.push({
        id: item.id,
        name: item.name,
        url,
        sizeFormatted: 'Failed',
        bytes: null,
        dimensions: `${asset.width} × ${asset.height}`,
        format: '—',
        loadTime: 'Error',
        durationMs: 0,
      });
    }
  }

  return rows;
}
