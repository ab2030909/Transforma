import { NextResponse } from 'next/server';
import { cloudinary, isCloudinaryConfigured, cloudName, apiKey } from '@/lib/cloudinary';


export async function POST() {
  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      {
        error: 'Cloudinary credentials are not configured on the server. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables (.env.local).',
        configured: false,
      },
      { status: 503 }
    );
  }

  try {
    const ALLOWED_FOLDER = 'transforma-pipeline';
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Whitelist allowed upload parameters
    const paramsToSign = {
      folder: ALLOWED_FOLDER,
      timestamp,
    };

    // Generate SHA signature securely using Cloudinary SDK and server secret
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      configured: true,
      signature,
      timestamp,
      folder: ALLOWED_FOLDER,
      cloudName,
      apiKey,
    });
  } catch (error: unknown) {
    console.error('Signature generation error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to generate upload signature';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isCloudinaryConfigured,
    cloudName: cloudName || null,
  });
}
