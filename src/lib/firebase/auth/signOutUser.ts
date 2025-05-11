import { auth } from "./configs/clientApp";


export async function signOutUser() {
  "use server"
  try {
    auth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
}
