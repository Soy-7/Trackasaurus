"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './Navbar.module.css';
import Image from "next/image";

const Navbar: React.FC = () => {
  useEffect(() => {
    // Set up smooth scrolling via CSS
    document.documentElement.style.scrollBehavior = 'smooth';

    // Set up Intersection Observer to update URL hash on scroll
    const sections = document.querySelectorAll('section[id]');

    // Options for the observer
    const observerOptions = {
      root: null, // viewport is the root
      rootMargin: '-100px 0px -70% 0px', // trigger when element is 100px from top
      threshold: 0 // trigger as soon as any part is visible
    };

    // Callback for the observer
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id && history.pushState) {
            history.replaceState(null, '', `#${id}`);

            // Optionally, update active state in the navbar
            document.querySelectorAll('.nav-anchor-link').forEach(link => {
              link.classList.toggle('active', (link as HTMLAnchorElement).hash === `#${id}`);
            });
          }
        }
      });
    };

    // Create and use the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      // Clean up
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Optionally update the URL hash without jumping
        history.replaceState(null, '', href);
      }
    }
  };

  return (
    <nav className={`navbar w-full max-w-full overflow-hidden px-4 py-4 flex items-center justify-between ${styles.navbar}`}>
      {/* Left: Profile PNG and Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/images/superdino logo.png"
          alt="Sai Shravan"
          className="w-20 h-20 shadow-lg"
        />
        <Link href="/" className="logo text-xl font-bold text-white hover:text-orange-400 transition">
          Trackasaurus
        </Link>
      </div>

      {/* Navigation Links - Always in the middle */}
      <ul className={styles.navLinks}>
        <li>
          <a href="#hero" className="nav-anchor-link hover:text-orange-500 transition duration-300" onClick={handleNavClick}>
            Main
          </a>
        </li>
        <li>
          <a href="#features" className="nav-anchor-link hover:text-orange-500 transition duration-300" onClick={handleNavClick}>
            Features
          </a>
        </li>
        <li>
          <a href="#about" className="nav-anchor-link hover:text-orange-500 transition duration-300" onClick={handleNavClick}>
            About
          </a>
        </li>
        <li>
          <a
            href="#footer"
            className="nav-anchor-link hover:text-orange-500 transition duration-300"
            onClick={handleNavClick} // if you use a smooth scroll handler
          >
            Contact
          </a>
        </li>
      </ul>

      {/* Sign Up Button - Always on the right */}
      <div>
        <Link href="/signup">
          <button className={`${styles.signupButton} bg-gradient-to-r from-orange-400 to-pink-500 hover:text-white/80 transition duration-300`}>
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
