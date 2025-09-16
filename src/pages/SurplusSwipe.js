import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { db, auth } from "../firebase"; // Import auth
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function SurplusSwipe() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeControls = useAnimation();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchSurplus = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "surplus"));
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => !item.claimedBy); // Filter out already claimed items
        setItems(data);
      } catch (err) {
        console.error("Error fetching surplus:", err);
      }
    };
    fetchSurplus();
  }, []);

  const handleSwipe = async (direction) => {
    const user = auth.currentUser;

    // Check if user is logged in before claiming
    if (direction === 'right' && !user) {
      alert("Please log in to claim items.");
      navigate('/login');
      return;
    }

    const item = items[currentIndex];
    if (direction === "right") {
      try {
        const itemRef = doc(db, "surplus", item.id);
        await updateDoc(itemRef, {
          claimedBy: user.uid, // Use the actual user's ID
          claimedByName: user.displayName || user.email, // Add the user's name
          claimedAt: serverTimestamp(),
        });
        alert(`You claimed "${item.title}"!`);
      } catch (err) {
        console.error("Error claiming item:", err);
      }
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const swipe = async (dir) => {
    await swipeControls.start({
      x: dir === "right" ? 1000 : -1000,
      rotate: dir === "right" ? 20 : -20,
      opacity: 0,
      transition: { duration: 0.5 },
    });
    handleSwipe(dir);
    swipeControls.set({ x: 0, rotate: 0, opacity: 1 });
  };

  const currentItem = items[currentIndex];

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center relative flex flex-col items-center justify-center px-4 py-12"
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/1326769094/photo/vegetables-and-cereals-in-a-paper-bag-on-a-black-background-the-concept-of-a-consumer-basket.jpg?s=612x612&w=0&k=20&c=dK07o_pY9dCxp8JelX0CI2WG3Uj05x2IQYM-SSpy-Rs=')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm z-0" />

        <div className="z-10">
          {currentItem ? (
            <motion.div
              className="w-80 h-[30rem] bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col justify-between border border-green-300 hover:scale-105 transition-transform duration-300"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(e, info) => {
                if (info.offset.x > 150) swipe("right");
                else if (info.offset.x < -150) swipe("left");
              }}
              animate={swipeControls}
            >
              {currentItem.imageURL && (
                <img
                  src={currentItem.imageURL}
                  alt={currentItem.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}

              <h3 className="text-2xl font-bold mb-2 text-green-900">
                {currentItem.title}
              </h3>
              <p className="text-gray-700">{currentItem.description}</p>
              <p className="font-semibold mt-2 text-green-700">
                Qty: {currentItem.quantity}
              </p>
              <p className="italic text-gray-600">📍 {currentItem.location}</p>
            </motion.div>
          ) : (
            <h2 className="text-xl font-semibold text-white bg-black/30 p-4 rounded-lg">
              🎉 All items reviewed!
            </h2>
          )}

          {currentItem && (
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={() => swipe("left")}
                className="bg-red-100 text-red-600 px-6 py-2 rounded-full shadow hover:bg-red-200 transition"
              >
                ❌ Skip
              </button>
              <button
                onClick={() => swipe("right")}
                className="bg-green-500 text-white px-6 py-2 rounded-full shadow hover:bg-green-600 transition"
              >
                ✅ Claim
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
