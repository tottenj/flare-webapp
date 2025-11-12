import { handleSignUp } from './signUpHandlers';
import signUpOrg from './signUpOrg/signUpOrg';
import signUpUser from './signUpUser/signUpUser';
import { expect } from '@jest/globals';

jest.mock('@/lib/formActions/auth/signUpOrg/signUpOrg', () => jest.fn());
jest.mock('@/lib/formActions/auth/signUpUser/signUpUser', () => jest.fn());

describe('signUpHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const fakeFormData = new FormData();

  it('calls signUpOrg when accountType is "org"', async () => {
    (signUpOrg as jest.Mock).mockResolvedValue({
      status: 'success',
      message: 'Org created',
    });

    const result = await handleSignUp('org', fakeFormData);

    expect(signUpOrg).toHaveBeenCalledWith(fakeFormData);
    expect(signUpUser).not.toHaveBeenCalled();
    expect(result).toEqual({ status: 'success', message: 'Org created' });
  });


  it('calls signUpUser when account type is "user"', async () => {
    (signUpUser as jest.Mock).mockResolvedValue({
        status: "success",
        message: "user created"
    })

    const result = await handleSignUp('user', fakeFormData)

    expect(signUpUser).toHaveBeenCalledWith(fakeFormData)
    expect(signUpOrg).not.toHaveBeenCalled()
    expect(result).toEqual({ status: 'success', message: 'user created' });
  })
});
