import { UserDomain } from "./UserDomain";
import {expect} from "@jest/globals"


describe('UserDomain.onSignUp', () => {
  it('creates a pending user with correct defaults', () => {
    const user = UserDomain.onSignUp({
      firebaseUid: 'uid123',
      email: 'test@test.com',
      emailVerified: false,
    });

    expect(user.props).toEqual(
      expect.objectContaining({
        firebaseUid: 'uid123',
        email: 'test@test.com',
        emailVerified: false,
        status: 'PENDING',
        role: 'USER',
      })
    );

    expect(user.props.createdAt).toBeInstanceOf(Date);
  });
});
