import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import getFirestoreFromServer, { getServicesFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import orgSignUp from '@/lib/formActions/orgSignUp/orgSignUp';
import logErrors from '@/lib/utils/error/logErrors';
import { formErrors } from '@/lib/utils/text/text';
import { expect } from '@jest/globals';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';



jest.mock('@/lib/classes/flareOrg/FlareOrg');


describe('orgSignUp', () => {
  const makeFormData = (data: Record<string, string | File>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if passwords do not match', async () => {
    const formdata = makeFormData({
      orgName: 'Flare',
      orgEmail: 'test@flare.com',
      location: JSON.stringify({ lat: 0, lng: 0 }),
      orgPassword: 'pass123',
      confirmOrgPassword: 'pass456',
    });

    const result = await orgSignUp(null, formdata);
    expect(result).toEqual({ message: formErrors.passwordMisMatch });
  });

  it('returns error if required fields are missing', async () => {
    const formData = makeFormData({
      orgEmail: 'test@flare.com',
      orgPassword: 'pass123',
      confirmOrgPassword: 'pass123',
    });
    const result = await orgSignUp(null, formData);
    expect(result).toEqual({ message: formErrors.requiredError });
  });

  it('creates user and returns success', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: 'abc' },
    });
    (getFirestoreFromServer as jest.Mock).mockResolvedValue({
      firestore: {},
    });
    const addOrgMock = jest
      .fn()
      .mockResolvedValue(undefined);

      (FlareOrg as unknown as jest.Mock).mockImplementation(() => ({
        addOrg: addOrgMock
      }))
      

    const formData = makeFormData({
      orgName: 'Flare',
      orgEmail: 'test@flare.com',
      location: JSON.stringify({ lat: 0, lng: 0 }),
      orgPassword: 'pass123',
      confirmOrgPassword: 'pass123',
    });

    const result = await orgSignUp(null, formData);
    expect(result).toEqual({ message: 'success'});
    expect(addOrgMock).toHaveBeenCalled();
    expect(sendEmailVerification).toHaveBeenCalled()
  });


  it('logs error and returns fallback message on failure', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('fail'))
    const formData = makeFormData({
      orgName: 'Flare',
      orgEmail: 'test@flare.com',
      location: JSON.stringify({ lat: 0, lng: 0 }),
      orgPassword: 'pass123',
      confirmOrgPassword: 'pass123',
    });

    const result = await orgSignUp(null, formData);
    expect(result).toEqual({ message: 'An unexpected error occurred. Please try again.' });
  })
});
