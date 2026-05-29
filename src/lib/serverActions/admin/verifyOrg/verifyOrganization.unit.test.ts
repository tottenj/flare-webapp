import { AdminService } from '@/lib/services/adminService/AdminService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import verifyOrganization from './veirfyOrginization';
import { authUserFactory } from '../../../../../__tests__/factories/auth/authUser.factory';
import { expect } from '@jest/globals';
import { expectFail } from '@/lib/test/expectFail';
import { AppError } from '@/lib/errors/AppError';

jest.mock('@/lib/services/adminService/AdminService', () => ({
  AdminService: {
    verifyOrg: jest.fn(),
  },
}));

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  UserContextService: {
    requireAdmin: jest.fn(),
    getUserActor: jest.fn(),
  },
}));

describe('verifyOrganization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retruns ok true when verification succeeds', async () => {
    const adminActor = authUserFactory();
    const orgId = 'org-1';
    const adminContext = { user: { firebaseUid: adminActor.firebaseUid } };

    (UserContextService.requireAdmin as jest.Mock).mockResolvedValueOnce(adminContext);
    (UserContextService.getUserActor as jest.Mock).mockReturnValueOnce(adminActor);
    (AdminService.verifyOrg as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await verifyOrganization(orgId);

    expect(AdminService.verifyOrg).toHaveBeenCalledWith(adminActor, orgId);
    expect(result).toMatchObject({ ok: true, data: null });
  });

  it('returns a fail when wrong data passed in', async () => {
    const result = await verifyOrganization(123 as any);

    const error = expectFail(result);
    expect(result.ok).toBe(false);
    expect(error).toBeDefined();
    expect(error?.code).toBe('INVALID_INPUT');
    expect(AdminService.verifyOrg).not.toHaveBeenCalled();
  });

  it('returns a fail when admin service throws an App Error', async () => {
    const adminActor = authUserFactory();
    const orgId = 'org-1';
    const adminContext = { user: { firebaseUid: adminActor.firebaseUid } };

    (UserContextService.requireAdmin as jest.Mock).mockResolvedValueOnce(adminContext);
    (UserContextService.getUserActor as jest.Mock).mockReturnValueOnce(adminActor);
    (AdminService.verifyOrg as jest.Mock).mockRejectedValueOnce(
      new AppError({ code: 'APP_ERROR', clientMessage: 'Something went wrong', status: 500 })
    );
    const result = await verifyOrganization(orgId);

    const error = expectFail(result);
    expect(result.ok).toBe(false);
    expect(error).toBeDefined();
    expect(error?.code).toBe('APP_ERROR');
    expect(AdminService.verifyOrg).toHaveBeenCalledWith(adminActor, orgId);
  });

  it('returns a fail with unknown error when admin service throws an unknown error', async () => {
    const adminActor = authUserFactory();
    const orgId = 'org-1';
    const adminContext = { user: { firebaseUid: adminActor.firebaseUid } };

    (UserContextService.requireAdmin as jest.Mock).mockResolvedValueOnce(adminContext);
    (UserContextService.getUserActor as jest.Mock).mockReturnValueOnce(adminActor);
    (AdminService.verifyOrg as jest.Mock).mockRejectedValueOnce(new Error('Unknown error'));
    const result = await verifyOrganization(orgId);

    const error = expectFail(result);
    expect(result.ok).toBe(false);
    expect(error).toBeDefined();
    expect(error?.code).toBe('UNKNOWN');
    expect(AdminService.verifyOrg).toHaveBeenCalledWith(adminActor, orgId);
  });
});
