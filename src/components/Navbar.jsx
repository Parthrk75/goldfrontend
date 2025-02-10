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

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}