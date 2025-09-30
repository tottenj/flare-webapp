import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
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
    expect(result).toMatchObject({
      errors: {
        confirmPassword: ['Invalid input: expected string, received undefined'],
      },
    });
  });

  it('returns error if required fields are missing', async () => {
    const formData = makeFormData({
      orgEmail: 'test@flare.com',
      orgPassword: 'pass123',
      confirmOrgPassword: 'pass123',
    });
    const result = await orgSignUp(null, formData);
    expect(result).toMatchObject({
      message: 'Please fill out all required fields',
    });
  });

  it('creates user and returns success', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: 'abc' },
    });
    (getFirestoreFromServer as jest.Mock).mockResolvedValue({
      firestore: {},
    });
    const addOrgMock = jest.fn().mockResolvedValue(undefined);

    (FlareOrg as unknown as jest.Mock).mockImplementation(() => ({
      addOrg: addOrgMock,
    }));

    const formData = makeFormData({
      orgName: 'Flare',
      email: 'test@flare.com',
      location: JSON.stringify({
        id: 'abcd',
        coordinates: { latitude: 0, longitude: 0 },
        name: 'Name',
      }),
      password: 'pass123',
      confirmPassword: 'pass123',
    });

    const result = await orgSignUp(null, formData);
    expect(result.status).toEqual("success");
    expect(addOrgMock).toHaveBeenCalled();
    expect(sendEmailVerification).toHaveBeenCalled();
  });

});
