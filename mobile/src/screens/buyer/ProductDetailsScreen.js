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
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');


const fixImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400';
  if (url.startsWith('http://127.0.0.1')) {
    return url.replace('http://127.0.0.1:8000', 'http://192.168.1.7:8000');
  }
  return url;
};

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  const handleBuyNow = () => {
    const total_price = product.price * quantity;
    // Navigate directly to Checkout passing the product, selected quantity, and calculated total_price
    navigation.navigate('Checkout', { 
      product: product, 
      quantity: quantity,
      total_price: total_price
    });
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
            <View>
              <Text style={styles.category}>{product.category_name || 'Category'}</Text>
              <Text style={styles.title}>{product.name}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.price}>{product.price} DZD / unit</Text>
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
            <Text style={styles.liveTotalLabel}>Total Price</Text>
            <Text style={styles.liveTotalValue}>{(product.price * quantity).toFixed(2)} DZD</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValueColored}>{(product.price * quantity).toFixed(2)} DZD</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleBuyNow}>
          <Ionicons name="flash" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Buy Now</Text>
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
});
