import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const Map = ({ coordinates, setAddress, setFinalAddress, setDialogFields, setDialogFinalFields  }) => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null); // Ref para persistir o controle de roteamento
  const startMarkerRef = useRef(null);    // Ref para o marcador de origem
  const endMarkerRef = useRef(null);      // Ref para o marcador de destino


  const parseAddress = (address) => {
    const addressParts = address.split(', ');
    let ad = {
      street: addressParts[0] || '',
      neighborhood: addressParts[1] || '',
      city: addressParts[2] || '',
      state: addressParts[3] || '',
      country: addressParts[4] || '',
    };

    // Exemplo de como exibir o resultado
    return ad;
  };

  useEffect(() => {
    // Definir o ícone personalizado para os marcadores
    const defaultIcon = L.icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Inicializar o mapa apenas uma vez
    const map = L.map(mapRef.current).setView([51.505, -0.09], 5);

    // Adicionar a camada de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Inicializar o controle de roteamento
    const routingControl = L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4 }],
      },
      createMarker: () => null, // Remover marcadores padrão
      router: L.Routing.osrmv1({ suppressWaypoints: true }),
      show: false,
      addWaypoints: false,
    }).addTo(map);

    routingControlRef.current = routingControl; // Armazenar o routingControl no ref

    // Remover o painel de roteamento manualmente
    const pane = document.querySelector('.leaflet-routing-container');
    if (pane) pane.style.display = 'none';

    // Evento de clique no mapa
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (!startMarkerRef.current) {
        startMarkerRef.current = L.marker([lat, lng], { icon: defaultIcon, draggable: true })
          .addTo(map)
          .bindPopup('Origem')
          .openPopup();
        startMarkerRef.current.on('dragend', updateRoute);
        
        // Pegar o endereço ao clicar no mapa
        const address = await getAddress(lat, lng);
        console.log(`Origem: ${address}`);
        setAddress(address);

        const addressParts = parseAddress(address);
        setDialogFields(addressParts);
        
  
        
      } else if (!endMarkerRef.current) {
        endMarkerRef.current = L.marker([lat, lng], { icon: defaultIcon, draggable: true })
          .addTo(map)
          .bindPopup('Destino')
          .openPopup();
        endMarkerRef.current.on('dragend', updateRoute);
        
        // Pegar o endereço ao clicar no mapa
        const address = await getAddress(lat, lng);
        console.log(`Destino: ${address}`);
        setFinalAddress(address);
        const addressParts = parseAddress(address);
        setDialogFinalFields(addressParts);
        
        updateRoute();
      }
    });

    // Resetar os marcadores ao clicar com o botão direito
    map.on('contextmenu', () => {
      if (startMarkerRef.current) {
        map.removeLayer(startMarkerRef.current);
        startMarkerRef.current = null;
        setAddress('');
      }
      if (endMarkerRef.current) {
        map.removeLayer(endMarkerRef.current);
        endMarkerRef.current = null;
        setFinalAddress('');
      }
      routingControl.setWaypoints([]);
    });

    // Cleanup do mapa
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (coordinates.origin && coordinates.destination) {
      const { origin, destination } = coordinates;

      // Verificar se o controle de roteamento e os marcadores existem
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints([
          L.latLng(origin.lat, origin.lng),
          L.latLng(destination.lat, destination.lng),
        ]);
      }

      if (startMarkerRef.current) {
        startMarkerRef.current.setLatLng([origin.lat, origin.lng]);
        startMarkerRef.current.bindPopup('Origem');
      }

      if (endMarkerRef.current) {
        endMarkerRef.current.setLatLng([destination.lat, destination.lng]);
        endMarkerRef.current.bindPopup('Destino');
      }
    }
  }, [coordinates]);

  // Função para atualizar a rota quando os marcadores são arrastados
  const updateRoute = () => {
    if (startMarkerRef.current && endMarkerRef.current) {
      const waypoints = [startMarkerRef.current.getLatLng(), endMarkerRef.current.getLatLng()];
      routingControlRef.current.setWaypoints(waypoints);

      const routeData = {
        latOrigin: waypoints[0].lat,
        lngOrigin: waypoints[0].lng,
        latDest: waypoints[1].lat,
        lngDest: waypoints[1].lng,
      };
      console.log(routeData);
    }
  };

  // Função para obter o endereço com base na latitude e longitude usando o Nominatim
  const getAddress = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.display_name; // Retorna o endereço completo
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      return "Endereço não encontrado";
    }
  };

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default Map;
