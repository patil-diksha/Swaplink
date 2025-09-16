import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { PackagePlus, ShoppingCart, ThumbsUp, LogOut, Home, Map } from 'lucide-react'; // Import Map icon

// Main Dashboard Component
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.error("User document not found.");
          handleSignOut();
        }
      } else {
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigate('/login'))
      .catch((error) => console.error('Sign out error', error));
  };

  if (loading || !userData || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="text-xl font-semibold text-green-700">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">
            Welcome, <span className="text-green-600">{userData.name || user.displayName || userData.email}</span>!
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/home" className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <Home size={18} /> Home
            </Link>
            <button onClick={handleSignOut} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {userData.userType === 'store' || userData.userType === 'restaurant' ? (
          <StoreDashboard user={user} />
        ) : (
          <NgoDashboard user={user} />
        )}
      </main>
    </div>
  );
}

// Store Dashboard
function StoreDashboard({ user }) {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      const q = query(collection(db, 'surplus'), where('createdBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, [user]);

  return (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Store Dashboard</h2>
      <Link
        to="/list-surplus"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg shadow-md mb-8"
      >
        <PackagePlus size={22} />
        List New Surplus Item
      </Link>
      
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-t pt-6">Your Current Listings</h3>
      {loading ? <p>Loading your listings...</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.length > 0 ? (
            myListings.map(item => (
              <div key={item.id} className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
                <img src={item.imageURL} alt={item.title} className="w-full h-32 object-cover rounded-md mb-3" />
                <h4 className="font-bold text-green-800">{item.title}</h4>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                {item.claimedBy && <p className="text-sm font-bold text-blue-600 mt-2">Claimed!</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">You haven't listed any items yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

// NGO Dashboard
function NgoDashboard() {
  return (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg text-center">
      <h2 className="text-3xl font-bold text-green-900 mb-8">NGO Dashboard</h2>
      <p className="text-gray-700 mb-8">
        Find available surplus from local partners to support your community.
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <Link to="/surplus-map" className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 text-lg shadow-md">
          <Map size={22} />
          View Surplus Map
        </Link>
        <Link to="/surplus-list" className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 text-lg shadow-md">
          <ShoppingCart size={22} />
          Browse as List
        </Link>
        <Link to="/swipe-surplus" className="flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 text-lg shadow-md">
          <ThumbsUp size={22} />
          Swipe & Claim
        </Link>
      </div>
    </div>
  );
}

