import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';

const RoutingMachine = ({ route }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Initialize the routing control if it doesn't exist
    if (!routingControlRef.current) {
      routingControlRef.current = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: '#6FA1EC', weight: 4 }],
        },
        show: true,
        showAlternatives: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        // Hide the default start/end markers since we have our own
        createMarker: () => null 
      }).addTo(map);
    }

    // Update waypoints based on the route prop
    if (route && route.start && route.end) {
      routingControlRef.current.setWaypoints([
        L.latLng(route.start[0], route.start[1]),
        L.latLng(route.end[0], route.end[1]),
      ]);
    } else {
      // Clear the route if the prop is null
      routingControlRef.current.setWaypoints([]);
    }
  }, [map, route]);

  return null;
};

export default RoutingMachine;

