import { createUserIntegration } from '../../factories/integration/user.factory';
import AuthGateway from '@/lib/auth/authGateway';
import { expect } from '@jest/globals';
import deleteUserUseCase from '@/lib/useCase/deleteUserUseCase';
import ImageService from '@/lib/services/imageService/ImageService';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { createEventIntegration } from '../../factories/integration/event.factory';

const mockedDeleteUser = AuthGateway.deleteUser as jest.Mock;
const mockedDeleteManyByStoragePaths = jest
  .spyOn(ImageService, 'deleteManyByStoragePaths')
  .mockResolvedValue(undefined);

describe('deleteAccount (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Successfully deletes account', async () => {
    const fakeUser = await createUserIntegration();
    mockedDeleteUser.mockResolvedValueOnce(undefined);
    await deleteUserUseCase({
      authenticatedUser: {
        userId: fakeUser.id,
        firebaseUid: fakeUser.firebaseUid,
      },
      firebaseUid: fakeUser.firebaseUid,
    });
    expect(mockedDeleteUser).toHaveBeenCalledWith(fakeUser.firebaseUid);
    const user = await prisma.user.findUnique({ where: { id: fakeUser.id } });
    expect(user).toBeNull();
  });

  it('Successfully deletes account and profile picture', async () => {
    const firebaseUid = crypto.randomUUID();
    const fakeUser = await createUserIntegration({
      firebaseUid,
      profilePic: {
        create: {
          imageAsset: {
            create: {
              storagePath: `users/${firebaseUid}/profile-pic/pic1.jpg`,
            },
          },
        },
      },
    });

    mockedDeleteUser.mockResolvedValueOnce(undefined);
    await deleteUserUseCase({
      authenticatedUser: {
        userId: fakeUser.id,
        firebaseUid: fakeUser.firebaseUid,
      },
      firebaseUid: fakeUser.firebaseUid,
    });
    expect(mockedDeleteUser).toHaveBeenCalledWith(fakeUser.firebaseUid);
    expect(mockedDeleteManyByStoragePaths).toHaveBeenCalledWith([
      `users/${firebaseUid}/profile-pic/pic1.jpg`,
    ]);
    const user = await prisma.user.findUnique({ where: { id: fakeUser.id } });
    expect(user).toBeNull();
    const imageAsset = await prisma.imageAsset.findFirst({
      where: { storagePath: `users/${fakeUser.firebaseUid}/profile-pic/pic1.jpg` },
    });
    expect(imageAsset).toBeNull();
  });

  it("Successfully deletes full org profile with proofs and events' images", async () => {
    const firebaseUid = crypto.randomUUID();
    const fakeOrg = await createOrgIntegration({
      user: {
        firebaseUid: firebaseUid,
        profilePic: {
          create: {
            imageAsset: {
              create: {
                storagePath: `users/${firebaseUid}/profile-pic/pic1.jpg`,
              },
            },
          },
        },
      },
      org: {
        proofs: {
          create: {
            platform: 'INSTAGRAM',
            imageAsset: {
              create: {
                storagePath: `orgs/${firebaseUid}/proofs/proof1.jpg`,
              },
            },
          },
        },
      },
    });
    const fakeEvent = await createEventIntegration({
      organizationId: fakeOrg.org.id,
      overrides: {
        image: {
          create: {
            storagePath: `events/${fakeOrg.org.id}/eventPic.jpg`,
          },
        },
      },
    });
    mockedDeleteUser.mockResolvedValueOnce(undefined);
    await deleteUserUseCase({
      authenticatedUser: {
        userId: fakeOrg.user.id,
        firebaseUid: fakeOrg.user.firebaseUid,
      },
      firebaseUid: fakeOrg.user.firebaseUid,
    });
    expect(mockedDeleteUser).toHaveBeenCalledWith(fakeOrg.user.firebaseUid);
    expect(mockedDeleteManyByStoragePaths).toHaveBeenCalledWith([
      `users/${firebaseUid}/profile-pic/pic1.jpg`,
      `orgs/${firebaseUid}/proofs/proof1.jpg`,
      `events/${fakeOrg.org.id}/eventPic.jpg`,
    ]);
    const user = await prisma.user.findUnique({ where: { id: fakeOrg.user.id } });
    expect(user).toBeNull();

    const org = await prisma.organizationProfile.findUnique({ where: { id: fakeOrg.org.id } });
    expect(org).toBeNull();

    const event = await prisma.flareEvent.findUnique({ where: { id: fakeEvent.id } });
    expect(event).toBeNull();
    const imageAssets = await prisma.imageAsset.findMany({
      where: {
        storagePath: {
          in: [
            `users/${fakeOrg.user.firebaseUid}/profile-pic/pic1.jpg`,
            `orgs/${fakeOrg.user.firebaseUid}/proofs/proof1.jpg`,
            `events/${fakeOrg.org.id}/eventPic.jpg`,
          ],
        },
      },
    });
    expect(imageAssets).toHaveLength(0);
  });

  it('Throws if UID does not match', async () => {
    const fakeUser = await createUserIntegration();

    await expect(
      deleteUserUseCase({
        authenticatedUser: {
          userId: fakeUser.id,
          firebaseUid: fakeUser.firebaseUid,
        },
        firebaseUid: 'different-uid',
      })
    ).rejects.toThrow();

    const user = await prisma.user.findUnique({ where: { id: fakeUser.id } });
    expect(user).not.toBeNull();
    expect(mockedDeleteUser).not.toHaveBeenCalled();
    expect(mockedDeleteManyByStoragePaths).not.toHaveBeenCalled();
  });
});
