import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { placeOrder } from '../../api';

export default function CheckoutScreen({ route, navigation }) {
  // We receive the single product, quantity, and total_price directly
  const { product, quantity, total_price } = route.params;
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = total_price || (product.price * quantity);

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      Alert.alert('Missing Info', 'Please provide a shipping address and phone number.');
      return;
    }

    setLoading(true);
    try {
      await placeOrder({
        product_id: product.id,
        quantity: quantity,
        address: address,
        phone: phone,
      });

      Alert.alert(
        'Order Placed!', 
        'Your order has been sent to transporters. You will be redirected to Chargily for payment.',
        [{ 
          text: 'Proceed to Payment', 
          onPress: () => {
            navigation.navigate('Main'); // Or 'Orders' tab
          }
        }]
      );
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Shipping Address"
            placeholderTextColor="#94A3B8"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact Phone Number"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {quantity}x {product.name}
            </Text>
            <Text style={styles.summaryPrice}>
              {totalAmount.toFixed(2)} DZD
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalAmount}>{totalAmount.toFixed(2)} DZD</Text>
          </View>
        </View>


        <View style={styles.paymentInfoBox}>
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <Text style={styles.paymentInfoText}>
            Secure payment powered by <Text style={{fontWeight: '800'}}>Chargily Pay</Text>
          </Text>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.payBtn, loading && styles.disabledBtn]} 
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.payBtnText}>Pay & Confirm Order</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 15,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryName: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
  },
  summaryPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  paymentInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  paymentInfoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#047857',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  payBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 10,
  },
  disabledBtn: {
    opacity: 0.7,
  },
});
