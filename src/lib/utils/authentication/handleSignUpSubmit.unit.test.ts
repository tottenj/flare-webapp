import newSignUp from '@/lib/firebase/auth/emailPassword/newSignUp';
import handleSignUpSubmit from './handleSignUpSubmit';
import {expect} from "@jest/globals"

jest.mock('@/lib/firebase/auth/emailPassword/newSignUp', () => jest.fn());

function createFakeForm() {
  const form = document.createElement('form');
  const emailInput = document.createElement('input');
  emailInput.name = 'email';
  emailInput.value = 'test@example.com';
  form.appendChild(emailInput);
  return form;
}

describe('handleSignUpSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear();
  });

  it('calls newSignUp with FormData containing account_type', async () => {
    const form = createFakeForm();
    const event = { preventDefault: jest.fn(), currentTarget: form } as any;

    (newSignUp as jest.Mock).mockResolvedValueOnce({ status: 'success' });

    const result = await handleSignUpSubmit(event, 'org');

    expect(newSignUp).toHaveBeenCalledTimes(1);
    const formDataArg = (newSignUp as jest.Mock).mock.calls[0][0] as FormData;
    expect(formDataArg.get('email')).toBe('test@example.com');
    expect(formDataArg.get('account_type')).toBe('org');

    expect(result).toEqual({ status: 'success' });
  });

   it('removes sessionStorage item and rethrows on error', async () => {
     const form = createFakeForm();
     const event = { preventDefault: jest.fn(), currentTarget: form } as any;
     (newSignUp as jest.Mock).mockRejectedValueOnce(new Error('Boom!'));

     sessionStorage.setItem('manualLoginInProgress', 'true');

     await expect(handleSignUpSubmit(event, 'org')).rejects.toThrow('Boom!');
     expect(sessionStorage.getItem('manualLoginInProgress')).toBeNull();
   });

});
