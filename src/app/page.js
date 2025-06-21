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

  const handleSmoothScroll = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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
              <p className="text-lg sm:text-2xl mb-8 text-white animate-fade-in delay-100">
                Track attendance. Manage deadlines. Chill !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
  href="#features"
  onClick={handleSmoothScroll("features")}
  className="hero-cta px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold text-lg shadow-lg"
>
  Get Started
</a>
<a
  href="#about"
  onClick={handleSmoothScroll("about")}
  className="px-8 py-4 border border-orange-500 text-orange-400 rounded-lg hover:bg-gradient-to-r from-orange-400/40 to-pink-500/40 transition-all font-semibold text-lg"
>
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
        <section
  id="features"
  className="relative w-full py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-900"
>
  {/* Section Heading */}
  <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-12 text-white tracking-tight">
    <span className="inline-block px-4 py-2 bg-white/10 rounded-xl shadow-md backdrop-blur-md border border-white/20 text-orange-400 text-4xl mb-2">
      🔥 Features
    </span>
  </h2>

  {/* Features Grid */}
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Feature Card 1 */}
    <div
      className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center shadow-xl border border-white/20 transition-transform duration-300 hover:scale-105 hover:shadow-neon-orange hover:border-orange-400/60 fade-in"
    >
      <div className="text-5xl mb-4 drop-shadow-glow-orange">📅</div>
      <h3 className="text-xl font-bold text-white mb-2">Attendance Tracker</h3>
      <p className="text-white/80 text-center">
        Track everyday attendance, calculate overall %, and get safe zone alerts.
      </p>
    </div>

    {/* Feature Card 2 */}
    <div
      className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center shadow-xl border border-white/20 transition-transform duration-300 hover:scale-105 hover:shadow-neon-purple hover:border-purple-400/60 fade-in"
    >
      <div className="text-5xl mb-4 drop-shadow-glow-purple">📊</div>
      <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
      <p className="text-white/80 text-center">
        Visualize attendance trends with graphs and stats to keep you informed.
      </p>
    </div>

    {/* Feature Card 3 */}
    <div
      className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center shadow-xl border border-white/20 transition-transform duration-300 hover:scale-105 hover:shadow-neon-pink hover:border-pink-400/60 fade-in"
    >
      <div className="text-5xl mb-4 drop-shadow-glow-pink">⏰</div>
      <h3 className="text-xl font-bold text-white mb-2">Deadline Manager</h3>
      <p className="text-white/80 text-center">
        Manage assignments, projects, and important academic deadlines in one place.
      </p>
    </div>
  </div>
</section>

        {/* --- Feature Detail Sections --- */}
        <section
  id="attendance"
  className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-purple-900 to-indigo-900 py-20 px-4 md:px-10"
>
  {/* Left: Illustration Placeholder */}
  <div className="flex-1 flex items-center justify-center mb-10 md:mb-0">
    <div className="w-72 h-72 md:w-96 md:h-96 bg-white/10 rounded-3xl flex items-center justify-center shadow-xl">
      {/* Placeholder image, replace src with your illustration */}
      <img
        src="/images/calendar.svg"
        alt="Attendance Illustration"
        className="w-5/6 h-5/6 object-contain rounded-2xl"
        style={{ minWidth: "150px", minHeight: "150px" }}
      />
    </div>
  </div>
  {/* Right: Text */}
  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left fade-in md:animate-slide-in-left">
    <h2 className="text-5xl font-extrabold text-white mb-4 flex items-center gap-3">
      <span className="text-5xl">📅</span> Attendance Tracker
    </h2>
    <p className="text-white/80 text-xl sm:text-2xl leading-relaxed max-w-2xl mb-4">
      Effortlessly manage your subject-wise attendance.<br />
      Visualize your overall percentage.<br />
      Get alerts when you’re close to the danger zone.<br />
      Mark your daily attendance in just one click.
    </p>
  </div>
</section>

<section
  id="analytics"
  className="min-h-screen w-full flex flex-col md:flex-row-reverse items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-indigo-900 py-20 px-4 md:px-10"
>
  {/* Right: Illustration Placeholder */}
  <div className="flex-1 flex items-center justify-center mb-10 md:mb-0">
    <div className="w-72 h-72 md:w-96 md:h-96 bg-white/10 rounded-3xl flex items-center justify-center shadow-xl">
      {/* Placeholder image, replace src with your illustration */}
      <img
        src="/images/analytics.svg"
        alt="Analytics Illustration"
        className="w-5/6 h-5/6 object-contain rounded-2xl"
        style={{ minWidth: "120px", minHeight: "120px" }}
      />
    </div>
  </div>
  {/* Left: Text */}
  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left fade-in md:animate-slide-in-right">
    <h2 className="text-5xl font-extrabold text-white mb-4 flex items-center gap-3">
      <span className="text-5xl">📊</span> Smart Analytics
    </h2>
    <p className="text-white/80 text-xl sm:text-2xl leading-relaxed max-w-2xl mb-4">
      See your attendance trends over weeks or months.<br />
      Use beautiful graphs and safe zone indicators to stay informed.<br />
      Understand your patterns to avoid future risks.
    </p>
  </div>
</section>

<section
  id="deadlines"
  className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-900 to-pink-900 py-20 px-4 md:px-10"
>
  {/* Left: Illustration Placeholder */}
  <div className="flex-1 flex items-center justify-center mb-10 md:mb-0">
    <div className="w-72 h-72 md:w-96 md:h-96 bg-white/10 rounded-3xl flex items-center justify-center shadow-xl">
      {/* Placeholder image, replace src with your illustration */}
      <img
        src="/images/deadlines.svg"
        alt="Deadlines Illustration"
        className="w-5/6 h-5/6 object-contain rounded-2xl"
        style={{ minWidth: "120px", minHeight: "120px" }}
      />
    </div>
  </div>
  {/* Right: Text */}
  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left fade-in md:animate-slide-in-left">
    <h2 className="text-5xl font-extrabold text-white mb-4 flex items-center gap-3">
      <span className="text-5xl">⏰</span> Deadline Manager
    </h2>
    <p className="text-white/80 text-xl sm:text-2xl leading-relaxed max-w-2xl mb-4">
      Keep track of assignments, projects, and test dates.<br />
      Never miss a due date with reminders and priority tags.<br />
      View everything on a clean calendar and to-do timeline.
    </p>
  </div>
</section>

        {/* About Section */}
        <section
  id="about"
  className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-pink-900 to-purple-900 py-20 px-4 md:px-10"
>
  {/* "About Us" label */}
  <div className="mb-4">
    <span className="inline-block px-6 py-2 bg-white/10 text-orange-400 font-extrabold rounded-xl tracking-wide text-3xl shadow">
      About Us
    </span>
  </div>
  {/* Container with Image + Text side-by-side */}
  <div className="flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 max-w-6xl w-full gap-10 md:gap-16 fade-in md:animate-slide-in-right">
    {/* BIGGER PNG on the left */}
    <img
      src="/images/tracko cover pic.png"
      alt="Trackasaurus mascot"
      className="h-96 md:h-[28rem] w-auto object-contain rounded-xl"
    />

    {/* TEXT pushed to right half, left-aligned */}
    <div className="flex-1 w-full flex flex-col items-start text-left">
      <h2 className="text-4xl font-extrabold text-white mb-4 flex items-center gap-3">
        <span className="text-5xl"></span> About Trackasaurus
      </h2>
      <p className="text-white/80 text-xl leading-relaxed w-full">
        Trackasaurus is a student-built productivity tool created by Sai Shravan, who’s been in the same trenches as every student — battling low attendance, forgotten deadlines, and academic chaos..<br /><br />
        That’s where Tracko, the friendly dino-hero, was born 🦖⚡<br />
        Built with code, caffeine, and pure frustration,<br />
        Tracko's mission is simple:<br />
        ✅ Track your attendance before it becomes a problem<br />
        ✅ Visualize your analytics to stay in control<br />
        ✅ Conquer your deadlines like a semester superhero<br />
        No more "Did I attend today?", "When’s the last date?", or "Am I in shortage?"<br />
        Trackasaurus turns student chaos into clarity — one dino step at a time.
      </p>
    </div>
  </div>
  {/* Container with Image + Text side-by-side */}
  <div className="flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 max-w-6xl w-full gap-10 md:gap-16 fade-in md:animate-slide-in-right">
    {/* BIGGER PNG on the left */}
    <img
      src="/images/superdino.png"
      alt="Trackasaurus mascot"
      className="h-96 md:h-[28rem] w-auto object-contain rounded-xl"
    />

    {/* TEXT pushed to right half, left-aligned */}
    <div className="flex-1 w-full flex flex-col items-start text-left">
      <h2 className="text-4xl font-extrabold text-white mb-4 flex items-center gap-3">
        <span className="text-5xl"></span> History Time..
      </h2>
      <p className="text-white/80 text-xl leading-relaxed w-full">
        In the prehistoric jungles of Semesterland…<br />
Life was good — until deadlines rained from the sky like fiery asteroids,
Attendance dropped harder than GPA after midsems,
And students ran in fear from the terrifying beasts called “Shortage Slips” and “Last Minute Submissions.”<br />

Just when it felt like all hope was extinct…<br />

💥 BOOM! A flash of red cape and righteous rage.<br />
🦖 Tracko, the legendary Trackasaurus, arrives — not with claws, but with code.<br />

With a dashboard shield, a cape stitched from lecture notes,
And a brain trained in the arts of reminders, analytics, and attendance tracking —

Tracko fought the chaos.
He turned panic into progress, confusion into clarity, and laziness into legendary habits.


      </p>
    </div>
  </div>
</section>


        {/* Contact Section */}
      </main>
      <footer
  id="footer"
  className="w-full bg-gradient-to-br from-black via-purple-900 to-cyan-600 text-white py-10 px-4 shadow-2xl relative border-t-2 border-black"
>
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
    {/* Left: Tracko Emoji (animated) */}
    <div className="mb-6 md:mb-0 flex-shrink-0">
      <span className="text-5xl animate-bounce select-none">🦖</span>
    </div>
    {/* Center: Main Content */}
    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-2">
      <div className="text-lg font-semibold">
        Built with <span className="animate-pulse">💻</span> by Sai Shravan – Cybersecurity Student
      </div>
      <div className="text-white/80 text-base">
        Trackasaurus is your student sidekick for beating attendance, analytics & deadlines.
      </div>
      <div className="flex items-center gap-4 mt-3">
        {/* Social Icons */}
        <a
          href="https://github.com/Soy-7"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-orange-400 transition-colors"
          aria-label="GitHub"
        >
          {/* GitHub SVG */}
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/sai-shravan-p/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-blue-400 transition-colors"
          aria-label="LinkedIn"
        >
          {/* LinkedIn SVG */}
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm15.25 11.25h-3v-5.5c0-1.32-.03-3.01-1.84-3.01-1.84 0-2.12 1.44-2.12 2.92v5.59h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/>
          </svg>
        </a>
        <a
          href="https://instagram.com/your-instagram"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-pink-400 transition-colors"
          aria-label="Instagram"
        >
          {/* Instagram SVG */}
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41a4.92 4.92 0 0 1 1.77 1.03 4.92 4.92 0 0 1 1.03 1.77c.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43a4.92 4.92 0 0 1-1.03 1.77 4.92 4.92 0 0 1-1.77 1.03c-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41a4.92 4.92 0 0 1-1.77-1.03 4.92 4.92 0 0 1-1.03-1.77c-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.058-1.17.24-1.97.41-2.43a4.92 4.92 0 0 1 1.03-1.77 4.92 4.92 0 0 1 1.77-1.03c.78-.23 1.75-.41 3.03-.47C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.013 7.052.072 5.77.13 4.8.31 4.02.54a7.07 7.07 0 0 0-2.57 1.64A7.07 7.07 0 0 0 .54 4.02c-.23.78-.41 1.75-.47 3.03C.013 8.332 0 8.736 0 12c0 3.264.013 3.668.072 4.948.058 1.28.24 2.25.47 3.03a7.07 7.07 0 0 0 1.64 2.57 7.07 7.07 0 0 0 2.57 1.64c.78.23 1.75.41 3.03.47C8.332 23.987 8.736 24 12 24s3.668-.013 4.948-.072c1.28-.058 2.25-.24 3.03-.47a7.07 7.07 0 0 0 2.57-1.64 7.07 7.07 0 0 0 1.64-2.57c.23-.78.41-1.75.47-3.03.059-1.28.072-1.684.072-4.948s-.013-3.668-.072-4.948c-.058-1.28-.24-2.25-.47-3.03a7.07 7.07 0 0 0-1.64-2.57A7.07 7.07 0 0 0 19.98.54c-.78-.23-1.75-.41-3.03-.47C15.668.013 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.844-10.406a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
          </svg>
        </a>
      </div>
      <div className="text-white/70 text-base mt-2">
        Questions? Slide into my DMs 👉
      </div>
    </div>
    {/* Right: Copyright */}
    <div className="mt-8 md:mt-0 text-white/60 text-sm text-center md:text-right flex-shrink-0">
      © 2025 Trackasaurus. All rights reserved.
    </div>
  </div>
  {/* Scroll to Top Button */}
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all focus:outline-none"
    aria-label="Scroll to top"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
    </svg>
  </button>
</footer>
    </div>
  );
}
