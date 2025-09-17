import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, getDocs, query, where, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import L from 'leaflet';
import Navbar from '../components/navbar';
import RoutingMachine from '../components/RoutingMachine';
import { Navigation, CreditCard } from 'lucide-react';
import '../directions.css'; // Import the new CSS file

// Custom-colored marker icons
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const myLocationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export default function SurplusMap() {
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if(user) {
            setCurrentUser(user);
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists() && userDocSnap.data().geolocation) {
              const userData = userDocSnap.data();
              setUserLocation([userData.geolocation.latitude, userData.geolocation.longitude]);
            }
        } else {
            setCurrentUser(null);
        }
    });

    const fetchSurplusItems = async () => {
      try {
        const q = query(collection(db, 'surplus'), where('geolocation', '!=', null));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        const itemsByLocation = items.reduce((acc, item) => {
            if (item.geolocation && item.geolocation.latitude && item.geolocation.longitude) {
                const key = `${item.geolocation.latitude}_${item.geolocation.longitude}`;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
            }
            return acc;
        }, {});

        setGroupedItems(itemsByLocation);
      } catch (error) {
        console.error("Error fetching surplus items for map:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurplusItems();
    return () => unsubscribe();
  }, []);

  const handleGetDirections = (endCoords) => {
      if(!userLocation) {
          alert("Your location is not available. Please set it in your profile.");
          return;
      }
      setRoute({ start: userLocation, end: endCoords });
  }

  const handlePurchase = (item) => {
    if (!currentUser) {
      alert('Please log in to purchase items.');
      return;
    }

    const options = {
      key: 'rzp_test_ILz5tAFajX0g03',
      amount: item.price * 100,
      currency: 'INR',
      name: 'SwapLink',
      description: `Purchase of ${item.title}`,
      image: '/logo192.png',
      handler: async (response) => {
        try {
          const itemRef = doc(db, 'surplus', item.id);
          await updateDoc(itemRef, {
            claimedBy: currentUser.uid,
            claimedByName: currentUser.displayName || currentUser.email,
            claimedAt: serverTimestamp(),
            paymentId: response.razorpay_payment_id,
          });
          alert(`Purchase successful! Payment ID: ${response.razorpay_payment_id}`);
          setRoute(null);
          window.location.reload(); 
        } catch (err) {
          console.error('Error updating document:', err);
          alert('Payment was successful, but there was an error updating the item status.');
        }
      },
      prefill: {
        name: currentUser.displayName || '',
        email: currentUser.email || '',
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
  
  const createGoogleMapsUrl = (start, end) => {
    if (!start || !end) return '';
    const origin = `${start[0]},${start[1]}`;
    const destination = `${end[0]},${end[1]}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading Map...</div>;
  }

  const mapCenter = userLocation || [19.0760, 72.8777];

  return (
    <>
    <Navbar/>
    <div className="h-screen w-full pt-16 relative">
      <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && (
            <Marker position={userLocation} icon={myLocationIcon}>
                <Popup>Your Location</Popup>
            </Marker>
        )}
        {Object.values(groupedItems).map((itemsAtLocation, index) => {
          const firstItem = itemsAtLocation[0];
          const position = [firstItem.geolocation.latitude, firstItem.geolocation.longitude];
          const isMulti = itemsAtLocation.length > 1;
          
          const isAnyClaimed = itemsAtLocation.some(item => !!item.claimedBy);

          let icon = greenIcon;
          if (isMulti) {
              icon = blueIcon;
          } else if (isAnyClaimed) {
              icon = redIcon;
          }

          return (
            <Marker key={index} position={position} icon={icon}>
              <Popup>
                <div className="font-sans max-h-64 overflow-y-auto">
                    {itemsAtLocation.map(item => {
                         const isClaimed = !!item.claimedBy;
                         return (
                            <div key={item.id} className="mb-4 border-b pb-2 last:border-b-0 last:pb-0 last:mb-0">
                                <img src={item.imageURL} alt={item.title} className="w-full h-24 object-cover rounded-md mb-2"/>
                                <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-sm text-gray-600">{item.location}</p>
                                <p className="text-lg font-bold text-green-800 mt-2">₹{item.price || '0'}</p>
                                {isClaimed ? (
                                <p className="text-sm font-bold text-red-600 mt-2">Status: Claimed</p>
                                ) : (
                                <>
                                <p className="text-sm font-bold text-green-600 mt-2">Status: Available</p>
                                {userLocation && (
                                <div className="flex flex-col items-start gap-2 mt-2">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleGetDirections(position)} className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                                            Show Route
                                        </button>
                                        <a href={createGoogleMapsUrl(userLocation, position)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                                            <Navigation size={14} /> Live
                                        </a>
                                    </div>
                                    <button onClick={() => handlePurchase(item)} className="w-full flex items-center justify-center gap-2 text-sm bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-2 rounded mt-2">
                                        <CreditCard size={14} /> Buy Now
                                    </button>
                                </div>
                                )}
                                </>
                                )}
                                {item.creatorName && <p className="text-xs text-gray-500 mt-1">Listed by: {item.creatorName}</p>}
                           </div>
                         )
                    })}
                     {isMulti && <div className="text-center font-bold text-sm mt-2 text-blue-700">{itemsAtLocation.length} items at this location</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
        <RoutingMachine route={route} />
      </MapContainer>
      {route && (
          <button onClick={() => setRoute(null)} className="absolute top-20 right-4 z-[1000] bg-white p-2 rounded-md shadow-lg text-gray-800 font-semibold">
              Clear Route
          </button>
      )}
    </div>
    </>
  );
}

