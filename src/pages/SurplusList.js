

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/navbar";
import { PackageCheck, MapPin, Layers3 } from "lucide-react";
import { motion } from "framer-motion";

export default function SurplusList() {
  const [surplusItems, setSurplusItems] = useState([]);

  useEffect(() => {
    const fetchSurplus = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "surplus"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSurplusItems(items);
      } catch (error) {
        console.error("Error fetching surplus:", error);
      }
    };

    fetchSurplus();
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            🥬 Available Surplus Items
          </h2>

          {surplusItems.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {surplusItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-md p-6 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {item.imageURL && (
                    <img
                      src={item.imageURL}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-emerald-600" />
                    {item.title}
                  </h3>
                  <p className="text-gray-800 mb-3">{item.description}</p>
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <Layers3 className="w-4 h-4" /> Quantity: {item.quantity}
                  </p>
                  <p className="text-sm italic text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {item.location}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white mt-20">
              <p className="text-xl">📦 No surplus items listed yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}