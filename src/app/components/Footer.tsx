export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; 2025 Trackasaurus. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-white transition duration-300">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition duration-300">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition duration-300">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}