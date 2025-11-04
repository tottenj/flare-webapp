const AUTH_EMULATOR = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1';
const API_KEY = process.env.FIREBASE_API_KEY || 'fake-api-key';





export async function createTestUser(
  email: string,
  password: string,
  name: string,
  emailVerified: boolean = true,
  isOrg: boolean = false
) {
  // 1️⃣ Sign up user in the Auth Emulator
  const signUpRes = await fetch(`${AUTH_EMULATOR}/accounts:signUp?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  }).then((r) => r.json());

  if (!signUpRes.idToken) {
    throw new Error(`Failed to create test user: ${JSON.stringify(signUpRes)}`);
  }

  // 2️⃣ Optionally mark email as verified
  if (emailVerified) {
    await fetch(`${AUTH_EMULATOR}/accounts:update?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: signUpRes.idToken, emailVerified: true }),
    });
  }

  // 3️⃣ Optionally assign custom claims (org, verified, etc.)
  // You can use your Admin SDK or a test endpoint for this part if needed

  return {
    ...signUpRes,
    email,
    password,
    name,
    isOrg,
  };
}


export async function loginTestUser(email: string, password: string) {
  const signInRes = await fetch(`${AUTH_EMULATOR}/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  }).then((r) => r.json());

  if (!signInRes.idToken) {
    throw new Error(`Failed to log in test user: ${JSON.stringify(signInRes)}`);
  }

  // Optionally call your API test route to set the session cookie
  await fetch('http://localhost:3000/api/test/testLogin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: signInRes.idToken }),
  });

  return signInRes;
}


export async function logoutTestUser() {
  await fetch('http://localhost:3000/api/test/testLogout', {
    method: 'POST',
  });
}



export async function loginVerifiedOrg(){
    await loginTestUser("verified@test.com", "password123")
}


export async function loginUnverifiedOrg(){
    await loginTestUser("org1@test.com", "password123")
}

export async function loginUser(){
    await loginTestUser("user1@test.com", 'password123')
}