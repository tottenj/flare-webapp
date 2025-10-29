"use client"
import { auth } from "./configs/clientApp";

export async function signOutUser() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
}
