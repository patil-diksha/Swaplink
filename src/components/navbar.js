import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-20 text-white">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        {/* Logo on the far left */}
        <a href="/" className="text-2xl font-extrabold tracking-wide">
          SwapLink
        </a>

        {/* Menu on the far right for desktop */}
        <div className="hidden md:flex space-x-8 font-semibold">
          <a href="/" className="hover:text-yellow-300 transition duration-300">
            Home
          </a>
          <a href="/about" className="hover:text-yellow-300 transition duration-300">
            About
          </a>
          <a href="/contact" className="hover:text-yellow-300 transition duration-300">
            Contact
          </a>
        </div>

        {/* Hamburger icon for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden text-white bg-transparent px-6 pt-2">
          <a
            href="/"
            className="block py-2 font-semibold hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="/login"
            className="block py-2 font-semibold hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
          <a
            href="/signup"
            className="block py-2 font-semibold hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </a>
        </div>
      )}
    </nav>
  );
}
