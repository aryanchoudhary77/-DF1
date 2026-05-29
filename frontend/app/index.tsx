import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import apiClient from '@/src/api/client';
import { Theme } from '@/src/theme';
import GlassCard from '@/src/components/ui/GlassCard';
import Button from '@/src/components/ui/Button';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (mobile.length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/login', { mobile });
      router.push({ pathname: '/verify', params: { mobile } });
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.detail || 'An error occurred');
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
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.content}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>DreamField</Text>
                <Text style={styles.subtitle}>Agri Solutions Dealer Portal</Text>
              </View>

              <GlassCard intensity={80} style={styles.formContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.prefix}>+91</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter mobile number"
                    placeholderTextColor={Theme.colors.textSecondary}
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                    maxLength={10}
                  />
                </View>

                <Button 
                  title="Continue securely"
                  onPress={handleLogin}
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
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 76, 58, 0.7)' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: Theme.spacing.lg, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: Theme.spacing.xxl },
  title: { ...Theme.typography.h1, color: '#FFFFFF', marginBottom: Theme.spacing.xs, fontSize: 40 },
  subtitle: { ...Theme.typography.body, color: 'rgba(255, 255, 255, 0.8)' },
  formContainer: { padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl },
  label: { ...Theme.typography.small, color: '#FFFFFF', marginBottom: Theme.spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: Theme.borderRadius.md, marginBottom: Theme.spacing.xl, paddingHorizontal: Theme.spacing.md },
  prefix: { ...Theme.typography.h3, color: '#FFFFFF', marginRight: Theme.spacing.sm },
  input: { flex: 1, paddingVertical: Theme.spacing.lg, ...Theme.typography.h3, color: '#FFFFFF' },
  button: { marginTop: Theme.spacing.sm },
});
