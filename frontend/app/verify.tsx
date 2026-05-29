import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '@/src/api/client';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Theme } from '@/src/theme';
import GlassCard from '@/src/components/ui/GlassCard';
import Button from '@/src/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function VerifyScreen() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert('Error', 'Please enter valid OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verify', { mobile, otp });
      const { access_token, dealer } = response.data;
      await setAuth(access_token, dealer);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.response?.data?.detail || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1592982537447-6f204c3e8006?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }} 
      style={styles.container}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
            <View style={styles.content}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.headerContainer}>
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>Sent to +91 {mobile}</Text>
                <Text style={styles.hintText}>(Testing OTP: 1234)</Text>
              </View>

              <GlassCard intensity={80} style={styles.formContainer}>
                <Text style={styles.label}>Enter 4-digit Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0 0 0 0"
                  placeholderTextColor={Theme.colors.textSecondary}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                  textAlign="center"
                />

                <Button 
                  title="Verify & Proceed"
                  onPress={handleVerify}
                  isLoading={isLoading}
                  style={styles.button}
                />
              </GlassCard>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 76, 58, 0.8)' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: Theme.spacing.lg },
  backButton: { marginBottom: Theme.spacing.xl, marginTop: Theme.spacing.sm },
  headerContainer: { marginBottom: Theme.spacing.xxl },
  title: { ...Theme.typography.h1, color: '#FFFFFF', marginBottom: Theme.spacing.xs },
  subtitle: { ...Theme.typography.body, color: 'rgba(255, 255, 255, 0.8)', marginBottom: Theme.spacing.xs },
  hintText: { ...Theme.typography.small, color: Theme.colors.accent },
  formContainer: { padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl },
  label: { ...Theme.typography.small, color: '#FFFFFF', marginBottom: Theme.spacing.sm, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: Theme.borderRadius.md, padding: Theme.spacing.lg, fontSize: 32, letterSpacing: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: Theme.spacing.xl },
  button: { marginTop: Theme.spacing.sm },
});
