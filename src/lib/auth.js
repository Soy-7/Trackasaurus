import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Failed:", error);
    throw error; // Ensure errors are thrown for handling in the UI
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Sign Out Failed:", error);
    throw error;
  }
};

// Track login state
export const trackAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
