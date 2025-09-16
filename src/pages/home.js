import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImage from '../assets/hero-image.jpg';
import { auth, db } from "../firebase";

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      easing: "ease-in-out",
      duration: 800,
      delay: 100,
    });
  }, []);

  return (
    

    <>
      {/* Hero Section */}

      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background image */}
        <img
          src={heroImage}
          alt="Fresh groceries background"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover filter brightness-75 transition-opacity duration-1000 ease-in-ou"
        />
        {/* Dark translucent overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            Redistribute. Reduce Waste. Rebuild Communities.
          </h1>
          <p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto drop-shadow-md"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            From Extra to Essential — Matching Surplus with Those Who Need It Most.
          </p>



          <div
            className="flex flex-col md:flex-row gap-6 justify-center"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="600"
          >
          <a
            href="#how-it-works"
            className="bg-white text-green-700 hover:bg-green-100 border border-green-600 px-8 py-3 rounded-full font-semibold shadow-md transform hover:scale-105 transition duration-300"
          >
           How It Works
          </a>
            <a
              href="/login"
              className="bg-white text-green-700 hover:bg-green-100 border border-green-600 px-8 py-3 rounded-full font-semibold shadow-md transform hover:scale-105 transition duration-300"
            >
              Login / Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-white max-w-7xl mx-auto px-6 md:px-12"
      >
        <h2
          className="text-center text-4xl font-extrabold mb-16 text-indigo-900"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          How It Works
        </h2>
        <div
          className="flex flex-col md:flex-row gap-12 overflow-x-auto scrollbar-hide"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          {/* Card 1 */}
          <div className="min-w-[250px] bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-xl font-bold mb-2">Store Lists Product</h3>
            <p className="text-center">
              Add near-expiry food or stock with location & details.
            </p>
          </div>
          {/* Card 2 */}
          <div className="min-w-[250px] bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="text-6xl mb-6">🔔</div>
            <h3 className="text-xl font-bold mb-2">Notification Sent</h3>
            <p className="text-center">Nearby stores and NGOs are notified instantly.</p>
          </div>
          {/* Card 3 */}
          <div className="min-w-[250px] bg-gradient-to-br from-yellow-400 via-red-400 to-pink-500 text-white rounded-xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="text-6xl mb-6">🤝</div>
            <h3 className="text-xl font-bold mb-2">First Claim Wins</h3>
            <p className="text-center">Claiming store/NGO arranges pickup with approval.</p>
          </div>
          {/* Card 4 */}
          <div className="min-w-[250px] bg-gradient-to-br from-teal-400 to-cyan-600 text-white rounded-xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="text-6xl mb-6">💚</div>
            <h3 className="text-xl font-bold mb-2">Waste Prevented</h3>
            <p className="text-center">Food saved, impact tracked, communities supported.</p>
          </div>
        </div>
      </section>

      {/* Who Can Use It */}
      <section className="py-20 bg-gradient-to-tr from-indigo-900 via-blue-700 to-green-600 text-white max-w-7xl mx-auto px-6 md:px-12 rounded-3xl shadow-xl my-20">
        <h2
          className="text-center text-4xl font-extrabold mb-16"
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          Who Can Use SwapLink?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Link to="/members/store"
            className="bg-white text-indigo-900 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition duration-300 cursor-pointer"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="text-6xl mb-4">🏬</div>
            <h3 className="text-2xl font-bold mb-2">Supermarkets</h3>
            <p className="text-center">
              Reduce waste, cut loss, and track impact with ease.
            </p>
          </Link>
          <Link to="/members/ngo"
            className="bg-white text-indigo-900 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition duration-300 cursor-pointer"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-bold mb-2">NGOs</h3>
            <p className="text-center">Get food supplies to feed people in your community.</p>
          </Link>
          <Link to="/members/restaurant"
            className="bg-white text-indigo-900 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition duration-300 cursor-pointer"
            data-aos="zoom-in"
            data-aos-delay="500"
          >
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-2">Restaurants</h3>
            <p className="text-center">Claim discounted stock and refill shelves fast.</p>
          </Link>
        </div>
      </section>

      {/* Real-Time Stats */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-6 md:px-12 rounded-xl shadow-lg mb-20">
        <h2
          className="text-center text-4xl font-extrabold mb-12 text-indigo-900"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          Our Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-indigo-900">
          <div
            className="p-6 bg-gradient-to-tr from-green-400 to-blue-500 rounded-xl shadow-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="text-5xl font-extrabold">
              12,430 <span className="text-lg">kg</span>
            </div>
            <p className="mt-2 font-semibold">Food Saved</p>
          </div>
          <div
            className="p-6 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl shadow-lg"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="text-5xl font-extrabold">235</div>
            <p className="mt-2 font-semibold">Active Stores</p>
          </div>
          <div
            className="p-6 bg-gradient-to-tr from-yellow-400 to-red-400 rounded-xl shadow-lg"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="text-5xl font-extrabold">89</div>
            <p className="mt-2 font-semibold">Verified NGOs</p>
          </div>
          <div
            className="p-6 bg-gradient-to-tr from-teal-400 to-cyan-600 rounded-xl shadow-lg"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="text-5xl font-extrabold">
              18.4 <span className="text-lg">tons</span>
            </div>
            <p className="mt-2 font-semibold">CO₂ Saved</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-blue-700 to-green-600 text-white max-w-7xl mx-auto px-6 md:px-12 rounded-3xl shadow-xl mb-20">
        <h2
          className="text-center text-4xl font-extrabold mb-16"
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          What Our Partners Say
        </h2>
        <div
          className="max-w-3xl mx-auto text-center px-4"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <blockquote className="italic text-xl leading-relaxed">
            “SwapLink helped us save 500+ meals a week. It’s a blessing for both the
            environment and the community.”
          </blockquote>
          <p className="mt-6 font-semibold text-lg">– Priya R., NGO Lead</p>
        </div>
      </section>

      {/* Join Prompt */}
      <section
        className="py-20 bg-white text-indigo-900 text-center rounded-xl shadow-lg max-w-4xl mx-auto mb-20"
        data-aos="zoom-in"
        data-aos-duration="1000"
      >
        <h2 className="text-4xl font-extrabold mb-6">Be Part of the Change</h2>
        <p className="mb-8 text-lg max-w-xl mx-auto">
          Sign up today to start redistributing, saving, and supporting!
        </p>
        <a
          href="/signup"
          className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
        >
          Join the Movement →
        </a>
        <p className="mt-4">
          <a href="/login" className="underline hover:text-green-600 transition">
            Already a partner? Login here
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-10 text-center text-sm">
        <div className="mb-6">
          <a href="/about" className="mx-4 hover:underline">
            About
          </a>
          <a href="/contact" className="mx-4 hover:underline">
            Contact Us
          </a>
          <a href="#" className="mx-4 hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="mx-4 hover:underline">
            FAQs
          </a>
        </div>
        {/* <p>© 2025 SwapLink | Powered by CodeCrushers</p> */}
      </footer>
    </>

  );
}
