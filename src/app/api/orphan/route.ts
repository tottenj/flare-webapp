import { logger } from '@/lib/logger';
import ImageService from '@/lib/services/imageService/ImageService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  try {
    await ImageService.deleteOrphanedImages();
    return new Response('Orphaned images deleted successfully', { status: 200 });
  } catch (err) {
    logger.error('Failed to delete orphaned images', { err });
    return new Response('Failed to delete orphaned images', { status: 500 });
  }
}

export async function GET() {
  return new Response('Method Not Allowed', { status: 405 });
}
