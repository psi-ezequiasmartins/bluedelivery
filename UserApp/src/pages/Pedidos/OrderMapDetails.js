import React from 'react';
import { View, ActivityIndicator, Text, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useMapState } from '../../hooks/useMapState';

export default function OrderMapDetails({ pedido }) {

  console.log(pedido);

  const { width, height } = Dimensions.get('window');
  const {
    loading,
    error,
    mapReady,
    coordinates,
    initialRegion,
    onMapReady,
    onMapError
  } = useMapState(pedido);

  if (loading && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          Carregando localização...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>📍 Localização</Text>
        <Text style={styles.errorAddress}>
          {pedido?.endereco || 'Endereço não disponível'}
        </Text>
        <Text style={styles.errorCoords}>
          Coordenadas: {coordinates.latitude}, {coordinates.longitude}
        </Text>
        <Text style={styles.errorMessage}>
          Não foi possível carregar o mapa. Verifique sua conexão.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        // style={[styles.map, { width, height: height - 250 }]}
        initialRegion={initialRegion}
        onMapReady={onMapReady}
        onError={onMapError}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        scrollEnabled={true}
        loadingEnabled={true}
        loadingIndicatorColor="#007AFF"
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={false}
        style={styles.map}
      >
        {/* Marker do Usuário */}
        <Marker
          coordinate={coordinates}
          title={`${username}` || 'Cliente'}
          description={`Pedido #${pedido?.PEDIDO_ID}`}
        >
          <View style={styles.markerContainer}>
            <View style={[styles.markerCircle, { backgroundColor: '#4285f4' }]}>
              <Text style={styles.markerText}>U</Text>
            </View>
          </View>
        </Marker>

        {/* Marker do Delivery/Estabelecimento */}
        {pedido?.deliveryLat && pedido?.deliveryLng && (
          <Marker
            coordinate={{
              latitude: parseFloat(pedido.deliveryLat),
              longitude: parseFloat(pedido.deliveryLng)
            }}
            title={`${pedido?.DELIVERY_NOME}` || 'Delivery'}
            description={`${pedido?.DELIVERY_ENDERECO}` || 'Endereço não informado'}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerCircle, { backgroundColor: '#ff4444' }]}>
                <Text style={styles.markerText}>D</Text>
              </View>
            </View>
          </Marker>
        )}

        {/* Marker do Courier/Entregador */}
        {pedido?.courierLat && pedido?.courierLng && (
          <Marker
            coordinate={{
              latitude: parseFloat(pedido.courierLat),
              longitude: parseFloat(pedido.courierLng)
            }}
            title={`${pedido?.COURIER_NOME}` || 'Courier'}
            description="Seu pedido está a caminho..."
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerCircle, { backgroundColor: '#00cc44' }]}>
                <Text style={styles.markerText}>C</Text>
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📍 Pedido #{pedido?.numero} - Lat: {coordinates.latitude} | Lng: {coordinates.longitude}
        </Text>
      </View>

      {pedido?.endereco && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Endereço de Entrega:</Text>
          <Text style={styles.infoText}>{pedido.endereco}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorAddress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorCoords: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
