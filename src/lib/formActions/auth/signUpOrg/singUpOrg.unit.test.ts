import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import signUpOrg from './signUpOrg';
import { expect } from '@jest/globals';

jest.mock('@/lib/classes/flareOrg/FlareOrg', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

function createMockFormData() {
  const formData = new FormData();
  formData.append('orgName', 'Test Org');
  formData.append('email', 'test@example.com');
  formData.append(
    'location',
    JSON.stringify({
      id: 'place123',
      name: 'Testville',
      coordinates: { lat: 10, lng: 20 },
    })
  );
  formData.append('password', 'one');
  formData.append('confirmPassword', 'one');
  formData.append('idToken', 'token');
  formData.append('account_type', 'org');
  return formData;
}

describe('signUpOrg', () => {
  it('calls flareOrg class with the correct values', async () => {
    const result = await signUpOrg(createMockFormData());

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/addOrgClaim'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: expect.stringContaining('Bearer'),
        }),
      })
    );
    expect(FlareOrg.create).toHaveBeenCalledWith(
      { email: 'test@example.com', account_type: 'org' },
      {
        location: {
          place_id: 'place123',
          coordinates: { lat: 10, lng: 20 },
          name: 'Testville',
        },
        socials: {
          twitter: undefined,
          facebook: undefined,
          instagram: undefined,
          other: undefined,
        },
      }
    );

    expect(result).toEqual({
      status: 'success',
      message: 'Created Organization',
    });
  });

  it('returns error if passwords do not match', async () => {
    const errorFormData = createMockFormData();
    errorFormData.set('confirmPassword', 'two');

    const result = await signUpOrg(errorFormData);

    expect(result).toEqual({
      status: 'error',
      message: 'Passwords must match',
    });

    expect(FlareOrg.create).not.toHaveBeenCalled();
  });

  it('throws if fetch returns not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Unauthorized'),
    });

    await expect(signUpOrg(createMockFormData())).rejects.toThrow('Unauthorized');
    expect(FlareOrg.create).not.toHaveBeenCalled();
  });

  it('returns error on thrown FlareOrg', async () => {
    (FlareOrg.create as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    const result = await signUpOrg(createMockFormData());
    expect(result).toEqual({
      status: 'error',
      message: 'Error Signing Up At This Time',
    });
  });

  it('Returns error if schema fails', async () => {
    const formData = createMockFormData();
    formData.delete('email');
    const result = await signUpOrg(formData);
    expect(result).toEqual({
      status: 'error',
      message: 'Invalid Data',
      errors: {
        email: ['Invalid input: expected string, received undefined'],
      },
    });
    expect(global.fetch).not.toHaveBeenCalled()
    expect(FlareOrg.create).not.toHaveBeenCalled();
  });


});
