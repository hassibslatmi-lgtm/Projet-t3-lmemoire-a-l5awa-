import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../theme/colors';
import {
  getFarmerProducts,
  addFarmerProduct,
  updateFarmerProduct,
  getCategories,
  getOfficialProducts,
  fixImageUrl,
} from '../api';

export default function FarmerProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [officialProducts, setOfficialProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormState = {
    name: '',
    category: '',
    description: '',
    quantity: '',
    image: null,
    imageFile: null,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes, officialRes] = await Promise.all([
        getFarmerProducts(),
        getCategories(),
        getOfficialProducts(),
      ]);
      setProducts(prodRes || []);
      setCategories(catRes || []);
      setOfficialProducts(officialRes || []);
      if (catRes?.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: catRes[0].id }));
      }
    } catch (error) {
      console.error('Error fetching farmer products:', error);
      Alert.alert('Error', 'Failed to load data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const getPriceFromOfficialProduct = (productName) => {
    const op = officialProducts.find((o) => o.product_name === productName);
    return op ? op.price : '0.00';
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const handleOfficialProductSelect = (op) => {
    setFormData((prev) => ({
      ...prev,
      name: op.product_name,
      category: op.category || prev.category,
    }));
    setPickerModalVisible(false);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setFormData((prev) => ({
        ...prev,
        image: asset.uri,
        imageFile: { uri: asset.uri, name: 'photo.jpg', type: 'image/jpeg' },
      }));
    }
  };

  const handleAddNewClick = () => {
    setFormData({ ...initialFormState, category: categories[0]?.id || '' });
    setView('add');
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      quantity: product.quantity ? product.quantity.toString() : '',
      image: fixImageUrl(product.image),
      imageFile: null,
    });
    setView('edit');
  };

  const handleSaveOrUpdate = async () => {
    if (!formData.name || !formData.quantity) {
      Alert.alert('Validation Error', 'Please fill in product name and stock quantity.');
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('quantity', formData.quantity);
    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    try {
      if (view === 'edit' && editingProduct) {
        await updateFarmerProduct(editingProduct.id, data);
        Alert.alert('Success', 'Product updated successfully.');
      } else {
        await addFarmerProduct(data);
        Alert.alert('Success', 'Product added successfully.');
      }
      await fetchProducts();
      setView('list');
      setEditingProduct(null);
      setFormData(initialFormState);
    } catch (err) {
      console.error('Save failed:', err);
      Alert.alert('Error', 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: fixImageUrl(item.image) }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.categoryName}>{item.category_name || 'Agri Product'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {item.official_price && item.official_price !== 'N/A'
                ? `${item.official_price}`
                : item.price || 'Price Pending'} DZD
          </Text>
          <Text style={styles.unitText}>/ {item.unit || 'KG'}</Text>
        </View>
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>Stock: {item.quantity} {item.unit || 'KG'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => handleEditClick(item)}>
        <Ionicons name="create-outline" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderList = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.onBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddNewClick}>
          <Ionicons name="add" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={80} color="#E2E8F0" />
              <Text style={styles.emptyText}>No products listed yet.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddNewClick}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );

  const renderForm = () => (
    <SafeAreaView style={styles.formContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setView('list')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.onBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{view === 'add' ? 'Add New Product' : 'Edit Product'}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Information</Text>

          <Text style={styles.label}>Product Name</Text>
          <TouchableOpacity
            style={styles.pickerSelector}
            onPress={() => setPickerModalVisible(true)}
          >
            <Text style={[styles.pickerSelectorText, !formData.name && { color: '#94A3B8' }]}>
              {formData.name ? formData.name : 'Select Official Product'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#64748B" />
          </TouchableOpacity>

          <Text style={styles.label}>Category (Auto-selected)</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={{ color: '#64748B' }}>
              {formData.category ? getCategoryName(formData.category) : 'Auto-filled'}
            </Text>
          </View>
          {formData.name ? (
            <Text style={styles.helperText}>
              Base Price: {getPriceFromOfficialProduct(formData.name)} DZD/KG
            </Text>
          ) : null}

          <Text style={styles.label}>Stock Quantity (KG)</Text>
          <TextInput
            style={styles.input}
            value={formData.quantity}
            onChangeText={(val) => setFormData({ ...formData, quantity: val })}
            keyboardType="numeric"
            placeholder="e.g. 50"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(val) => setFormData({ ...formData, description: val })}
            placeholder="Describe product taste, origin, etc."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
            {formData.image ? (
              <Image source={{ uri: formData.image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="cloud-upload-outline" size={40} color={Colors.primary} />
                <Text style={styles.imagePlaceholderText}>Tap to upload photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSaveOrUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>
              {view === 'add' ? 'Publish Product' : 'Save Changes'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <>
      {view === 'list' ? renderList() : renderForm()}

      {/* Official Product Modal */}
      <Modal visible={pickerModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Official Product</Text>
              <TouchableOpacity onPress={() => setPickerModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={officialProducts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleOfficialProductSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.product_name}</Text>
                  <Text style={styles.modalItemPrice}>{item.price} DZD</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  addBtn: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  listContent: {
    padding: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
    gap: 4,
  },
  productName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  categoryName: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  unitText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 2,
  },
  stockBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 20,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  formScroll: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  disabledInput: {
    opacity: 0.7,
    justifyContent: 'center',
  },
  textArea: {
    minHeight: 100,
  },
  helperText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
    marginTop: 8,
  },
  pickerSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
  },
  pickerSelectorText: {
    fontSize: 16,
    color: '#1E293B',
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 150,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
  },
  modalItemText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  modalItemPrice: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
});
