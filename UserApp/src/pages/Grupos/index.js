/**
 * src/pages/Grupos/index.js
 */

import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';

import btn_ofertas from './images/ofertas.jpg';
import btn_sanduiches from './images/sanduiches.jpg';
import btn_hotdogs from './images/hotdogs.jpg';
import btn_bebidas from './images/bebidas.jpg';
import btn_pratosporcoes from './images/pratosporcoes.jpg';
import btn_sushi from './images/sushi.jpg';
import btn_frutasverduras from './images/frutasverduras.jpg';
import btn_medicamentos from './images/medicamentos.jpg';
import btn_gasdecozinha from './images/gasdecozinha.jpg';
import btn_floricultura from './images/floricultura.jpg';
import btn_aguamineral from './images/aguamineral.jpg';
import btn_mercado from './images/mercado.jpg';

export default function Home() { 
  const navigation = useNavigation();

  function LinkTo(page, p) {
    return (
      navigation.navigate(page, p)
    )
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header/>
        <View styles={styles.grupos}>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Ofertas</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 101, categoria: "OFERTAS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_ofertas}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Sanduiches</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 102, categoria: "SANDUICHES" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_sanduiches}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Hotdogs</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 103, categoria: "HOTDOGS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_hotdogs}/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Bebidas</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 104, categoria: "BEBIDAS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_bebidas}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Pratos & Porções</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 105, categoria: "PRATOS & PORÇÕES" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_pratosporcoes}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Sushi</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 106, categoria: "SUSHI" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_sushi}/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Frutas & Verduras</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 107, categoria: "FRUTAS & VERDURAS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_frutasverduras}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Medicamentos</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 108, categoria: "MEDICAMENTOS" })}>
                <Image style={[styles.item, {opacity: 0.3}]} source={btn_medicamentos}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Gás de Cozinha</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 109, categoria: "GÁS DE COZINHA" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_gasdecozinha}/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Floricultura</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 110, categoria: "FLORICULTURA" })}>
                <Image style={[styles.item, {opacity: 0.3}]} source={btn_floricultura}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Água Mineral</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 111, categoria: "ÁGUA MINERAL" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_aguamineral}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Mercado</Text>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 112, categoria: "MERCADO" })}>
                <Image style={[styles.item, {opacity: 0.3}]} source={btn_mercado}/>
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  background:{
    flex: 1,
    backgroundColor: '#000',
    color: '#FFF',
  },
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#000', // "#0003C3" ~BlueDelivery
    color: '#FFF',
  },
  grupos: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  linha:{
    flexDirection: 'row', 
    alignSelf: 'center',
  },
  item: {
    width: 119, 
    height: 116, 
    margin: 5, 
    backgroundColor: 'white', 
    borderRadius: 7,
    resizeMode: 'contain',
  },
  title:{ 
    color: '#FFF',
    fontSize: 12,
  },
  subtitle: {
    color: '#FFF',
    fontSize: 12,
  }
});  
