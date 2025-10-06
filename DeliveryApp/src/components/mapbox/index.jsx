import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZXplcXVpYXNtYXJ0aW5zIiwiYSI6ImNsMXBlanliYzB0OXozZG80ZDNyanphZXYifQ.IhuxJJfB--TGDczk-qcAWw';

export default function MapCard({ deliveryAddress, userAddress }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-43.93778, -19.92083], // Centro de Belo Horizonte
      zoom: 13,
    });

    const addMarker = (address, color) => {
      // Você pode usar um serviço de geocodificação para converter endereços em coordenadas
      // Aqui estamos usando coordenadas fixas como exemplo
      const [lng, lat] = [-43.93778, -19.92083]; // Substitua por coordenadas reais
      new mapboxgl.Marker({ color })
        .setLngLat([lng, lat])
        .addTo(map);
    };

    if (deliveryAddress) addMarker(deliveryAddress, 'red');
    if (userAddress) addMarker(userAddress, 'blue');

    return () => map.remove();
  }, [deliveryAddress, userAddress]);

  return (
    <div style={{ height: '400px', width: '300px', margin: '10px' }} ref={mapContainerRef} />
  );
};
