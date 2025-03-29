"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from "@/lib/auth";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();
      alert(`Welcome, ${user.displayName}!`);
      router.push('/dashboard');
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-up popup was closed. Please try again.");
      } else {
        setError(err.message || "An error occurred during sign-up.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    // Perform sign-up logic here
    // On success:
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Trackasaurus</h1>
          <p className="text-gray-600 mb-6">Sign up to start tracking your progress!</p>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSignUp} className="signup-form">
          {/* Sign-up form fields */}
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        <div className="mt-6">
          <button
            onClick={handleGoogleSignUp}
            className={`flex items-center justify-center w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up with Google..." : "Sign Up with Google"}
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}