export async function setSessionCookie(idToken: string) {
  await fetch('/api/loginToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}
