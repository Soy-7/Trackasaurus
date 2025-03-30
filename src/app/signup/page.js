"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Tracko</h1>
          <p className="text-gray-600">Track your time, boost your productivity</p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-6"
        >
          <div className="w-5 h-5 relative flex-shrink-0">
            <img 
              src="/google-icon.svg" 
              alt="Google" 
              width={20} 
              height={20} 
              className="w-full h-full"
            />
          </div>
          <span className="text-gray-700 font-medium">
            {loading ? "Signing up..." : "Continue with Google"}
          </span>
        </button>
        
        <div className="text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link href="/signin" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign In
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-center text-gray-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}