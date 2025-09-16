import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = React.useState([19.0760, 72.8777]); // Default to Mumbai
  const markerRef = React.useRef(null);

  const DraggableMarker = () => {
    const map = useMapEvents({
      click(e) {
        const newPos = e.latlng;
        setPosition([newPos.lat, newPos.lng]);
        onLocationSelect({ latitude: newPos.lat, longitude: newPos.lng });
        map.flyTo(newPos, map.getZoom());
      },
    });

    const eventHandlers = React.useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition([newPos.lat, newPos.lng]);
            onLocationSelect({ latitude: newPos.lat, longitude: newPos.lng });
          }
        },
      }),
      [onLocationSelect],
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      >
        <Popup minWidth={90}>
          <span className="font-semibold">Drag or click to set location</span>
        </Popup>
      </Marker>
    );
  };

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-green-300">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker />
      </MapContainer>
    </div>
  );
}

export default LocationPicker;

