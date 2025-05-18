import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';
import FlareUser from './FlareUser';
import { expect } from '@jest/globals';
import Collections from '@/lib/enums/collections';
import { addDocument, getDocument } from '@/lib/firebase/firestore/firestoreOperations';

describe('getUserById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: '123',
    email: 'example@gmail.com',
  };

  it('should return user data when document exists', async () => {
    (getDocument as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockUser,
    });

    const result = await FlareUser.getUserById('123');
    expect(result).toEqual(mockUser);
    expect(doc).toHaveBeenCalledWith(expect.anything(), Collections.Users, '123');
    expect(getDoc).toHaveBeenCalled();
  });

  // ... other getUserById tests remain the same ...
});

describe('addUser', () => {
  let user: FlareUser;

  beforeEach(() => {
    user = FlareUser.emptyUser;
    user.id = '123';
    user.email = 'example@gmail.com';
    jest.clearAllMocks();
  });

  it('should return true and call setDoc when successful', async () => {
    (addDocument as jest.Mock).mockResolvedValueOnce(true);

    const result = await user.addUser();

    expect(result).toBe(true);
    expect(doc).toHaveBeenCalledWith(expect.anything(), Collections.Users, user.id);

    // Get the actual mock doc reference that was created
    const mockDocRef = (doc as jest.Mock).mock.results[0].value;
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, user);
  });

  it('should return false when user has no id', async () => {
    user.id = '';
    const result = await user.addUser();
    expect(result).toBe(false);
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('should return false when setDoc fails', async () => {
    const mockError = new Error('Firestore error');
    (setDoc as jest.Mock).mockRejectedValueOnce(mockError);
    const result = await user.addUser();
    expect(result).toBe(false);
  });

  it('should use custom db instance when provided', async () => {
    const mockDb = {} as Firestore;
    await user.addUser(mockDb);

    // Verify doc was called with the custom db instance
    expect(doc).toHaveBeenCalledWith(mockDb, Collections.Users, user.id);
  });
});
