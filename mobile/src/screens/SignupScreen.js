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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import api from '../api';

const { width } = Dimensions.get('window');

const InputField = ({ icon, placeholder, value, onChangeText, keyboardType = 'default', secureTextEntry = false }) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={20} color={Colors.primary} style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      autoCorrect={false}
      cursorColor={Colors.primary}
      selectionColor={Colors.primary + '30'}
    />
  </View>
);

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('farmer'); 
  
  const [formData, setFormData] = useState({
    // Shared
    full_name: '', username: '', email: '', phone: '', address: '', sex: 'M', password: '',
    // Farmer Extra
    farmer_card: '', farm_location: '', farm_area: '',
    // Transporter Extra
    driver_license_number: '', license_type: '', license_expiry_date: '', vehicle_name: '',
    // Buyer Extra
    business_name: '', registre_commerce: '',
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateStep1 = () => {
    const { full_name, username, email, phone, address } = formData;
    if (!full_name || !username || !email || !phone || !address) {
      Alert.alert('Missing Fields', 'Please fill in all personal information.');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (role === 'transporter') {
      const { driver_license_number, license_type, vehicle_name, password } = formData;
      if (!driver_license_number || !license_type || !vehicle_name || !password) {
        Alert.alert('Missing Fields', 'Please complete the transporter details.');
        return;
      }
    } else {
      const { business_name, password } = formData;
      if (!business_name || !password) {
        Alert.alert('Missing Fields', 'Please complete the buyer details (Business Name is required).');
        return;
      }
    }

    setLoading(true);
    try {
      let extra_data = {};
      if (role === 'farmer') {
        extra_data = {
          farmer_card: formData.farmer_card,
          farm_location: formData.farm_location,
          farm_area: parseFloat(formData.farm_area) || 0,
        };
      } else if (role === 'transporter') {
        extra_data = {
          driver_license_number: formData.driver_license_number,
          license_type: formData.license_type,
          license_expiry_date: formData.license_expiry_date,
          vehicle_name: formData.vehicle_name,
        };
      } else {
        extra_data = {
          business_name: formData.business_name,
          registre_commerce: formData.registre_commerce,
        };
      }

      const payload = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        sex: formData.sex,
        password: formData.password,
        role: role,
        extra_data: extra_data
      };

      await api.post('/users/signup/', payload);
      
      Alert.alert(
        'Registration Successful', 
        'Your account has been created and is pending approval.',
        [{ text: 'Login Now', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Registration failed. Please check your details.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={40} color="#fff" />
            </View>
            <Text style={styles.brandName}>AgriGov</Text>
            <Text style={styles.tagline}>Join our network</Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: step === 1 ? '50%' : '100%' }]} />
          </View>

          {step === 1 ? (
            <View style={styles.stepContainer}>
              
              {/* Role Selector */}
              <View style={styles.roleContainer}>
                <TouchableOpacity 
                  style={[styles.roleBtn, role === 'farmer' && styles.roleBtnActive]}
                  onPress={() => setRole('farmer')}
                >
                  <Ionicons name="leaf" size={24} color={role === 'farmer' ? '#fff' : Colors.primary} />
                  <Text style={[styles.roleText, role === 'farmer' && styles.roleTextActive]}>Farmer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.roleBtn, role === 'buyer' && styles.roleBtnActive]}
                  onPress={() => setRole('buyer')}
                >
                  <Ionicons name="basket" size={24} color={role === 'buyer' ? '#fff' : Colors.primary} />
                  <Text style={[styles.roleText, role === 'buyer' && styles.roleTextActive]}>Buyer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.roleBtn, role === 'transporter' && styles.roleBtnActive]}
                  onPress={() => setRole('transporter')}
                >
                  <Ionicons name="bus" size={24} color={role === 'transporter' ? '#fff' : Colors.primary} />
                  <Text style={[styles.roleText, role === 'transporter' && styles.roleTextActive]}>Transporter</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.stepTitle}>Personal Details</Text>
              <Text style={styles.stepSubtitle}>Basic information for your profile</Text>

              <InputField icon="person-outline" placeholder="Full Name" value={formData.full_name} onChangeText={(v) => updateForm('full_name', v)} />
              <InputField icon="at-outline" placeholder="Username" value={formData.username} onChangeText={(v) => updateForm('username', v)} />
              <InputField icon="mail-outline" placeholder="Email Address" value={formData.email} onChangeText={(v) => updateForm('email', v)} keyboardType="email-address" />
              <InputField icon="call-outline" placeholder="Phone Number" value={formData.phone} onChangeText={(v) => updateForm('phone', v)} keyboardType="phone-pad" />
              <InputField icon="location-outline" placeholder="Residential Address" value={formData.address} onChangeText={(v) => updateForm('address', v)} />

              {/* Gender Selector */}
              <View style={styles.genderContainer}>
                <TouchableOpacity style={[styles.genderBtn, formData.sex === 'M' && styles.genderBtnActive]} onPress={() => updateForm('sex', 'M')}>
                  <Ionicons name="man-outline" size={20} color={formData.sex === 'M' ? '#fff' : Colors.primary} />
                  <Text style={[styles.genderText, formData.sex === 'M' && styles.genderTextActive]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.genderBtn, formData.sex === 'F' && styles.genderBtnActive]} onPress={() => updateForm('sex', 'F')}>
                  <Ionicons name="woman-outline" size={20} color={formData.sex === 'F' ? '#fff' : Colors.primary} />
                  <Text style={[styles.genderText, formData.sex === 'F' && styles.genderTextActive]}>Female</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={() => validateStep1() && setStep(2)}>
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.stepContainer}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={20} color={Colors.primary} />
                <Text style={styles.backText}>Back to Personal Info</Text>
              </TouchableOpacity>

              <Text style={styles.stepTitle}>
                {role === 'farmer' ? 'Farm Details' : role === 'buyer' ? 'Business Details' : 'Transporter Details'}
              </Text>
              <Text style={styles.stepSubtitle}>
                {role === 'farmer' ? 'Provide your agricultural credentials' : role === 'buyer' ? 'Provide your company info' : 'Provide your vehicle and license info'}
              </Text>

              {role === 'farmer' ? (
                <>
                  <InputField icon="card-outline" placeholder="Farmer Card Number" value={formData.farmer_card} onChangeText={(v) => updateForm('farmer_card', v)} />
                  <InputField icon="map-outline" placeholder="Farm Location" value={formData.farm_location} onChangeText={(v) => updateForm('farm_location', v)} />
                  <InputField icon="expand-outline" placeholder="Farm Area (Hectares)" value={formData.farm_area} onChangeText={(v) => updateForm('farm_area', v)} keyboardType="numeric" />
                </>
              ) : role === 'transporter' ? (
                <>
                  <InputField icon="id-card-outline" placeholder="License Number" value={formData.driver_license_number} onChangeText={(v) => updateForm('driver_license_number', v)} />
                  <InputField icon="ribbon-outline" placeholder="License Type (e.g., B, C, D)" value={formData.license_type} onChangeText={(v) => updateForm('license_type', v)} />
                  <InputField icon="calendar-outline" placeholder="Expiry Date (YYYY-MM-DD)" value={formData.license_expiry_date} onChangeText={(v) => updateForm('license_expiry_date', v)} />
                  <InputField icon="car-outline" placeholder="Vehicle Name / Model" value={formData.vehicle_name} onChangeText={(v) => updateForm('vehicle_name', v)} />
                </>
              ) : (
                <>
                  <InputField icon="business-outline" placeholder="Business Name" value={formData.business_name} onChangeText={(v) => updateForm('business_name', v)} />
                  <InputField icon="document-text-outline" placeholder="Registre Commerce (Optional)" value={formData.registre_commerce} onChangeText={(v) => updateForm('registre_commerce', v)} />
                </>
              )}

              <InputField icon="lock-closed-outline" placeholder="Create Secure Password" value={formData.password} onChangeText={(v) => updateForm('password', v)} secureTextEntry />

              <TouchableOpacity style={[styles.primaryButton, loading && styles.disabledBtn]} onPress={handleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register Account</Text>}
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.loginFooter} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginFooterText}>
              Already part of the team? <Text style={styles.loginFooterBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  logoContainer: { width: 70, height: 70, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  brandName: { fontSize: 28, fontWeight: '900', color: Colors.primary, marginTop: 15, letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: '#64748B', marginTop: 4, fontWeight: '500' },
  progressContainer: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, marginBottom: 30, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: Colors.primary },
  stepContainer: { width: '100%' },
  
  roleContainer: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  roleBtn: { flex: 1, paddingVertical: 15, borderRadius: 15, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  roleBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleText: { marginTop: 8, fontSize: 15, fontWeight: '700', color: '#64748B' },
  roleTextActive: { color: '#fff' },

  stepTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  stepSubtitle: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 25 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 15, paddingHorizontal: 16, height: 60, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#1E293B', fontWeight: '500' },
  primaryButton: { backgroundColor: Colors.primary, height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, elevation: 6, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { marginLeft: 8, fontSize: 14, color: Colors.primary, fontWeight: '700' },
  loginFooter: { marginTop: 30, alignItems: 'center' },
  loginFooterText: { fontSize: 15, color: '#64748B', fontWeight: '500' },
  loginFooterBold: { color: Colors.primary, fontWeight: '800' },
  disabledBtn: { opacity: 0.7 },
  genderContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  genderBtn: { flex: 1, height: 60, borderRadius: 15, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  genderBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#64748B' },
  genderTextActive: { color: '#fff' },
});
