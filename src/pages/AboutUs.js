import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-br from-green-100 via-green-200 to-yellow-100 min-h-screen py-20 px-6 md:px-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1
          className="text-5xl font-extrabold text-green-800 mb-6 drop-shadow"
          data-aos="fade-down"
        >
          About SwapLink
        </h1>
        <p
          className="text-lg text-green-900 max-w-3xl mx-auto"
          data-aos="fade-up"
        >
          SwapLink is a smart surplus redistribution platform that connects stores
          with excess stock to those who need it most—NGOs and nearby stores—
          helping reduce waste and empower communities.
        </p>
      </div>

      {/* Our Mission */}
      <div
        className="bg-white bg-opacity-60 backdrop-blur-md rounded-3xl shadow-xl p-10 max-w-6xl mx-auto mb-20"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-green-900 mb-4">Our Mission 🌍</h2>
        <p className="text-green-800 text-lg leading-relaxed">
          Every day, tons of food and products go to waste simply because they're nearing expiry
          or are unsold. Our mission is to turn that waste into opportunity by redirecting
          these goods to nearby NGOs, food banks, or stores at reduced cost—saving money,
          helping people, and protecting the planet.
        </p>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2
          className="text-4xl font-bold text-green-900 mb-10"
          data-aos="fade-down"
        >
          How It Works 🔄
        </h2>
        <div className="grid gap-8 md:grid-cols-4 px-4">
          {[
            { icon: "📦", title: "List Surplus", desc: "Stores upload near-expiry or excess stock with details and location." },
            { icon: "📲", title: "Instant Alerts", desc: "Nearby NGOs and stores are instantly notified via system alerts." },
            { icon: "🤝", title: "First Claim Wins", desc: "Whoever claims first gets approval and arranges pickup." },
            { icon: "💚", title: "Impact Tracked", desc: "Waste saved, lives helped, and CO₂ prevented are tracked." }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-green-300 to-blue-300 text-green-900 rounded-xl shadow-xl p-6 hover:scale-105 transition-transform duration-300"
              data-aos="zoom-in"
              data-aos-delay={idx * 200}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Services */}
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-green-900 mb-10" data-aos="fade-up">
          Our Services 🛠️
        </h2>
        <div className="grid gap-8 md:grid-cols-3 px-4">
          {[
            {
              icon: "🧾",
              title: "Inventory Listing",
              desc: "Easily add products using intuitive forms with expiry, quantity & pickup location."
            },
            {
              icon: "📍",
              title: "Geo-Matching Engine",
              desc: "Smart AI matches surplus to nearby NGOs or partner stores based on distance and needs."
            },
            {
              icon: "📊",
              title: "Impact Dashboard",
              desc: "Visualize your saved items, CO₂ reduced, and community impact over time."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition"
              data-aos="fade-up"
              data-aos-delay={idx * 150}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-green-800">{item.title}</h3>
              <p className="text-green-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div
        className="mt-20 text-center"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <h2 className="text-3xl font-extrabold text-green-900 mb-4">
          Join the Movement 💫
        </h2>
        <p className="text-green-800 mb-8">
          Be a part of the change — whether you're a store, NGO, or citizen.
        </p>
        <a
          href="/signup"
          className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition"
        >
          Get Started →
        </a>
      </div>
    </section>
  );
}
