/**
 * src/components/gps/useGeolocation.js
 */

import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

export async function ensureLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  console.log('Status da permissão de localização:', status);
  if (status !== 'granted') {
    throw new Error('Permissão de localização negada');
  }
}

export async function getCurrentLocationStandalone() {
  try {
    console.log('Iniciando obtenção de localização...');
    await ensureLocationPermission();
    
    console.log('Obtendo posição GPS...');
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 15000
    });
    
    console.log('Localização obtida:', currentLocation.coords);

    let formatted = null;
    try {
      console.log('Fazendo reverse geocoding...');
      const results = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      console.log('Resultados do reverse geocoding:', results);
      if (results?.length) {
        const a = results[0];
        formatted = [
          a.street || a.name,
          a.streetNumber,
          a.district || a.subregion,
          a.city || a.region,
          a.postalCode
        ].filter(Boolean).join(', ');
      }
    } catch (reverseError) { 
      console.error('Erro no reverse geocoding:', reverseError);
    }

    console.log('Endereço formatado:', formatted);
    
    // Retornar no formato esperado pela Cesta
    return {
      location: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      },
      address: {
        formatted: formatted || 'Endereço não identificado via GPS'
      }
    };
  } catch (error) {
    console.error('Erro ao obter localização atual:', error);
    throw error;
  }
}

// Função alternativa para usar coordenadas fixas em caso de erro
export async function getFallbackLocation() {
  console.log('Usando localização de fallback (Belo Horizonte)');
  return {
    location: {
      latitude: -19.82726,
      longitude: -43.98311
    },
    address: {
      formatted: 'Belo Horizonte, MG - Localização aproximada'
    }
  };
}

/**
 * Converte um endereço em coordenadas geográficas
 * @param {string} address Endereço completo
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function getCoordinatesFromAddress(address) {
  if (!address) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    console.warn('Geocode sem resultados:', data.status);
    return null;
  } catch (error) {
    console.error('Erro no geocode:', error.message);
    return null;
  }
}
