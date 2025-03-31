"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './Navbar.module.css';

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

  return (
    <nav className={`navbar w-full max-w-full overflow-hidden px-4 py-4 ${styles.navbar}`}>
      {/* Logo - Always on the left */}
      <div className={styles.logo}>
        <Link href="/" className="hover:text-orange-500 transition duration-300">
          Trackasaurus
        </Link>
      </div>

      {/* Navigation Links - Always in the middle */}
      <ul className={styles.navLinks}>
        <li>
          <a href="#hero" className="nav-anchor-link hover:text-orange-500 transition duration-300">
            Main
          </a>
        </li>
        <li>
          <a href="#features" className="nav-anchor-link hover:text-orange-500 transition duration-300">
            Features
          </a>
        </li>
        <li>
          <a href="#about" className="nav-anchor-link hover:text-orange-500 transition duration-300">
            About
          </a>
        </li>
        <li>
          <a href="#contact" className="nav-anchor-link hover:text-orange-500 transition duration-300">
            Contact
          </a>
        </li>
      </ul>

      {/* Sign Up Button - Always on the right */}
      <div>
        <Link href="/signup">
          <button className={`${styles.signupButton} hover:bg-orange-600 transition duration-300`}>
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
