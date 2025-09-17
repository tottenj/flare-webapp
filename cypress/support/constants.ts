export interface basicUser{
    email: string
    password: string
    name:string
}


export const unverifiedUser: basicUser = {
  email: 'userEmail@gmail.com',
  password: 'password',
  name: "unverified"
};
export const verifiedUser: basicUser = {
  email: 'userEmailVerified@gmail.com',
  password: 'password',
  name: "verified"
};


export const org: basicUser = {
  email: 'org@gmail.com',
  password: 'org@gmail.com',
  name: 'organization'
}