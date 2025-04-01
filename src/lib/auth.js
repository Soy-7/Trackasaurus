import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { setCookie, destroyCookie } from 'nookies';

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // After successful authentication, set a cookie
    const idToken = await user.getIdToken();
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
      
      // You don't need to create empty subcollections explicitly
      // They will be created when documents are added to them
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
