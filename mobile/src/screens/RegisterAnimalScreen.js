import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { registerAnimal } from '../api';

export default function RegisterAnimalScreen({ navigation }) {
  const [formData, setFormData] = useState({
    rfid_tag: '',
    internal_id: '',
    species: 'Cow',
    breed: '',
    region: '',
    birth_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });
  const [loading, setLoading] = useState(false);

  const speciesOptions = ['Cow', 'Sheep', 'Goat'];

  const handleRegister = async () => {
    if (!formData.rfid_tag || !formData.internal_id || !formData.breed || !formData.birth_date) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await registerAnimal(formData);
      Alert.alert('Success', 'Animal registered successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register animal. Check RFID uniqueness.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.onBackground} />
          </TouchableOpacity>
          <Text style={styles.title}>Register New Animal</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>RFID Tag</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="barcode-outline" size={20} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: RF-123456"
                value={formData.rfid_tag}
                onChangeText={(text) => setFormData({ ...formData, rfid_tag: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Internal ID / Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={20} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Daisy / C-01"
                value={formData.internal_id}
                onChangeText={(text) => setFormData({ ...formData, internal_id: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Species</Text>
            <View style={styles.speciesContainer}>
              {speciesOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.speciesOption,
                    formData.species === opt && styles.speciesSelected
                  ]}
                  onPress={() => setFormData({ ...formData, species: opt })}
                >
                  <Text style={[
                    styles.speciesOptionText,
                    formData.species === opt && styles.speciesSelectedText
                  ]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Breed</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="list-outline" size={20} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Holstein"
                value={formData.breed}
                onChangeText={(text) => setFormData({ ...formData, breed: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Region (Wilaya)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="map-outline" size={20} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Algiers"
                value={formData.region}
                onChangeText={(text) => setFormData({ ...formData, region: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Date (YYYY-MM-DD)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="2024-01-01"
                value={formData.birth_date}
                onChangeText={(text) => setFormData({ ...formData, birth_date: text })}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Register Animal</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onBackground,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onBackground,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: Colors.onSurface,
  },
  speciesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  speciesOption: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  speciesSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  speciesOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.outline,
  },
  speciesSelectedText: {
    color: '#FFF',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
