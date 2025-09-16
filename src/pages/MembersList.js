import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '../components/navbar';
import { motion } from 'framer-motion';
import { Building, HeartHandshake, Utensils } from 'lucide-react';

// Helper to get user type display info
const userTypeDetails = {
  store: { title: 'Stores & Supermarkets', icon: <Building className="w-8 h-8" /> },
  ngo: { title: 'NGOs & Partners', icon: <HeartHandshake className="w-8 h-8" /> },
  restaurant: { title: 'Restaurants', icon: <Utensils className="w-8 h-8" /> },
};

export default function MembersList() {
  const { userType } = useParams(); // Gets 'store', 'ngo', or 'restaurant' from the URL
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const details = userTypeDetails[userType] || { title: 'Members', icon: null };

  useEffect(() => {
    const fetchMembers = async () => {
      if (!userType) return;

      setLoading(true);
      try {
        const q = query(collection(db, 'users'), where('userType', '==', userType));
        const querySnapshot = await getDocs(q);
        const memberList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMembers(memberList);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
      setLoading(false);
    };

    fetchMembers();
  }, [userType]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="text-blue-500">{details.icon}</span>
            <h1 className="text-4xl font-bold text-gray-800">
              {details.title}
            </h1>
          </motion.div>
          
          {loading ? (
            <p className="text-gray-600">Loading members...</p>
          ) : (
            members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-md text-left"
                  >
                    <p className="font-semibold text-blue-700 truncate">{member.name || member.email}</p>
                    <p className="text-sm text-gray-500">Member since: {new Date(member.createdAt.seconds * 1000).toLocaleDateString()}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-8">No members found for this category yet.</p>
            )
          )}
           <Link to="/home" className="inline-block mt-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
