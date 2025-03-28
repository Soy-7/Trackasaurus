import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={`${styles.navbar}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/" className="hover:text-orange-500 transition duration-300">
          Trackasaurus
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className={styles.navLinks}>
        <li>
          <a href="#hero" className="hover:text-orange-500 transition duration-300">
            Main
          </a>
        </li>
        <li>
          <a href="#features" className="hover:text-orange-500 transition duration-300">
            Features
          </a>
        </li>
        <li>
          <a href="#about" className="hover:text-orange-500 transition duration-300">
            About
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:text-orange-500 transition duration-300">
            Contact
          </a>
        </li>
      </ul>

      {/* Sign Up Button */}
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
