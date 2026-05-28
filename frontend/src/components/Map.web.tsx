import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Map({ initialRegion, nearbyDealers }) {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={64} color="#D1D5DB" />
      <Text style={styles.text}>Maps are not supported on web preview.</Text>
      <Text style={styles.subtext}>Please view on a mobile device.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  }
});
