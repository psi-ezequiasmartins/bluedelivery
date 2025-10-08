/**
* src/pages/Pedidos/index.js 
* Blue Delivery - Página de pedidos com i18n
*/

import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContext";

import Header from '../../components/Header';
import OrderListItem from './OrderListItem';

import api from "../../config/apiAxios";

export default function Pedidos() {
  const { t } = useTranslation();
  const [pedidos, setPedidos] = useState([]);

  const { user } = useContext(AuthContext);
  const { notify, setNotify } = useContext(NotificationContext);

  const listRef = useRef(null);
  const id = user?.USER_ID;

  async function loadPedidos() {
    try {
      const response = await api.get(`/user-app/listar/pedidos/usuario/${id}`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  }

  useEffect(() => {
    loadPedidos();
  }, [id]);

  useEffect(() => {
    if (notify) {
      loadPedidos();
      setNotify(false);
    }
  }, [notify, setNotify]);

  async function moveToTop() {
    await listRef.current.scrollToOffset({ offset: 0, animated: true })
  }

  async function moveToDown() {
    await listRef.current.scrollToEnd({ animated: true })
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <Header />
      <View style={styles.subheader}>
        <Text style={styles.title}>{t('orders.title').toUpperCase()}</Text>
        <View style={{ flexDirection: "row", width: "25%" }}>
          <TouchableOpacity onPress={moveToTop}>
            <MaterialCommunityIcons name='arrow-up' size={50} color={'#4DCE4D'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={moveToDown}>
            <MaterialCommunityIcons name='arrow-down' size={50} color={'#FF0000'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={pedidos}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={() => <Text style={styles.empty}>{t('orders.empty')}</Text>}
          keyExtractor={(item) => String(item?.PEDIDO_ID)}
          renderItem={({ item }) => <OrderListItem order={item} />}
          ref={listRef}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10
  },
  subtitle: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold'
  },
  empty: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    color: "red",
    marginTop: 30,
    marginBottom: 30,
  }
})

//}, [id, notify]); // se notify = true, atualiza a lista de pedidos com seus status atualizados.
