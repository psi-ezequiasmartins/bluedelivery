/**
* src/pages/Cesta/index.js
*/

import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { Fontisto } from '@expo/vector-icons';

import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { OrderContext } from '../../contexts/OrderContext';

import { useNavigation } from '@react-navigation/native';

import { getCurrentLocationStandalone } from '../../components/gps/useGeolocation';
import { AddressConfirmationModal } from '../../components/gps/AddressConfirmationDialog';
import { isDevelopment } from '../../config/apiAxios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BasketItem from '../../components/Basket';

export default function Cesta() {
  const { basket, delivery, AddToBasket, RemoveFromBasket, CleanBasket } = useContext(CartContext);
  const { pushToken } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const { createOrder } = useContext(OrderContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [subtotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [tempOrderData, setTempOrderData] = useState(null);  
  const [tempAddress, setTempAddress] = useState('');

  function formattedBasketItems(basketItems) {
    return basketItems.map((item) => ({
      PRODUTO_ID: item?.PRODUTO_ID,
      QTD: item?.QTD,
      VR_UNITARIO: item?.VR_UNITARIO,
      VR_ACRESCIMOS: item?.VR_ACRESCIMOS || 0,
      OBS: item?.OBS || '',
      ACRESCIMOS: item?.ACRESCIMOS || [],
      TOTAL: (parseFloat(item?.VR_ACRESCIMOS || 0) + parseFloat(item?.VR_UNITARIO || 0)) * parseInt(item?.QTD || 0)
    }));
  }

  function updateSubTotal() {
    let new_value = 0;
    basket.forEach((item) => {
      let items_total = parseFloat(item.VR_UNITARIO || 0);
      if (item.ACRESCIMOS) {
        item.ACRESCIMOS.forEach((extra) => {
          items_total += parseFloat(extra.VR_UNITARIO || 0);
        });
      }
      new_value += items_total * item.QTD; 
    });
    setSubTotal(new_value);
    
    // Corrigir taxa de entrega - garantir que não seja NaN
    const taxaEntrega = delivery?.TAXA_ENTREGA ? parseFloat(delivery.TAXA_ENTREGA) : 0;
    const soma = new_value + taxaEntrega;
    setTotal(soma);
  }

  useEffect(() => {
    updateSubTotal();
    if (basket.length === 0) {
      navigation.goBack();
    }
    
    // Debug: verificar se delivery está chegando
    if (isDevelopment) {
      console.log('Delivery na Cesta:', delivery);
      console.log('Basket na Cesta:', basket);
      console.log('Subtotal:', subtotal, 'Total:', total);
    }
  }, [basket, delivery, total, subtotal]);

  // Carregar endereço salvo ao abrir a tela
  useEffect(() => {
    (async () => {
      const savedAddress = await AsyncStorage.getItem('vEnderecoEntrega');
      if (savedAddress) {
        setTempAddress(savedAddress);
      }
    })();
  }, []);

  async function handleFinalizarPedido() {
    try {
      setLoading(true);
      let addressToUse = tempAddress;
      let locationData = null;

      // Sempre tentar GPS primeiro
      try {
        locationData = await getCurrentLocationStandalone();
        if (locationData?.address?.formatted) {
          addressToUse = locationData.address.formatted;
        }
      } catch (gpsError) {
        console.log('GPS falhou, usando fallback:', gpsError.message);
        // Usar fallback se GPS falhar
        const { getFallbackLocation } = require('../../components/gps/useGeolocation');
        locationData = await getFallbackLocation();
        if (!addressToUse || addressToUse.trim() === '') {
          addressToUse = locationData.address.formatted;
        }
      }

      // Se ainda não conseguiu obter nenhum endereço, usar padrão
      if (!addressToUse || addressToUse.trim() === '') {
        addressToUse = 'Digite seu endereço completo aqui';
      }

      // SEMPRE mostrar modal para confirmação/correção do endereço
      // (mesmo se GPS detectou localização)
      
      // Debug do delivery antes de criar tempOrder
      if (isDevelopment) {
        console.log('Delivery object completo:', delivery);
        console.log('DELIVERY_ID extraído:', delivery?.DELIVERY_ID || delivery?.id);
      }

      // Preparar dados temporários para o pedido
      const tempOrder = {
        DELIVERY_ID: delivery?.DELIVERY_ID,
        USER_ID: user?.USER_ID,
        VR_SUBTOTAL: subtotal,
        TAXA_ENTREGA: delivery?.TAXA_ENTREGA,
        VR_TOTAL: total,
        PUSH_TOKEN: pushToken,
        STATUS: "NOVO",
        LATITUDE: locationData?.location?.latitude,
        LONGITUDE: locationData?.location?.longitude,
        ITENS: formattedBasketItems(basket),
        TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
        CREATED_AT: new Date().toISOString()
      };

      // Debug do tempOrder criado
      if (isDevelopment) {
        console.log('tempOrder criado:', tempOrder);
      }

      setTempOrderData(tempOrder);
      setTempAddress(addressToUse);
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      Alert.alert('Erro', 'Não foi possível criar o pedido');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmAddress(confirmedAddress) {
    try {
      setLoading(true);
      setShowModal(false);

      await AsyncStorage.setItem('vEnderecoEntrega', confirmedAddress);

      let latitude = tempOrderData?.LATITUDE;
      let longitude = tempOrderData?.LONGITUDE;
      if (!latitude || !longitude) {
        try {
          const { getCoordinatesFromAddress } = require('../../components/gps/useGeolocation');
          const coords = await getCoordinatesFromAddress(confirmedAddress);
          latitude = coords?.latitude;
          longitude = coords?.longitude;
        } catch (err) {
          console.error('Erro ao obter coordenadas do endereço:', err);
        }
      }

      // Adiciona deliveryId, timezone e createdAt
      const finalOrder = {
        ...tempOrderData,
        DELIVERY_ID: tempOrderData?.DELIVERY_ID || delivery?.DELIVERY_ID,
        ENDERECO_ENTREGA: confirmedAddress,
        LATITUDE: latitude,
        LONGITUDE: longitude,
        TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
        CREATED_AT: new Date().toISOString()
      };

      // Debug do pedido final antes da validação
      if (isDevelopment) {
        console.log('Pedido final completo:', finalOrder);
        console.log('ITENS formatados:', finalOrder.ITENS);
        console.log('Delivery usado:', delivery);
      }

      const requiredFields = [
        'DELIVERY_ID', 'USER_ID', 'VR_SUBTOTAL', 'TAXA_ENTREGA', 'VR_TOTAL', 'PUSH_TOKEN', 'ENDERECO_ENTREGA', 'LATITUDE', 'LONGITUDE', 'ITENS'
      ];
      for (const field of requiredFields) {
        const value = finalOrder[field];
        const isEmpty = value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
        
        if (isEmpty) {
          console.error(`Campo ausente: ${field} = ${value}`);
          Alert.alert('Erro', `Campo obrigatório ausente ou inválido: ${field}\nValor: ${value}`);
          setLoading(false);
          return;
        }
      }

      if (isDevelopment) {
        console.log('Pedido final enviado:', finalOrder);
      }

      const response = await createOrder(finalOrder);

      if (response) {
        await AsyncStorage.removeItem('vEnderecoEntrega');
        await CleanBasket();
        Alert.alert('Sucesso', `Pedido enviado com sucesso!\nNúmero do Pedido: #${response.PEDIDO_ID}`);
        navigation.navigate('OrdersTab', {
          screen: 'OrdersStack',
          params: { orderId: response.PEDIDO_ID }
        });
      } else {
        Alert.alert('Erro', 'Não foi possível criar o pedido');
      }

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      Alert.alert('Erro', 'Não foi possível criar o pedido');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelarPedido() {
    await CleanBasket();
    navigation.goBack();
  }

  {loading && (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={styles.loadingText}>Processando pedido...</Text>
    </View>
  )}

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} focusable={true} >
        { basket.length === 0 && <Text style={styles.empty}>Cesta de Compras vazia!</Text> }

        { basket.length > 0 && <>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column', width: '100%'}}>
                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>{delivery?.DELIVERY_NOME || 'Delivery não selecionado'}</Text>
                <Text style={{ fontSize: 13}}>{delivery?.HORARIO || 'Horário não informado'}</Text>
                <Text style={{ fontSize: 13}}><Fontisto color="#FF0000" name='map-marker-alt' size={18}/> {delivery?.ENDERECO ? `${delivery?.ENDERECO}, ${delivery?.NUMERO} - ${delivery?.BAIRRO}` : 'Endereço não informado'}</Text>
                <Text style={{ fontSize: 13, marginBottom: 5}}>Valor da Taxa de Entrega: R$ {delivery?.TAXA_ENTREGA ? parseFloat(delivery.TAXA_ENTREGA).toFixed(2) : '0.00'}</Text>
                <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 19 }}>Seus Pedidos</Text>
              </View>
            </View>

            <FlatList
              data={basket}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item)=>String(item?.PRODUTO_ID)}
              renderItem={ ({item}) => (
                <BasketItem 
                  item={item} 
                  AddQtd={()=>AddToBasket(item, 1, item?.VR_UNITARIO, [], 0, '')} 
                  RemoveQtd={()=>RemoveFromBasket(item)}  
                  updateTotal={()=>updateSubTotal()}
                />
              )}
              ListEmptyComponent={()=><Text style={styles.empty}>Cesta de Compras vazia!</Text>}
              ListFooterComponent={()=>(
                <View>
                  <Text style={styles.subtotal}>+ Sub-Total: R$ {parseFloat(subtotal || 0).toFixed(2)}</Text>
                  <Text style={styles.taxa}>+ Taxa de Entrega: R$ {delivery?.TAXA_ENTREGA ? parseFloat(delivery.TAXA_ENTREGA).toFixed(2) : '0.00'}</Text>
                  <Text style={styles.total}>= Total: R$ {parseFloat(total || 0).toFixed(2)}</Text>
                </View>
              )}
            />

            <TouchableOpacity style={styles.btnGoBack} onPress={()=>navigation.goBack()}>
              <Text style={{color: '#000', fontSize: 18}}>CONTINUE COMPRANDO...</Text>
            </TouchableOpacity>
          </>
        }

        <TouchableOpacity style={styles.btnOk} onPress={handleFinalizarPedido}>
          <Text style={{color: '#FFF', fontSize: 18}}>FINALIZAR PEDIDO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnCancel} onPress={handleCancelarPedido}>
          <Text style={{color: '#FFF', fontSize: 18}}>CANCELAR</Text>
        </TouchableOpacity>

        <AddressConfirmationModal
          visible={showModal}
          address={tempAddress}
          onConfirm={handleConfirmAddress}
          onCancel={() => setShowModal(false)}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingStart: 14,
    paddingEnd: 14,
    paddingTop: 14,
  },
  content: {
    width: '98%',
    paddingHorizontal: 10,
  },
  card:{
    flex: 1,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 2,
    marginBottom: 10,
    padding: 10,
  },
  qtd:{
    width: 100, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 5
  },
  empty:{
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    color: "red",
    marginTop: 30,
    marginBottom: 30,
  },
  subtotal:{
    fontSize: 18,
  }, 
  acrescimo: {
    fontSize: 18,
  }, 
  taxa:{
    fontSize: 18,
  },
  total:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  areaInput:{
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },
  input:{
    flex: 1, 
    width: "98%",
    overflow: "scroll",
    textAlignVertical: "top", 
    height: 45,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#8CB8D2",
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 17,
    color: "#000",
  },
  btnGoBack: {
    width: '100%',
    height: 45,
    borderRadius: 7,
    backgroundColor: '#8CB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10
  },
  btnOk: {
    width: '100%',
    height: 45,
    borderRadius: 7,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  btnCancel: {
    width: '100%',
    height: 45,
    borderRadius: 7,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  imagem:{
    width: 75, 
    height: 75,
  },
  indicator: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16
  }
});