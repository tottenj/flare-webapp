import { basicUser } from '../constants';

export const createUser: basicUser = {
  email: 'createUser@gmail.com',
  password: 'password',
  name: 'User One',
};

export const createUserResponse = {
    email: createUser.email,
    name: null,
    profilePic: null
}