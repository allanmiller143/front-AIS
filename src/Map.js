import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const Map = ({ coordinates, setAddress, setFinalAddress, setDialogFields, setDialogFinalFields, setPricePredict, setLoading }) => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);

  const parseAddress = (address) => {
    const addressParts = address.split(', ');
    let ad = {
      street: addressParts[0] || '',
      neighborhood: addressParts[1] || '',
      city: addressParts[2] || '',
      state: addressParts[3] || '',
      country: addressParts[4] || '',
    };
    return ad;
  };

// Define postToServer before using it in useCallback
async function postToServer(data) {
  const url = 'http://15.228.36.187:3000';
  setLoading(true);
  setPricePredict(null);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Adjust if needed
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Resposta do servidor:', responseData);
    return responseData;
  } catch (error) {
    console.error('Erro ao fazer o POST:', error.message);
    throw error;
  } finally {
    setLoading(false);
  }
}

// Then, use it inside useCallback
const updateRoute = useCallback(() => {
  if (startMarkerRef.current && endMarkerRef.current) {
    const waypoints = [
      startMarkerRef.current.getLatLng(),
      endMarkerRef.current.getLatLng(),
    ];
    routingControlRef.current.setWaypoints(waypoints);

    const routeData = {
      latOrigin: waypoints[0].lat,
      lngOrigin: waypoints[0].lng,
      latDest: waypoints[1].lat,
      lngDest: waypoints[1].lng,
    };
    console.log(routeData);
    postToServer(routeData)
      .then((data) => {
        console.log('Sucesso:', data);
        setPricePredict(data.predictedFare);
      })
      .catch((err) => {
        console.error('Erro:', err);
      });
  }
}, [setPricePredict]); // No need to include postToServer in the dependency array since it's already defined outside of useCallback

  useEffect(() => {
    const defaultIcon = L.icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const map = L.map(mapRef.current).setView([51.505, -0.09], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const routingControl = L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
      lineOptions: { styles: [{ color: '#6FA1EC', weight: 4 }] },
      createMarker: () => null,
      router: L.Routing.osrmv1({ suppressWaypoints: true }),
      show: false,
      addWaypoints: false,
    }).addTo(map);

    routingControlRef.current = routingControl;

    const pane = document.querySelector('.leaflet-routing-container');
    if (pane) pane.style.display = 'none';

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (!startMarkerRef.current) {
        startMarkerRef.current = L.marker([lat, lng], { icon: defaultIcon, draggable: true })
          .addTo(map)
          .bindPopup('Origem')
          .openPopup();
        startMarkerRef.current.on('dragend', updateRoute);

        const address = await getAddress(lat, lng);
        setAddress(address);
        setDialogFields(parseAddress(address));
      } else if (!endMarkerRef.current) {
        endMarkerRef.current = L.marker([lat, lng], { icon: defaultIcon, draggable: true })
          .addTo(map)
          .bindPopup('Destino')
          .openPopup();
        endMarkerRef.current.on('dragend', updateRoute);

        const address = await getAddress(lat, lng);
        setFinalAddress(address);
        setDialogFinalFields(parseAddress(address));

        updateRoute(); // Update the route immediately after setting destination
      }
    });

    map.on('contextmenu', () => {
      if (startMarkerRef.current) {
        map.removeLayer(startMarkerRef.current);
        startMarkerRef.current = null;
        setAddress('');
        setDialogFields({
          street: '', city: '', state: '', neighborhood: '', houseNumber: '', country: '',
        });
      }
      if (endMarkerRef.current) {
        map.removeLayer(endMarkerRef.current);
        endMarkerRef.current = null;
        setFinalAddress('');
        setDialogFinalFields({
          street: '', city: '', state: '', neighborhood: '', houseNumber: '', country: '',
        });
      }
      setPricePredict(null);
      routingControl.setWaypoints([]);
    });

    return () => map.remove();
  }, [setAddress, setFinalAddress, setDialogFields, setDialogFinalFields, setPricePredict, updateRoute]);

  useEffect(() => {
    if (coordinates.origin && coordinates.destination) {
      const { origin, destination } = coordinates;
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints([
          L.latLng(origin.lat, origin.lng),
          L.latLng(destination.lat, destination.lng),
        ]);
      }

      if (startMarkerRef.current) {
        startMarkerRef.current.setLatLng([origin.lat, origin.lng]).bindPopup('Origem');
      }
      if (endMarkerRef.current) {
        endMarkerRef.current.setLatLng([destination.lat, destination.lng]).bindPopup('Destino');
      }
      updateRoute();
    }
  }, [coordinates, updateRoute]);

  const getAddress = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      return "Endereço não encontrado";
    }
  };

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default Map;
