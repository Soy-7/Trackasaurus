import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { setCookie, destroyCookie, parseCookies } from 'nookies';

// Set Firebase persistence to LOCAL (persists even when browser is closed)
setPersistence(auth, browserLocalPersistence).catch(error => {
  console.error("Error setting persistence:", error);
});

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Get a longer-lived token for persistent sessions
    const idToken = await user.getIdToken();
    
    // Set a long-lived cookie (30 days)
    setCookie(null, 'session', idToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict'
    });
    
    // Check if user exists in Firestore, if not create a new document
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Initialize user profile with empty collections
      await setDoc(userRef, {
        name: user.displayName || 'User',
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    } else {
      // Update last login time for returning users
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Google Sign-In Failed:", error);
    throw error;
  }
};

// Sign out function
export async function signOutUser() {
  try {
    await signOut(auth);
    // Remove the session cookie when signing out
    destroyCookie(null, 'session');
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
}

// Check if user is already authenticated
export const checkUserAuth = () => {
  const cookies = parseCookies();
  return !!cookies.session;
};

// Refresh token periodically to keep session alive
export const setupTokenRefresh = (user) => {
  // Refresh the token every 50 minutes (Firebase tokens expire after 1 hour)
  let refreshInterval;
  
  if (user) {
    refreshInterval = setInterval(async () => {
      try {
        const newToken = await user.getIdToken(true);
        setCookie(null, 'session', newToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict'
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }, 50 * 60 * 1000); // 50 minutes
  }
  
  return () => {
    if (refreshInterval) clearInterval(refreshInterval);
  };
};

// Track login state
export const trackAuthState = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Refresh the session token
      const idToken = await user.getIdToken(true);
      setCookie(null, 'session', idToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
      });
      
      // Setup token refresh
      setupTokenRefresh(user);
    } else {
      // Clear the session cookie if no user
      destroyCookie(null, 'session');
    }
    callback(user);
  });
};
