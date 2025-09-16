import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import L from 'leaflet';

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


export default function SurplusMap() {
  const [surplusItems, setSurplusItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurplusItems = async () => {
      try {
        // Query for all surplus items that have a geolocation field
        const q = query(collection(db, 'surplus'), where('geolocation', '!=', null));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        console.log("Fetched items for map:", items); // For debugging
        setSurplusItems(items);
      } catch (error) {
        console.error("Error fetching surplus items for map:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurplusItems();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading Map...</div>;
  }

  // Default center for the map if no items are available
  const mapCenter = [19.0760, 72.8777]; // Centered on Mumbai

  return (
    <div className="h-screen w-full">
      <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {surplusItems.map(item => {
          // Check if geolocation data is valid before creating a marker
          if (item.geolocation && item.geolocation.latitude && item.geolocation.longitude) {
            const position = [item.geolocation.latitude, item.geolocation.longitude];
            const isClaimed = !!item.claimedBy;

            return (
              <Marker key={item.id} position={position} icon={isClaimed ? redIcon : greenIcon}>
                <Popup>
                  <div className="font-sans">
                    <img src={item.imageURL} alt={item.title} className="w-full h-24 object-cover rounded-md mb-2"/>
                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                    {isClaimed ? (
                      <p className="text-sm font-bold text-red-600 mt-2">Status: Claimed</p>
                    ) : (
                      <p className="text-sm font-bold text-green-600 mt-2">Status: Available</p>
                    )}
                     {item.creatorName && <p className="text-xs text-gray-500 mt-1">Listed by: {item.creatorName}</p>}
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null; // Don't render a marker if location is invalid
        })}
      </MapContainer>
    </div>
  );
}

