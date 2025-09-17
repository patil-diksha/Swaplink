import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { db, auth } from "../firebase"; // Import auth
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  where,
  query
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
        const q = query(collection(db, "surplus"), where("claimedBy", "==", null));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(data);
      } catch (err) {
        console.error("Error fetching surplus:", err);
      }
    };
    fetchSurplus();
  }, []);

  const handlePurchase = (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to purchase items.');
      navigate('/login');
      return;
    }

    const options = {
      key: 'rzp_test_ILz5tAFajX0g03', // This is a public test key from Razorpay docs.
      amount: item.price * 100,
      currency: 'INR',
      name: 'SwapLink',
      description: `Purchase of ${item.title}`,
      image: '/logo192.png',
      handler: async (response) => {
        try {
          const itemRef = doc(db, 'surplus', item.id);
          await updateDoc(itemRef, {
            claimedBy: user.uid,
            claimedByName: user.displayName || user.email,
            claimedAt: serverTimestamp(),
            paymentId: response.razorpay_payment_id,
          });
          alert(`Purchase successful! Payment ID: ${response.razorpay_payment_id}`);
          setCurrentIndex((prev) => prev + 1);
        } catch (err) {
          console.error('Error updating document:', err);
          alert('Payment was successful, but there was an error updating the item status.');
        }
      },
      prefill: {
        name: user.displayName || '',
        email: user.email || '',
      },
      theme: {
        color: '#4CAF50',
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal was closed.');
        }
      },
      events: {
        'payment.failed': function (response) {
            alert(`Oops! Something went wrong.\nPayment Failed.\n\nError: ${response.error.description}`);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSwipe = async (direction) => {
    if (direction === "right") {
      handlePurchase(items[currentIndex]);
    } else {
        setCurrentIndex((prev) => prev + 1);
    }
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
        <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm z-0" />

        <div className="z-10">
          {currentItem ? (
            <motion.div
              className="w-80 h-[32rem] bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col justify-between border border-green-300 hover:scale-105 transition-transform duration-300"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(e, info) => {
                if (info.offset.x > 150) swipe("right");
                else if (info.offset.x < -150) swipe("left");
              }}
              animate={swipeControls}
            >
              <div>
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
                <p className="text-gray-700 text-sm">{currentItem.description}</p>
              </div>
              <div>
                <p className="font-semibold mt-2 text-green-700">
                    Qty: {currentItem.quantity}
                </p>
                <p className="italic text-gray-600">📍 {currentItem.location}</p>
                <p className="text-xl font-bold text-emerald-800 mt-2">
                    ₹{currentItem.price}
                </p>
              </div>
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
                ✅ Buy
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

