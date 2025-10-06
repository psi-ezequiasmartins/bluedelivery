/**
* src/contexts/OrderContext.js
*/

import React, { createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/apiAxios';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

export const OrderContext = createContext();

function localTimestamp() {
  return {
    iso: new Date().toISOString(),
    tzOffsetMinutes: new Date().getTimezoneOffset()
  };
}

export function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { delivery } = useContext(CartContext);
  const [pushToken, setPushToken] = useState(null);
  const [pedido, setPedido] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrdersByUserID() {
      await api.get(`/user-app/listar/pedidos/usuario/${user?.USER_ID}`).then((snapshot) => {
        setOrders(snapshot.data)
      });
    }
    loadOrdersByUserID();
    (async () => {
      const token = await AsyncStorage.getItem('vPushToken');
      setPushToken(token);
    })();
  }, [user, pedido]);

  async function createOrder(orderData) {
    // Buscar DELIVERY_ID - sempre deve ser DELIVERY_ID em maiúsculas
    const deliveryId = orderData?.DELIVERY_ID || delivery?.DELIVERY_ID;
    
    if (!deliveryId) {
      console.error('DELIVERY_ID não encontrado em:', { orderData, delivery });
      throw new Error('DELIVERY_ID ausente');
    }       
    
    const completeOrderData = {
      ...orderData,
      DELIVERY_ID: deliveryId,
      USER_ID: orderData?.USER_ID || user?.USER_ID,
      PUSH_TOKEN: orderData?.PUSH_TOKEN || pushToken,
      CREATED_AT: orderData?.CREATED_AT || localTimestamp(),
      UPDATED_AT: localTimestamp()
    };
  
    console.log('OrderContext - Dados completos do pedido:', completeOrderData);
    
    const response = await api.post('/user-app/add/pedido', completeOrderData);
    if (response.status === 200 || response.status === 201) {
      setPedido(response.data);
      setOrders(prevOrders => [...prevOrders, response.data]);
      return response.data;
    } else {
      throw new Error('Erro ao criar pedido: ' + (response.data?.message || 'Resposta inesperada do servidor'));
    }
  }

  async function getOrder(id) {
    await api.get(`/api/pedido/${id}`).then((response) => {
      setPedido(response.data[0]);
    }).catch((error) => {
      console.error('Pedido não encontrado! ', error.message);
    });
    return { ...pedido, dishes: pedido.itens }; 
  };

  return (
    <OrderContext.Provider value={{ delivery, orders, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
