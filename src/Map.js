import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Define o ícone padrão
    const defaultIcon = L.icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Inicializa o mapa
    const map = L.map(mapRef.current).setView([51.505, -0.09], 5);

    // Adiciona a camada de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Inicializa o controle de roteamento
    const routingControl = L.Routing.control({
      waypoints: [], // Começa sem waypoints
      routeWhileDragging: true, // Permite arrastar a rota
    }).addTo(map);

    // Variáveis para armazenar os marcadores de origem e destino
    let startMarker = null;
    let endMarker = null;

    // Função para limpar um marcador do mapa
    const clearMarker = (marker) => {
      if (marker) map.removeLayer(marker);
    };

    // Atualiza os waypoints no controle de rota
    const updateRoute = () => {
      if (startMarker && endMarker) {
        routingControl.setWaypoints([
          startMarker.getLatLng(),
          endMarker.getLatLng(),
        ]);
      }
    };

    // Define os eventos de clique no mapa
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      if (!startMarker) {
        // Adiciona o marcador de origem com o ícone padrão
        startMarker = L.marker([lat, lng], { icon: defaultIcon, draggable: true }).addTo(map)
          .bindPopup('Origem')
          .openPopup();

        startMarker.on('dragend', updateRoute);
      } else if (!endMarker) {
        // Adiciona o marcador de destino com o ícone padrão
        endMarker = L.marker([lat, lng], { icon: defaultIcon, draggable: true }).addTo(map)
          .bindPopup('Destino')
          .openPopup();

        endMarker.on('dragend', updateRoute);

        updateRoute();
      }
    });

    // Sincroniza os marcadores com os waypoints
    routingControl.on('waypointschanged', () => {
      clearMarker(startMarker);
      clearMarker(endMarker);

      const waypoints = routingControl.getWaypoints();
      if (waypoints[0].latLng) {
        startMarker = L.marker(waypoints[0].latLng, { icon: defaultIcon, draggable: true }).addTo(map)
          .bindPopup('Origem');
        startMarker.on('dragend', updateRoute);
      }

      if (waypoints[1].latLng) {
        endMarker = L.marker(waypoints[1].latLng, { icon: defaultIcon, draggable: true }).addTo(map)
          .bindPopup('Destino');
        endMarker.on('dragend', updateRoute);
      }
    });

    // Reseta os marcadores ao clicar com o botão direito
    map.on('contextmenu', () => {
      clearMarker(startMarker);
      clearMarker(endMarker);
      startMarker = null;
      endMarker = null;
      routingControl.setWaypoints([]);
    });

    return () => map.remove(); // Cleanup do mapa
  }, []);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default Map;
