/* 
* src/pages/Pedidos/OrderPayment.js
*/

import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

import api from "../../config/mysql";

export default function OrderPayment({ id }) {
  const [ pedido, setPedido ] = useState(null);
  const order_id = id;

  useEffect(() => {
    async function getOrder() {
      await api.get(`/pedido/${order_id}`).then((response) => {
        setPedido(response.data);
        console.log(pedido);
      })
    }
    getOrder();
  }, [order_id]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>MEIOS DE PAGAMENTO</Text>
        <Text>{" "}</Text>
        <Text style={{fontSize: 13, fontWeight: "bold" }}>Pedido nº {id}</Text>
        <Text style={{fontSize: 13}}>{pedido?.Data}</Text>
        <Text style={{fontSize: 13}}>
          R$ {parseFloat(pedido?.VrSubTotal).toFixed(2)} + R$ {parseFloat(pedido?.TaxaEntrega).toFixed(2)} = R$ {parseFloat(pedido?.VrTotal).toFixed(2)}
        </Text>
        <Text>{" "}</Text>
        <Text>(Página em Construção)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  subtitle:{
    color: '#000',
    textAlign: "center",
    fontSize: 15,
  },
})
