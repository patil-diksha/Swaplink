import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.error("Logout Error:", error));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-20 text-white bg-black bg-opacity-20 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        {/* Logo on the far left */}
        <a href="/home" className="text-2xl font-extrabold tracking-wide">
          SwapLink
        </a>

        {/* Menu on the far right for desktop */}
        <div className="hidden md:flex items-center space-x-8 font-semibold">
          <a href="/home" className="hover:text-yellow-300 transition duration-300">
            Home
          </a>
          <a href="/about" className="hover:text-yellow-300 transition duration-300">
            About
          </a>
          <a href="/contact" className="hover:text-yellow-300 transition duration-300">
            Contact
          </a>
          {user ? (
            <>
              <a href="/dashboard" className="hover:text-yellow-300 transition duration-300">
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="hover:text-yellow-300 transition duration-300">
                Login
              </a>
              <a href="/signup" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold transition duration-300">
                Sign Up
              </a>
            </>
          )}
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
        <div className="md:hidden text-white bg-black bg-opacity-50 px-6 py-4">
          <a href="/home" className="block py-2 font-semibold hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Home</a>
          <a href="/about" className="block py-2 font-semibold hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>About</a>
          <a href="/contact" className="block py-2 font-semibold hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Contact</a>
          <hr className="my-2 border-gray-500"/>
          {user ? (
            <>
              <a href="/dashboard" className="block py-2 font-semibold hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Dashboard</a>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left py-2 font-semibold hover:text-yellow-300 transition">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="block py-2 font-semibold hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Login</a>
              <a href="/signup" className="block py-2 font-semibold hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Sign Up</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
