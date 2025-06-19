"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { checkUserAuth } from "@/lib/auth";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = checkUserAuth();
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full max-w-full">
      <Navbar />
      <main className="overflow-x-hidden w-full max-w-full">
        {/* Hero Section */}
        <section id="hero" className="hero bg-gradient-to-b from-gray-900 to-black text-white w-full py-12 px-4">
          <div className="hero-content max-w-full w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome to Trackasaurus</h1>
            <p className="text-lg sm:text-xl mb-6">Your modern attendance and deadline tracker</p>
            <a href="#features" className="hero-cta inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
              Get Started
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features bg-gray-800 text-white w-full py-12 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Features</h2>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 w-full max-w-6xl mx-auto">
            <div className="featureCard bg-gray-700/50 p-6 rounded-lg w-full">
              <h3 className="text-xl font-bold mb-2">Smart Attendance !!!</h3>
              <p>Easily track and manage your attendance in one place.</p>
            </div>
            <div className="featureCard bg-gray-700/50 p-6 rounded-lg w-full">
              <h3 className="text-xl font-bold mb-2">Deadline Reminders</h3>
              <p>Stay ahead with timely notifications and alerts.</p>
            </div>
            <div className="featureCard bg-gray-700/50 p-6 rounded-lg w-full">
              <h3 className="text-xl font-bold mb-2">Modern UI</h3>
              <p>Enjoy a clean and intuitive user experience.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about bg-gray-900 text-white w-full py-12 px-4">
          <div className="max-w-3xl mx-auto w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">About Us</h2>
            <p className="text-base md:text-lg text-gray-300 text-center">
              Trackasaurus is a task and project management tool designed to help you stay organized and productive. Our mission is to simplify your workflow and make task tracking effortless.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact bg-black text-white w-full py-12 px-4">
          <div className="max-w-lg mx-auto w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Contact Us</h2>
            <p className="text-base md:text-lg text-gray-300 text-center mb-8">
              Have questions or feedback? We&apos;d love to hear from you!
            </p>
            <form className="w-full mx-auto">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
