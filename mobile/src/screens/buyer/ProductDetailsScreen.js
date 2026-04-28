import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { placeOrder } from '../../api';

const { width } = Dimensions.get('window');

// IP fix utility (keeping it here as a backup, though it's also in API)
const fixImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400';
  const BASE_IP = '192.168.1.12';
  if (url.startsWith('http://127.0.0.1')) {
    return url.replace('http://127.0.0.1:8000', `http://${BASE_IP}:8000`);
  }
  if (url.startsWith('http://192.168.1.7')) {
    return url.replace('http://192.168.1.7:8000', `http://${BASE_IP}:8000`);
  }
  return url;
};

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  // Ensure price is a number
  const productPrice = parseFloat(product.price || product.official_price || 0);
  const totalPrice = (productPrice * quantity).toFixed(2);

  const handleConfirmOrder = async () => {
    setOrderLoading(true);
    try {
      // For this example, we'll use a placeholder address/phone 
      // or redirect to a screen that asks for them.
      // But the user asked for 'Buy Now' to call the endpoint after confirmation.
      // So let's assume we need to prompt for address or use a default.
      
      // Navigate to Checkout which already handles address/phone input
      setShowModal(false);
      navigation.navigate('Checkout', { 
        product: product, 
        quantity: quantity,
        total_price: parseFloat(totalPrice)
      });
    } catch (error) {
      console.error('Order error:', error);
      Alert.alert('Error', 'Failed to place order.');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Image Header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: fixImageUrl(product.image) }} style={styles.image} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{product.category_name || 'Category'}</Text>
              <Text style={styles.title}>{product.name}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.price}>{productPrice} DA</Text>
            </View>
          </View>

          <View style={styles.stockContainer}>
            <Ionicons name="cube-outline" size={20} color="#64748B" />
            <Text style={styles.stockText}>
              Available Stock: <Text style={styles.stockBold}>{product.quantity} units</Text>
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description || 'Fresh, high-quality agricultural product straight from the farm. Ideal for your business needs.'}
          </Text>

          {/* Quantity Selector */}
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={20} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.min(product.quantity, quantity + 1))}
            >
              <Ionicons name="add" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.liveTotalContainer}>
            <Text style={styles.liveTotalLabel}>Total Amount</Text>
            <Text style={styles.liveTotalValue}>{totalPrice} DA</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValueColored}>{totalPrice} DA</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="flash" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Product:</Text>
              <Text style={styles.summaryValue}>{product.name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Unit Price:</Text>
              <Text style={styles.summaryValue}>{productPrice} DA</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity:</Text>
              <Text style={styles.summaryValue}>{quantity}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelBold}>Total Amount:</Text>
              <Text style={styles.summaryValueBold}>{totalPrice} DA</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmBtn} 
                onPress={handleConfirmOrder}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  category: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    maxWidth: width * 0.6,
  },
  priceTag: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 25,
  },
  stockText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#475569',
  },
  stockBold: {
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#64748B',
    marginBottom: 30,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    alignSelf: 'flex-start',
    borderRadius: 15,
    padding: 5,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginHorizontal: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  totalLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  totalValueColored: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
  },
  liveTotalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  liveTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  liveTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  addToCartBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  summaryLabelBold: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },
  summaryValueBold: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmBtn: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
