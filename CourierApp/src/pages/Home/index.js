/**
* src/pages/Cesta/index.js
*/

import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
// import api from '../../config/mysql';

export default function Home() {
  const navigation = useNavigation();
  // const [deliveries, setDeliveries] = useState(null);

  // useEffect(() => {
  //   async function loadDeliveries() {
  //     await api.get('/listar/deliveries').then((response) => {
  //       setDeliveries(response.data);
  //     });
  //   }
  //   loadDeliveries();
  // }, []);

  function LinkTo(page, p) {
    return (
      navigation.navigate(page, p)
    )
  }

  // if (!deliveries) {
  //   return (
  //     <View style={styles.indicator}>
  //       <ActivityIndicator size="large" color="#145E7D" />
  //     </View>
  //   )
  // }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header />
        <Text style={styles.title}>MAPA DE COLETAS</Text>
        {/** listagem de pedidos com status "PRONTO PARA RETIRADA" c/ link para exibição no Mapa */}
        {/* <FlatList
          data={deliveries}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item)=>String(item.DeliveryID)}
          renderItem={({item}) => (
            <View>
              <TouchableOpacity onPress={()=>LinkTo('Delivery', { id: item.DeliveryID ... })}>
                <View style={styles.card}>
                  <Image source={{ uri: item.UrlImagem }} style={styles.imagem} />
                  <Text style={styles.label}>{item.Descricao}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#FFF",
  },
  title:{
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1
  },
  card:{
    flex: 1,
    height: 115,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1
  },
  label:{
    fontSize: 21,
    fontWeight: 'bold'
  },
  imagem:{
    width: 100,
    height: 100,
    margin: 5
  },
  indicator:{
    flex:1, 
    position: 'absolute', 
    backgroundColor: '#000', 
    opacity: 0.7, 
    width: '100%', 
    height: '100%', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
})
