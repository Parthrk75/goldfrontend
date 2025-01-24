import { Link, useLocation } from "react-router-dom";
import { TrendingUp, LineChart, Newspaper, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/live-price", label: "Live Price", icon: TrendingUp },
    { path: "/gold-chart", label: "Gold Chart", icon: LineChart },
    { path: "/news", label: "News", icon: Newspaper },
  ];

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

            {/* Desktop Navigation on the right */}
            <div className="hidden md:flex md:items-center md:space-x-8 ml-auto">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(path)
                      ? "text-yellow-400 bg-gray-700"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive(path)
                  ? "text-yellow-400 bg-gray-700"
                  : "text-gray-300 hover:text-yellow-400 hover:bg-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
