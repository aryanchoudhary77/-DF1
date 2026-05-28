import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MapsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network & Delivery Map</Text>
      </View>
      <View style={styles.mapContainer}>
        <View style={styles.webMapPlaceholder}>
          <Ionicons name="map" size={64} color="#1C4E33" />
          <Text style={styles.webMapText}>Map View</Text>
          <Text style={styles.webMapSubtext}>Interactive maps are available on mobile app</Text>
          <View style={styles.webMapInfo}>
            <Text style={styles.webMapInfoText}>📍 Your Store: Mumbai (19.0760, 72.8777)</Text>
            <Text style={styles.webMapInfoText}>📍 Dealer A: Nearby</Text>
            <Text style={styles.webMapInfoText}>📍 Dealer B: Nearby</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Sales Zone Coverage</Text>
        <Text style={styles.cardDesc}>You have exclusive delivery rights within a 3km radius. There are 2 other dealers operating nearby.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9F1' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', zIndex: 10 },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A231F' },
  mapContainer: { flex: 1 },
  webMapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0F4D0', padding: 20 },
  webMapText: { fontSize: 24, fontWeight: 'bold', color: '#1C4E33', marginTop: 16 },
  webMapSubtext: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  webMapInfo: { marginTop: 24, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, width: '100%', maxWidth: 400 },
  webMapInfoText: { fontSize: 14, color: '#1A231F', marginBottom: 8 },
  bottomCard: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A231F', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 }
});
