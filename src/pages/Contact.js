import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiMail, FiPhoneCall, FiMapPin } from "react-icons/fi";

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-tr from-green-100 via-yellow-100 to-blue-100 py-24 px-6 md:px-12">
        <div
          className="max-w-6xl mx-auto text-center mb-16"
          data-aos="fade-down"
        >
          <h2 className="text-5xl font-extrabold text-green-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Whether you’re a store, NGO, or supporter — we’d love to hear from you.
          </p>
        </div>

        {/* Grid of Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          data-aos="fade-up"
        >
          {/* Card 1: Email */}
          <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <FiMail className="mx-auto text-4xl text-green-700 mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Email Us</h3>
            <p className="text-gray-700">support@swaplink.org</p>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <FiPhoneCall className="mx-auto text-4xl text-green-700 mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Call Us</h3>
            <p className="text-gray-700">+91 98765 43210</p>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <FiMapPin className="mx-auto text-4xl text-green-700 mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Visit Us</h3>
            <p className="text-gray-700">SwapLink HQ, Mumbai, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className="mt-20 bg-white bg-opacity-60 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl mx-auto p-10"
          data-aos="zoom-in"
        >
          <h3 className="text-3xl font-extrabold text-green-900 text-center mb-6">
            Send a Message
          </h3>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
