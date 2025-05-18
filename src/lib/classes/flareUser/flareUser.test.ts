import { Firestore, setDoc } from 'firebase/firestore';
import FlareUser, { userConverter } from './FlareUser';
import { expect } from '@jest/globals';
import Collections from '@/lib/enums/collections';
import { addDocument, getDocument } from '@/lib/firebase/firestore/firestoreOperations';


jest.mock('@/lib/firebase/firestore/firestoreOperations', () => ({
  getDocument: jest.fn(),
  addDocument: jest.fn()
}));




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
    expect(getDocument).toHaveBeenCalledWith(expect.anything(), `${Collections.Users}/${mockUser.id}`, userConverter);
    expect(getDocument).toHaveBeenCalled();
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
    expect(addDocument).toHaveBeenCalledWith(expect.anything(), `${Collections.Users}/${user.id}`, userConverter);
  });

  it('should return false when user has no id', async () => {
    user.id = '';
    const result = await user.addUser();
    expect(result).toBe(false);
    expect(addDocument).not.toHaveBeenCalled();
  });


  it('should use custom db instance when provided', async () => {
    const mockDb = {} as Firestore;
    await user.addUser(mockDb);
    expect(addDocument).toHaveBeenCalledWith(mockDb, `${Collections.Users}/${user.id}`, userConverter);
  });
});
