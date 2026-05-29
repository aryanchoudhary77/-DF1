import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';

export default function ScannerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Product QR</Text>
      </View>

      <View style={styles.cameraPlaceholder}>
        <Ionicons name="scan-outline" size={100} color="rgba(255,255,255,0.5)" />
        <Text style={styles.scanText}>Position barcode or QR code within the frame to verify authenticity.</Text>
        
        {/* Placeholder text for testing agent/web view since native camera won't run on web properly */}
        <Text style={styles.webWarning}>(Camera view simulated on web preview)</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Authenticity & Fast Checkout</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.lg, zIndex: 10 },
  backBtn: { marginRight: Theme.spacing.md },
  headerTitle: { ...Theme.typography.h2, color: '#FFF' },
  cameraPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  scanText: { color: '#FFF', fontSize: 16, textAlign: 'center', marginTop: 24, lineHeight: 24 },
  webWarning: { color: '#A3D868', fontSize: 12, textAlign: 'center', marginTop: 24 },
  footer: { padding: 40, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 }
});
