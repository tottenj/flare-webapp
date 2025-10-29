import FlareOrg from './FlareOrg';
import userService from '@/lib/prisma/services/userService';
import { expect } from '@jest/globals';

jest.mock('@/lib/prisma/services/userService', () => {
  return jest.fn().mockImplementation(() => ({
    createUser: jest.fn(),
  }));
});

describe('FlareOrg.create', () => {
  it('calls userService.createUser with correct data', async () => {
    const mockCreateUser = jest.fn();
    // Override the class mock to use our spy
    (userService as jest.Mock).mockImplementation(() => ({
      createUser: mockCreateUser,
    }));

    const userData = {
      email: 'test@example.com',
      password: '123',
      account_type: 'org' as "org" | "user",
    };

    const orgData = {
      location: {
        place_id: 'place123',
        coordinates: { lat: 1, lng: 2 },
        name: 'Testville',
      },
      socials: {
        instagram: undefined,
        twitter: undefined,
        facebook: undefined,
        other: undefined,
      },
    };

    await FlareOrg.create(userData, orgData);

    // Check that createUser was called with the correct arguments
    expect(mockCreateUser).toHaveBeenCalledWith(
      { email: 'test@example.com', password: '123', account_type: 'org' },
      orgData
    );
  });

  it('overwrites account_type to "org" even if different in userData', async () => {
    const mockCreateUser = jest.fn();
    (userService as jest.Mock).mockImplementation(() => ({
      createUser: mockCreateUser,
    }));

    const userData = {
      email: 'user2@example.com',
      password: 'abc',
      account_type: 'user' as "org" | "user", // should be overwritten
    };

    const orgData = {
      location: { place_id: 'x', coordinates: { lat: 0, lng: 0 } },
      socials: {},
    };

    await FlareOrg.create(userData, orgData);

    expect(mockCreateUser).toHaveBeenCalledWith(
      { email: 'user2@example.com', password: 'abc', account_type: 'org' },
      orgData
    );
  });
});
