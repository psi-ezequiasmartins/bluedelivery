/**
 * App.js
 * eas build --platform android --profile preview
 * Blue Delivery UserApp com sistema i18n
 */

import 'react-native-gesture-handler';

import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { OrderProvider } from './src/contexts/OrderContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { TranslateProvider } from './src/contexts/TranslateContext';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true); // Ignora todos os logs de aviso

import './src/i18n'; // Importa a configuração do i18n
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
      <TranslateProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <NotificationProvider>
                <StatusBar backgroundColor='#0033CC' barStyle='light-content' />
                <Routes />
              </NotificationProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </TranslateProvider>
    </NavigationContainer>
  );
}
