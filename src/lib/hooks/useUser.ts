import { User } from "firebase/auth";
import { useEffect } from "react";
import { setCookie, deleteCookie } from "cookies-next"; // Make sure cookies-next is installed
import firebaseConfig from "../../../firebaseconfig";
import { onIdTokenChanged } from "../firebase/auth/auth";




export default function useUserSession(initialUser: any) {
  useEffect(() => {
    // Handle token changes
    const unsubscribe = onIdTokenChanged(async (user: any) => {
      if (user) {
        // User is authenticated
        const idToken = await user.getIdToken();

        // Set the cookie with idToken and user info
        setCookie("__session", idToken, {
          secure: true,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60
        });
      } else {
        // No user, delete cookies
        deleteCookie("__session");
      }

      // If the initial user is different, reload the page to update state
      if (initialUser?.uid !== user?.uid) {
        window.location.reload();
      }
    });

    // Cleanup function to unsubscribe from the token change listener
    return () => unsubscribe();
  }, [initialUser]);

  return initialUser;
}
