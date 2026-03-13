import { POST } from '@/app/api/orphan/route';
import ImageService from '@/lib/services/imageService/ImageService';
import { expect } from '@jest/globals';
import { headers } from 'next/headers';
jest.mock('@/lib/services/imageService/ImageService');

describe('Orphan API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CRON_SECRET = 'test-secret';
  });

  it('should return 200 on success', async () => {
    (ImageService.deleteOrphanedImages as jest.Mock).mockResolvedValue(undefined);
    const req = {
      headers: {
        get: jest.fn().mockReturnValue('Bearer test-secret'),
      },
    };
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(ImageService.deleteOrphanedImages).toHaveBeenCalled();
  });

  it('should return 401 if unauthorized', async () => {
    const req = {
      headers: {
        get: jest.fn().mockReturnValue('Bearer wrong-secret'),
      },
    };
    const res = await POST(req as any);
    expect(res.status).toBe(401);
    expect(ImageService.deleteOrphanedImages).not.toHaveBeenCalled();
  });

  it('should return 500 on failure', async () => {
    (ImageService.deleteOrphanedImages as jest.Mock).mockRejectedValue(new Error('Test error'));
    const req = {
      headers: {
        get: jest.fn().mockReturnValue('Bearer test-secret'),
      },
    };
    const res = await POST(req as any);
    expect(res.status).toBe(500);
    expect(ImageService.deleteOrphanedImages).toHaveBeenCalled();
  });
});
