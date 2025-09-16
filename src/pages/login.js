import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/navbar";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true, easing: "ease-in-out", duration: 800, delay: 100 });
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // No alert needed, will redirect automatically
      navigate("/dashboard"); // 🔑 Redirect to Dashboard after login
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <>
        <style>{`
          @keyframes floatRotateScale1 { 0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.3;} 50% { transform: translateY(-20px) rotate(15deg) scale(1.1); opacity: 0.6;} }
          @keyframes floatRotateScale2 { 0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.25;} 50% { transform: translateY(-15px) rotate(-15deg) scale(0.95); opacity: 0.5;} }
          @keyframes floatRotateScale3 { 0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.35;} 50% { transform: translateY(-25px) rotate(10deg) scale(1.05); opacity: 0.7;} }
          .floating-icon { position: absolute; font-size: 3rem; user-select: none; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1)); pointer-events: none; opacity: 0.3; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
          .icon1 { top: 8%; left: 10%; animation: floatRotateScale1 6s 0s infinite alternate; }
          .icon2 { top: 20%; left: 85%; animation: floatRotateScale2 8s 2s infinite alternate; }
          .icon3 { top: 12%; left: 60%; animation: floatRotateScale3 7s 1.5s infinite alternate; }
          .icon4 { top: 45%; left: 75%; animation: floatRotateScale1 9s 3s infinite alternate; }
          .icon5 { top: 75%; left: 82%; animation: floatRotateScale2 6.5s 1s infinite alternate; }
          .icon6 { top: 70%; left: 8%; animation: floatRotateScale3 8.5s 0.5s infinite alternate; }
          .icon7 { top: 85%; left: 40%; animation: floatRotateScale1 7.5s 2.5s infinite alternate; }
          .icon8 { top: 35%; left: 20%; animation: floatRotateScale2 6.8s 4s infinite alternate; }
        `}</style>

        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-yellow-100 via-green-200 to-green-400 px-6 overflow-hidden">
          <div className="floating-icon icon1">🍎</div>
          <div className="floating-icon icon2">🥕</div>
          <div className="floating-icon icon3">🍞</div>
          <div className="floating-icon icon4">🛒</div>
          <div className="floating-icon icon5">🍋</div>
          <div className="floating-icon icon6">🥦</div>
          <div className="floating-icon icon7">🍇</div>
          <div className="floating-icon icon8">🍅</div>

          <div className="relative z-10 bg-white bg-opacity-60 backdrop-blur-md rounded-3xl shadow-xl max-w-md w-full p-10" data-aos="fade-up">
            <h2 className="text-4xl font-extrabold text-green-900 mb-8 text-center">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-green-900 font-semibold mb-2">Email Address</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" />
              </div>

              <div>
                <label htmlFor="password" className="block text-green-900 font-semibold mb-2">Password</label>
                <input type="password" id="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-yellow-400 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300">
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-green-900">
              Don't have an account?{" "}
              <a href="/signup" className="underline hover:text-yellow-600 transition">Sign Up</a>
            </p>
          </div>
        </section>
      </>
    </>
  );
}
