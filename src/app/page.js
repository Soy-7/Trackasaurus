"use client";
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { signUp } from "@/lib/auth";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section id="hero" className="hero bg-gradient-to-b from-gray-900 to-black text-white">
          <div className="hero-content">
            <h1>Welcome to Trackasaurus</h1>
            <p>Your modern attendance and deadline tracker</p>
            <a href="#features" className="hero-cta">
              Get Started
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features bg-gray-800 text-white">
          <h2 className="text-4xl font-bold text-center mb-8">Features</h2>
          <div className="flex justify-center gap-8">
            <div className="featureCard">
              <h3>Smart Attendance</h3>
              <p>Easily track and manage your attendance in one place.</p>
            </div>
            <div className="featureCard">
              <h3>Deadline Reminders</h3>
              <p>Stay ahead with timely notifications and alerts.</p>
            </div>
            <div className="featureCard">
              <h3>Modern UI</h3>
              <p>Enjoy a clean and intuitive user experience.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about bg-gray-900 text-white">
          <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>
          <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">
            Trackasaurus is a task and project management tool designed to help you stay organized and productive. Our mission is to simplify your workflow and make task tracking effortless.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact bg-black text-white">
          <h2 className="text-4xl font-bold text-center mb-8">Contact Us</h2>
          <p className="text-lg text-gray-300 text-center mb-8">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <form className="max-w-lg mx-auto">
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
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-lg"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
