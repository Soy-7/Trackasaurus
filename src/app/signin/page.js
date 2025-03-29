"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth";
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();
      alert(`Welcome back, ${user.displayName}!`);
      router.push('/dashboard');
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else {
        setError(err.message || "An error occurred during sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className={`w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing In with Google..." : "Sign In with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}