import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import VisitorCounter from './VisitorCounter';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-semibold">Genevis &nbsp;</div>
            <span className="text-xl font-thin">Visualizing DepMap Data</span>
          </div>

          <VisitorCounter />

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-lg font-thin px-3 py-2 rounded hover:bg-gray-700">Graph</Link>
              <Link to="/about" className="text-lg font-thin px-3 py-2 rounded hover:bg-gray-700">About</Link>
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
        <div className="md:hidden absolute right-2 top-16 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div className="py-1">
            <Link
              to="/"
              className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Graph
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
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