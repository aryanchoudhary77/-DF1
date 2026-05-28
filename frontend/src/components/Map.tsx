import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

export default function Map({ initialRegion, nearbyDealers }) {
  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      <Marker coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }} title="Your Store" pinColor="blue" />
      <Circle center={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }} radius={3000} fillColor="rgba(28, 78, 51, 0.2)" strokeColor="#1C4E33" />
      
      {nearbyDealers.map((d: any) => (
        <Marker key={d.id} coordinate={{ latitude: d.lat, longitude: d.lng }} title={d.title} pinColor="green" />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: '100%' },
});
