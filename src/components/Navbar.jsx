import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="sticky top-0 z-50">
      {/* Primary Navbar */}
      <nav className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-[32px]">
          <div className="flex justify-between items-center h-16">
            {/* Logo on the left */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 text-transparent bg-clip-text hover:from-yellow-300 hover:to-amber-300 transition-all duration-300">
                Today&apos;s Gold Prices
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/blog"
                className={`text-gray-400 hover:text-white transition-all duration-300 ${location.pathname === "/blog" ? "text-yellow-400 font-semibold" : ""}`}
              >
                Blog
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-4 px-6">
              <Link
                to="/blog"
                className={`text-gray-400 hover:text-white transition-all duration-300 ${location.pathname === "/blog" ? "text-yellow-400 font-semibold" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}