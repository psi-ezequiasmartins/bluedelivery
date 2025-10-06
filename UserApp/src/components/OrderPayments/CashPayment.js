/**
 * src/components/OrderPayments/CashPayment.js
 */

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Alert, 
  StyleSheet 
} from 'react-native';
import api from '../../config/apiAxios';

export default function OrderCashPayment({ orderId }) {
  const [loading, setLoading] = useState(false);
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    getPedidoData();
  }, [orderId]);

  async function getPedidoData() {
    setLoading(true);
    try {
      const orderResponse = await api.get(`/api/pedido/${orderId}`);
      setPedido(orderResponse.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do pedido');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmCashPayment() {
    try {
      setLoading(true);
      
      // Atualiza o status do pedido para aguardando pagamento
      const response = await api.put(`/user-app/update/status/pedido`, {
        orderId: orderId,
        status: 'AGUARDANDO_PAGAMENTO'
      });

      if (response.status === 200) {
        Alert.alert(
          'Pagamento Confirmado!', 
          `Pedido #${orderId} confirmado para pagamento em dinheiro.\n\nValor: R$ ${parseFloat(pedido?.VR_TOTAL || 0).toFixed(2)}\n\nO entregador cobrará na entrega.`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        throw new Error('Erro ao confirmar pagamento');
      }
      
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      Alert.alert('Erro', 'Não foi possível confirmar o pagamento em dinheiro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento ao Portador</Text>
      
      <View style={styles.orderInfoContainer}>
        <Text style={styles.orderInfo}>
          Pedido #{orderId}
        </Text>
        
        <Text style={styles.totalInfo}>
          Total a pagar: R$ {parseFloat(pedido?.VR_TOTAL || 0).toFixed(2)}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal:</Text>
            <Text style={styles.detailValue}>
              R$ {parseFloat(pedido?.VR_SUBTOTAL || 0).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Taxa de Entrega:</Text>
            <Text style={styles.detailValue}>
              R$ {parseFloat(pedido?.TAXA_ENTREGA || 0).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              R$ {parseFloat(pedido?.VR_TOTAL || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Como funciona:</Text>
        <Text style={styles.instruction}>
          • O pagamento será feito na entrega
        </Text>
        <Text style={styles.instruction}>
          • Tenha o valor exato ou troco disponível
        </Text>
        <Text style={styles.instruction}>
          • O entregador confirmará o recebimento
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, loading && styles.disabledButton]} 
        onPress={handleConfirmCashPayment}
        disabled={loading}
      >
        <Text style={styles.confirmButtonText}>
          {loading ? 'Confirmando...' : 'CONFIRMAR PAGAMENTO EM DINHEIRO'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  orderInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  orderInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  totalInfo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#28a745',
    marginBottom: 15,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  instructionsContainer: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  instruction: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});