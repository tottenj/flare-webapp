
import { orgProfileDal } from '@/lib/dal/orgProfileDal/OrgProfileDal';
import { userDal } from '@/lib/dal/userDal/UserDal';
import { expect } from '@jest/globals';
import { AdminService } from '@/lib/services/adminService/AdminService';
import { mapAdminOrgRowToDto } from '@/lib/types/dto/admin/AdminOrgDetailsDto';
import { mapOrgCardRowToDto } from '@/lib/types/dto/org/OrgCardDto';

jest.mock('@/lib/dal/userDal/UserDal', () => ({
    userDal: {
        findByFirebaseUid: jest.fn(),
    },
}));

jest.mock('@/lib/dal/orgProfileDal/OrgProfileDal', () => ({
    orgProfileDal: {
        getAdminOrgCards: jest.fn(),
        getAdminOrgDetails: jest.fn(),
        verifyOrg: jest.fn(),
    },
}));

jest.mock('@/lib/types/dto/org/OrgCardDto', () => ({
    mapOrgCardRowToDto: jest.fn(),
}));

jest.mock('@/lib/types/dto/admin/AdminOrgDetailsDto', () => ({
    mapAdminOrgRowToDto: jest.fn(),
}));

const adminActor = {
    userId: '1',
    firebaseUid: 'admin-uid',
};

const nonAdminActor = {
    userId: '2',
    firebaseUid: 'non-admin-uid',
};

describe('AdminService.getUnverifiedOrgCards', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws unauthorized when actor is not an admin', async () => {
        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'ORG' });

        await expect(AdminService.getUnverifiedOrgCards(nonAdminActor)).rejects.toMatchObject({
            code: 'AUTH_UNAUTHORIZED',
        });

        expect(orgProfileDal.getAdminOrgCards).not.toHaveBeenCalled();
        expect(mapOrgCardRowToDto).not.toHaveBeenCalled();
    });

    it('returns mapped org cards for admins', async () => {
        const rowOne = { id: 'org-1' } as any;
        const rowTwo = { id: 'org-2' } as any;
        const mappedOne = { id: 'org-1', orgName: 'Org One' };
        const mappedTwo = { id: 'org-2', orgName: 'Org Two' };

        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'ADMIN' });
        (orgProfileDal.getAdminOrgCards as jest.Mock).mockResolvedValueOnce([rowOne, rowTwo]);
        (mapOrgCardRowToDto as jest.Mock).mockReturnValueOnce(mappedOne).mockReturnValueOnce(mappedTwo);

        const result = await AdminService.getUnverifiedOrgCards(adminActor);

        expect(orgProfileDal.getAdminOrgCards).toHaveBeenCalledTimes(1);
        expect((mapOrgCardRowToDto as jest.Mock).mock.calls[0][0]).toBe(rowOne);
        expect((mapOrgCardRowToDto as jest.Mock).mock.calls[1][0]).toBe(rowTwo);
        expect(result).toEqual([mappedOne, mappedTwo]);
    });
});

describe('AdminService.getUnverifiedOrgDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws unauthorized when actor is not an admin', async () => {
        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'USER' });

        await expect(AdminService.getUnverifiedOrgDetails(nonAdminActor, 'org-1')).rejects.toMatchObject({
            code: 'AUTH_UNAUTHORIZED',
        });

        expect(orgProfileDal.getAdminOrgDetails).not.toHaveBeenCalled();
        expect(mapAdminOrgRowToDto).not.toHaveBeenCalled();
    });

    it('returns null when org details are not found', async () => {
        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'ADMIN' });
        (orgProfileDal.getAdminOrgDetails as jest.Mock).mockResolvedValueOnce(null);

        const result = await AdminService.getUnverifiedOrgDetails(adminActor, 'missing-org');

        expect(orgProfileDal.getAdminOrgDetails).toHaveBeenCalledWith('missing-org');
        expect(mapAdminOrgRowToDto).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('returns mapped org details when found', async () => {
        const row = { id: 'org-1' } as any;
        const mapped = { id: 'org-1', orgName: 'Org One' };

        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'ADMIN' });
        (orgProfileDal.getAdminOrgDetails as jest.Mock).mockResolvedValueOnce(row);
        (mapAdminOrgRowToDto as jest.Mock).mockReturnValueOnce(mapped);

        const result = await AdminService.getUnverifiedOrgDetails(adminActor, 'org-1');

        expect(orgProfileDal.getAdminOrgDetails).toHaveBeenCalledWith('org-1');
        expect(mapAdminOrgRowToDto).toHaveBeenCalledWith(row);
        expect(result).toEqual(mapped);
    });
});

describe('AdminService.verifyOrg', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws unauthorized when actor is not an admin', async () => {
        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'ORG' });

        await expect(AdminService.verifyOrg(nonAdminActor, 'org-1')).rejects.toMatchObject({
            code: 'AUTH_UNAUTHORIZED',
        });

        expect(orgProfileDal.verifyOrg).not.toHaveBeenCalled();
    });

    it('resolves when organization is verified', async () => {
        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'ADMIN' });
        (orgProfileDal.verifyOrg as jest.Mock).mockResolvedValueOnce(true);

        await expect(AdminService.verifyOrg(adminActor, 'org-1')).resolves.toBeUndefined();
        expect(orgProfileDal.verifyOrg).toHaveBeenCalledWith('org-1');
    });

    it('throws conflict error when organization is not pending or missing', async () => {
        (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ role: 'ADMIN' });
        (orgProfileDal.verifyOrg as jest.Mock).mockResolvedValueOnce(false);

        await expect(AdminService.verifyOrg(adminActor, 'org-1')).rejects.toMatchObject({
            code: 'ORG_NOT_PENDING_OR_NOT_FOUND',
            status: 409,
            clientMessage: 'Organization is no longer pending verification.',
        });
    });
});