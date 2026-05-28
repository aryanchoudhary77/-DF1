import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MapsScreen() {
  const router = useRouter();

  // Mock location for dealer
  const initialRegion = {
    latitude: 19.0760,
    longitude: 72.8777,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const nearbyDealers = [
    { id: 1, title: 'Dealer A', lat: 19.0800, lng: 72.8800 },
    { id: 2, title: 'Dealer B', lat: 19.0700, lng: 72.8700 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network & Delivery Map</Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          <Marker coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }} title="Your Store" pinColor="blue" />
          <Circle center={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }} radius={3000} fillColor="rgba(28, 78, 51, 0.2)" strokeColor="#1C4E33" />
          
          {nearbyDealers.map(d => (
            <Marker key={d.id} coordinate={{ latitude: d.lat, longitude: d.lng }} title={d.title} pinColor="green" />
          ))}
        </MapView>
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
  map: { width: '100%', height: '100%' },
  bottomCard: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A231F', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 }
});
