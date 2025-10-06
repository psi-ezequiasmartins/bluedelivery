/**
* src/pages/Pedidos/OrderLiveUpdates.js
*/

import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { getCoordinatesFromAddress } from "../../components/gps/useGeolocation";

import api, { isDevelopment } from "../../config/apiAxios";

export default function OrderLiveUpdates({ pedido }) {
  const [ courier, setCourier ] = useState({});
  const [ delivery_coords, setDeliveryCoords ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  const courierId = 200001; 
  
  useEffect(() => {
    async function getOrder() {
      try {
        if (pedido?.DELIVERY_ENDERECO) {
          const coords = await getCoordinatesFromAddress(pedido.DELIVERY_ENDERECO);
          if (coords?.latitude && coords?.longitude) {
            if (isDevelopment) {
              console.log('Coordenadas do Delivery: ', coords);
            }
            setDeliveryCoords(coords);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    getOrder(); 
  }, [pedido]);

  useEffect(() => {
    async function getCourier() {
      try {
        // Simula dados do courier - pode ser implementado no futuro
        setCourier({
          COURIER_ID: courierId,
          NOME: 'Entregador',
          LATITUDE: -19.82628,
          LONGITUDE: -43.98033
        });
      } catch (error) {
        console.error('Erro ao buscar courier:', error);
        setCourier({}); // Define como objeto vazio em caso de erro
      } finally {
        setLoading(false);
      }
    }
    getCourier();
  }, []);

  if (loading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    )
  }

  // Debug das coordenadas - usando coordenadas de Belo Horizonte como fallback
  const latitude = pedido?.LATITUDE ? parseFloat(pedido.LATITUDE) : -19.9191;
  const longitude = pedido?.LONGITUDE ? parseFloat(pedido.LONGITUDE) : -43.9386;
  
  console.log('Coordenadas do mapa:', { latitude, longitude, pedido: pedido?.PEDIDO_ID, hasLatLng: !!pedido?.LATITUDE });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          📍 Pedido #{pedido?.PEDIDO_ID} - Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
        </Text>
      </View>
      
      <MapView
        style={styles.map}
        initialRegion={{    
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        }}
        showsUserLocation={true} 
        showsTraffic={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        mapType="standard"
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#FFFFFF"
        onMapReady={() => console.log('✅ Mapa carregado com sucesso!')}
        onRegionChange={(region) => console.log('Região do mapa mudou:', region)}
        onError={(error) => console.error('❌ Erro no mapa:', error)}
      >
        {/* Marcador do Cliente/Entrega */}
        {pedido?.LATITUDE && pedido?.LONGITUDE && (
          <Marker
            coordinate={{
              latitude: parseFloat(pedido.LATITUDE),
              longitude: parseFloat(pedido.LONGITUDE)
            }}
            title={`Pedido #${pedido?.PEDIDO_ID}`}
            description={`${pedido?.ENDERECO_ENTREGA || 'Endereço de entrega'}`}
          >
            <View style={styles.markerContainer}>
              <Fontisto name="home" size={24} color="white" />
            </View>
          </Marker>
        )}

        {/* Marcador do Delivery */}
        {delivery_coords?.latitude && delivery_coords?.longitude && (
          <Marker
            coordinate={{
              latitude: delivery_coords.latitude,
              longitude: delivery_coords.longitude,
            }}
            title={pedido?.DELIVERY_NOME || 'Estabelecimento'}
            description="Local do restaurante/loja"
          >
            <View style={[styles.markerContainer, { backgroundColor: '#4ECDC4' }]}>
              <Fontisto name="shopping-store" size={24} color="white" />
            </View>
          </Marker>
        )}

        {/* Marcador do Entregador (simulado) */}
        {courier?.COURIER_ID && (
          <Marker 
            coordinate={{ 
              latitude: courier.LATITUDE,
              longitude: courier.LONGITUDE,
            }}
            title={courier?.NOME || 'Entregador'}
            description="Localização atual do entregador"
          >
            <View style={[styles.markerContainer, { backgroundColor: '#FFE66D' }]}>
              <Fontisto name="motorcycle" size={24} color="black" />
            </View>
          </Marker>
        )}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  indicator: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16
  },
  debugInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  debugText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  markerContainer: { 
    backgroundColor: '#FF6B6B', 
    padding: 8, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});
