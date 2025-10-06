import { useState, useEffect, useMemo } from 'react';

export function useMapState(pedido) {
  const [state, setState] = useState({
    loading: true,
    error: false,
    mapReady: false
  });

  const coordinates = useMemo(() => ({
    latitude: parseFloat(pedido?.latitude) || -19.827218,
    longitude: parseFloat(pedido?.longitude) || -43.983041,
  }), [pedido?.latitude, pedido?.longitude]);

  const initialRegion = useMemo(() => ({
    ...coordinates,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  }), [coordinates]);

  useEffect(() => {
    setState({
      loading: true,
      error: false,
      mapReady: false
    });

    const initTimer = setTimeout(() => {
      setState(prev => ({ ...prev, mapReady: true }));
    }, 300);

    const fallbackTimer = setTimeout(() => {
      setState(prev => {
        if (prev.loading) {
          return { ...prev, error: true, loading: false };
        }
        return prev;
      });
    }, 8000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(fallbackTimer);
    };
  }, [pedido?.PEDIDO_ID]);

  function onMapReady() {
    setState(prev => ({
      ...prev,
      loading: false,
      mapReady: true,
      error: false
    }));
  }

  function onMapError() {
    setState(prev => ({
      ...prev,
      error: true,
      loading: false
    }));
  }

  return {
    ...state,
    coordinates,
    initialRegion,
    onMapReady,
    onMapError,
    setState
  };
}