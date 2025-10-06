/**
 * App.js
 * eas build --platform android --profile preview
 */

import 'react-native-gesture-handler';

import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { OrderProvider } from './src/contexts/OrderContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true); // Ignora todos os logs de aviso

import api from './src/config/apiAxios'; // Importa a configuração do Axios
import Routes from './src/routes';

export default function App() {
  useEffect(() => {
    async function checkConnectivity() {
      const isConnected = await api.ping(); 
      if (!isConnected) {
        console.warn('Servidor offline ou inacessível.');
      }
    }
    checkConnectivity(); 
  }, []); 

  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <NotificationProvider>
              <StatusBar backgroundColor='#FCC000' barStyle='dark-content'  />
              <Routes />
            </NotificationProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
