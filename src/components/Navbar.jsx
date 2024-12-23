import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Genevis</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded hover:bg-gray-700">Graph</Link>
              <Link to="/about" className="px-3 py-2 rounded hover:bg-gray-700">About</Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded hover:bg-gray-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Graph
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;