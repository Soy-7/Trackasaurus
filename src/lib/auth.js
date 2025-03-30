import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
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
export const signOutUser = async () => {
  try {
    await signOut(auth);
    // Clear the session cookie on logout
    destroyCookie(null, 'session', { path: '/' });
    console.log("User signed out");
  } catch (error) {
    console.error("Sign Out Failed:", error);
    throw error;
  }
};

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
