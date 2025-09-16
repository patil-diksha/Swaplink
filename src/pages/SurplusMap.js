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

// A different icon for clusters
const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export default function SurplusMap() {
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurplusItems = async () => {
      try {
        const q = query(collection(db, 'surplus'), where('geolocation', '!=', null));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Group items by location
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
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading Map...</div>;
  }

  const mapCenter = [19.0760, 72.8777]; // Centered on Mumbai

  return (
    <div className="h-screen w-full">
      <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.values(groupedItems).map((itemsAtLocation, index) => {
          const firstItem = itemsAtLocation[0];
          const position = [firstItem.geolocation.latitude, firstItem.geolocation.longitude];
          const isMulti = itemsAtLocation.length > 1;
          
          // An item is considered claimed if any item at the location is claimed.
          // For single items, this is straightforward. For multiple, the marker turns blue.
          const isAnyClaimed = itemsAtLocation.some(item => !!item.claimedBy);

          let icon = greenIcon; // Default to available
          if (isMulti) {
              icon = blueIcon; // Use blue for multiple items
          } else if (isAnyClaimed) {
              icon = redIcon; // Use red for single, claimed items
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
                                {isClaimed ? (
                                <p className="text-sm font-bold text-red-600 mt-2">Status: Claimed</p>
                                ) : (
                                <p className="text-sm font-bold text-green-600 mt-2">Status: Available</p>
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
      </MapContainer>
    </div>
  );
}
