import { auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { setCookie, destroyCookie } from 'nookies'; // Add this import

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    
    // After successful authentication, set a cookie
    const idToken = await result.user.getIdToken();
    setCookie(null, 'session', idToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict'
    });
    
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Failed:", error);
    throw error;
  }
};

// Sign out function
export async function signOutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
}

// Track login state
export const trackAuthState = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Refresh the session token periodically
      const idToken = await user.getIdToken(true);
      setCookie(null, 'session', idToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
      });
    }
    callback(user);
  });
};
