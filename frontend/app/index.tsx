import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Alert, 
  ImageBackground, 
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import apiClient from '@/src/api/client';
import { Theme } from '@/src/theme';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Animations
  const orb1Y = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(40);

  useEffect(() => {
    // Floating Orbs
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb2Y.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Card Entrance
    cardOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });
  }, []);

  const animatedOrb1 = useAnimatedStyle(() => ({ transform: [{ translateY: orb1Y.value }] }));
  const animatedOrb2 = useAnimatedStyle(() => ({ transform: [{ translateY: orb2Y.value }] }));
  const animatedCard = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }]
  }));

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (mobile.length < 10) {
      Alert.alert('Invalid Entry', 'Please enter a valid 10-digit mobile number to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/login', { mobile });
      router.push({ pathname: '/verify', params: { mobile } });
    } catch (error: any) {
      Alert.alert('Authentication Failed', error.response?.data?.detail || 'An error occurred connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Deep Rich Background Image */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1592982537447-6f204c3e8006?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }} 
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Base Dark Gradient Overlay */}
      <LinearGradient
        colors={['rgba(5, 25, 18, 0.4)', 'rgba(2, 10, 7, 0.95)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 3D Floating Glowing Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, animatedOrb1]}>
        <LinearGradient colors={['#10B981', '#047857']} style={StyleSheet.absoluteFillObject} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb2, animatedOrb2]}>
        <LinearGradient colors={['#F59E0B', '#B45309']} style={StyleSheet.absoluteFillObject} />
      </Animated.View>

      {/* Overall Frosted Glass Layer */}
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
            
            <View style={styles.content}>
              
              {/* Branding Section */}
              <View style={styles.brandContainer}>
                <View style={styles.logo3D}>
                  <LinearGradient colors={['#1C6B53', '#0F4C3A']} style={styles.logoGradient}>
                    <Ionicons name="leaf" size={40} color="#A3D868" style={styles.logoIcon} />
                  </LinearGradient>
                  <View style={styles.logoHighlight} />
                </View>
                <Text style={styles.title}>DreamField</Text>
                <Text style={styles.subtitle}>ENTERPRISE DEALER NETWORK</Text>
              </View>

              {/* Premium 3D Glassmorphic Card */}
              <Animated.View style={[styles.cardWrapper, animatedCard]}>
                <BlurView intensity={60} tint="dark" style={styles.glassCard}>
                  
                  {/* Card Highlights/Borders for 3D effect */}
                  <View style={styles.cardHighlightTop} />
                  <View style={styles.cardHighlightLeft} />

                  <Text style={styles.cardHeader}>Authentication</Text>
                  
                  {/* Inset 3D Input Field */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputPrefix}>
                      <Ionicons name="call" size={20} color="#10B981" />
                      <Text style={styles.prefixText}>+91</Text>
                    </View>
                    <View style={styles.inputDivider} />
                    <TextInput
                      style={styles.input}
                      placeholder="Mobile Number"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="phone-pad"
                      value={mobile}
                      onChangeText={setMobile}
                      maxLength={10}
                      selectionColor="#10B981"
                    />
                    {/* Inner Shadow Simulation */}
                    <View style={styles.inputInnerShadowTop} />
                  </View>

                  {/* 3D Elevated Button */}
                  <TouchableOpacity onPress={handleLogin} disabled={isLoading} activeOpacity={0.8} style={styles.buttonWrapper}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.button3D}
                    >
                      <View style={styles.buttonHighlight} />
                      {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>Continue securely</Text>
                          <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <Text style={styles.secureText}>
                    <Ionicons name="lock-closed" size={12} /> End-to-end encrypted connection
                  </Text>
                </BlurView>
              </Animated.View>

            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  
  // Background Orbs
  orb: { position: 'absolute', width: 250, height: 250, borderRadius: 125, opacity: 0.6 },
  orb1: { top: -50, right: -50 },
  orb2: { bottom: 100, left: -100 },

  // Branding
  brandContainer: { alignItems: 'center', marginBottom: 48 },
  logo3D: { width: 80, height: 80, borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10, overflow: 'hidden' },
  logoGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(255,255,255,0.15)' },
  logoIcon: { shadowColor: '#A3D868', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  title: { fontSize: 42, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 },
  subtitle: { fontSize: 12, fontWeight: '700', color: '#A3D868', letterSpacing: 4, marginTop: 4, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },

  // Glass Card
  cardWrapper: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 20 },
  glassCard: { borderRadius: 24, padding: 32, overflow: 'hidden', backgroundColor: 'rgba(20, 30, 25, 0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardHighlightTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  cardHighlightLeft: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  cardHeader: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 24, letterSpacing: 0.5 },

  // 3D Inset Input
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16, marginBottom: 24, height: 60, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  inputInnerShadowTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(0,0,0,0.3)' },
  inputPrefix: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 },
  prefixText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  inputDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },
  input: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 18, fontWeight: '600', color: '#FFFFFF', letterSpacing: 2 },

  // 3D Button
  buttonWrapper: { borderRadius: 16, shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  button3D: { height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },
  buttonHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%', backgroundColor: 'rgba(255,255,255,0.15)' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },

  secureText: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 24, fontWeight: '500' }
});
