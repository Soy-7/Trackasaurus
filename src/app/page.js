"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { checkUserAuth } from "@/lib/auth";
import Image from "next/image";

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
    
    // Add scroll animation
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        // If element is in viewport
        if(position.top < window.innerHeight - 100) {
          element.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
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
        <section
  id="hero"
  className="flex flex-col md:flex-row items-center justify-between min-h-[70vh] px-6 py-16 bg-gradient-to-br from-red-900 via-indigo-900 to-purple-900 relative overflow-hidden"
>
          {/* Decorative SVG or background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg viewBox="0 0 1440 320" className="w-full h-full" fill="none">
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="flex-1 text-center md:text-left">
              <h1 className="floating text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text animate-fade-in">
                Trackasaurus
              </h1>
              <p className="text-lg sm:text-2xl mb-8 text-gray-300 animate-fade-in delay-100">
                Your modern attendance and deadline tracker
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="#features" className="hero-cta px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg hover:from-orange-500 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg"> 
                  Get Started
                </a>
                <a href="#about" className="px-8 py-4 border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-all font-semibold text-lg">
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex-1 mt-10 md:mt-0 flex justify-center">
              <Image
                src="/images/dino3.svg"
                width={700}
                height={700}
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features bg-gradient bg-gradient-to-br from-indigo-900 via-purple-900 to-red-900 text-white w-full py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-3">Features</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Powerful Tools for You</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Discover all the ways Trackasaurus can help you stay organized and productive.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-orange-700/50 to-pink-800/50 p-8 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all shadow-xl hover:shadow-orange-500/10 group">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">Smart Attendance</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Easily track and manage your attendance in one place with visual insights.</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all shadow-xl hover:shadow-orange-500/10 group">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 7 9-7M4 11h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">Deadline Reminders</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Stay ahead with timely notifications and alerts for your deadlines.</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all shadow-xl hover:shadow-orange-500/10 group">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M3 9h18M3 15h18M3 21h18" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">Modern UI</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Enjoy a clean and intuitive user experience with Trackasaurus.</p>
              </div>
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
