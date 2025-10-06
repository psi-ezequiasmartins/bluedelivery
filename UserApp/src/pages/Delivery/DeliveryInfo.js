/**
 * DeliveryInfo.js
 */

import { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { CartContext } from '../../contexts/CartContext';

import Header from '../../components/Header';
import api, { isDevelopment } from '../../config/apiAxios';

import DeliveryHeader from './DeliveryHeader';
import DeliveryItemToSelect from './DeliveryItemToSelect';
import DeliveryListItem from './DeliveryListItem';

export default function DeliveryInfo({ route }) {
  const [ delivery, setDelivery ] = useState(null);
  const [ show, showModal ] = useState(false);
  const [ produto, setProduto ] = useState({});
  const [ listadeprodutos, setListaDeProdutos ] = useState([]);
  const [ isAscending, setIsAscending ] = useState(true);
  const [ loading, setLoading ] = useState(false);

  const id = route.params?.id; 
  const { setDelivery: setBasketDelivery } = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/delivery/${id}`).then((response) => {
        let deliveryInfo = {
          "DELIVERY_ID": response.data.DELIVERY_ID,
          "DELIVERY_NOME": response.data.DELIVERY_NOME,
          "HORARIO": response.data.HORARIO,
          "MIN_DELIVERY_TIME": response.data.MIN_DELIVERY_TIME,
          "MAX_DELIVERY_TIME": response.data.MAX_DELIVERY_TIME,
          "TAXA_ENTREGA": response.data.TAXA_ENTREGA,
          "TELEFONE": response.data.TELEFONE,
          "ENDERECO": response.data.ENDERECO,
          "NUMERO": response.data.NUMERO,
          "BAIRRO": response.data.BAIRRO,
          "URL_IMAGEM": response.data.URL_IMAGEM,
        }
        setDelivery(deliveryInfo);
        // Definir no contexto imediatamente após carregar
        setBasketDelivery(deliveryInfo);
        
        if (isDevelopment) {
          console.log('Delivery carregado e definido no contexto:', deliveryInfo);
        }
      }),
      api.get(`/user-app/listar/produtos/delivery/${id}`).then((response) => {
        setListaDeProdutos(response.data);
      })
    ])
    .catch(error => {
      if (isDevelopment) {
        console.log('ERROR: ' + error.message);
      }
    })
    .finally(() => setLoading(false));
  }, [id]);

  // useEffect removido - agora setBasketDelivery é chamado diretamente após carregar os dados

  function listByAZ() {
    const listaordenada = [...listadeprodutos].sort((a, b) => (
      isAscending ? a.PRODUTO_NOME.localeCompare(b.PRODUTO_NOME) : b.PRODUTO_NOME.localeCompare(a.PRODUTO_NOME)
    ));
    setListaDeProdutos(listaordenada);
    setIsAscending(!isAscending);
  }

  async function handleSelectItem(item) {
    setProduto(item);
    showModal(true);
  }

  async function handleCloseModal() {
    showModal(false);
  }

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
      }}>
        <ActivityIndicator size={80} color="#FF0000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Modal animationType="slide" transparent={true} visible={show} >
          <DeliveryItemToSelect produto={produto} id={route.params.id} close={()=>handleCloseModal()} />
        </Modal>
        <Header />
        <FlatList
          data={listadeprodutos}
          ListHeaderComponent={()=><DeliveryHeader delivery={delivery} listbyaz={()=>listByAZ()} /> }
          ListEmptyComponent={()=><Text style={styles.empty}>Ainda não há produtos deste Delivery.</Text>}
          keyExtractor={(item)=>item.PRODUTO_ID}
          renderItem={({item})=><DeliveryListItem item={item} selectItem={()=>handleSelectItem(item)} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", //"#0003C3" ~BlueDelivery
    color: "#FFF",
  },
  empty: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10
  },
  flatlist: {
    flex: 1,
  },
  button: {
    backgroundColor: "black",
    margin: 10,
    padding: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
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
});
