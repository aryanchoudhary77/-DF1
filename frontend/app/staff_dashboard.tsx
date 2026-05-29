import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';
import Map from '@/src/components/Map';
import Button from '@/src/components/ui/Button';

export default function StaffDashboardScreen() {
  const router = useRouter();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const initialRegion = { latitude: 19.0760, longitude: 72.8777, latitudeDelta: 0.05, longitudeDelta: 0.05 };
  const nearbyDealers = [
    { id: 1, title: 'Dealer A', lat: 19.0800, lng: 72.8800 },
    { id: 2, title: 'Dealer B', lat: 19.0700, lng: 72.8700 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Field Staff Portal</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.attendanceCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.attDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            <Text style={styles.attStatus}>
              {isCheckedIn ? 'Status: Active on field' : 'Status: Not checked in'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.checkInBtn, isCheckedIn && { backgroundColor: Theme.colors.error }]}
            onPress={() => setIsCheckedIn(!isCheckedIn)}
          >
            <Ionicons name={isCheckedIn ? "stop-circle" : "play-circle"} size={20} color="#FFF" />
            <Text style={styles.checkInText}>{isCheckedIn ? 'End Day' : 'Start Day'}</Text>
          </TouchableOpacity>
        </View>

        {isCheckedIn && (
          <>
            <Text style={styles.sectionTitle}>Today's Route Map</Text>
            <View style={styles.mapContainer}>
              <Map initialRegion={initialRegion} nearbyDealers={nearbyDealers} />
            </View>

            <Text style={styles.sectionTitle}>Pending Visits</Text>
            <View style={styles.visitCard}>
              <View style={styles.visitHeader}>
                <Text style={styles.visitName}>Ramesh Patel (D-001)</Text>
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>High</Text>
                </View>
              </View>
              <Text style={styles.visitAddress}>12 km away • Payment Collection</Text>
              <View style={styles.visitActions}>
                <TouchableOpacity style={styles.logBtn}>
                  <Ionicons name="camera-outline" size={16} color={Theme.colors.primary} />
                  <Text style={styles.logBtnText}>Log Visit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logBtn}>
                  <Ionicons name="navigate-outline" size={16} color={Theme.colors.primary} />
                  <Text style={styles.logBtnText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.qCard}>
                <Ionicons name="receipt-outline" size={24} color={Theme.colors.accent} />
                <Text style={styles.qText}>Log Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qCard}>
                <Ionicons name="people-outline" size={24} color={Theme.colors.primary} />
                <Text style={styles.qText}>Farmer Meeting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qCard}>
                <Ionicons name="document-text-outline" size={24} color="#8B5CF6" />
                <Text style={styles.qText}>Leaves</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isCheckedIn && (
          <View style={styles.offlineState}>
            <Ionicons name="location-outline" size={64} color={Theme.colors.border} />
            <Text style={styles.offlineText}>Check in to view your daily route and targets.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  backBtn: { marginRight: Theme.spacing.md },
  headerTitle: { ...Theme.typography.h2 },
  content: { padding: Theme.spacing.lg },
  attendanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl, marginBottom: Theme.spacing.xl },
  attDate: { ...Theme.typography.body, color: '#FFFFFF', fontWeight: '700', marginBottom: 4 },
  attStatus: { ...Theme.typography.caption, color: 'rgba(255,255,255,0.7)' },
  checkInBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.success, paddingHorizontal: 16, paddingVertical: 12, borderRadius: Theme.borderRadius.lg, gap: 8 },
  checkInText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionTitle: { ...Theme.typography.h3, marginBottom: Theme.spacing.md },
  mapContainer: { height: 200, borderRadius: Theme.borderRadius.xl, overflow: 'hidden', marginBottom: Theme.spacing.xl, borderWidth: 1, borderColor: Theme.colors.border },
  visitCard: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.xl, borderWidth: 1, borderColor: Theme.colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  visitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  visitName: { ...Theme.typography.body, fontWeight: '700' },
  priorityBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  priorityText: { color: Theme.colors.error, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  visitAddress: { ...Theme.typography.small, color: Theme.colors.textSecondary, marginBottom: 16 },
  visitActions: { flexDirection: 'row', gap: 12 },
  logBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4', paddingVertical: 10, borderRadius: Theme.borderRadius.md, gap: 6, borderWidth: 1, borderColor: '#A3D868' },
  logBtnText: { ...Theme.typography.small, color: Theme.colors.primary, fontWeight: '700' },
  quickActions: { flexDirection: 'row', gap: Theme.spacing.md },
  qCard: { flex: 1, backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.border },
  qText: { ...Theme.typography.caption, fontSize: 11, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  offlineState: { alignItems: 'center', padding: 40, marginTop: 40 },
  offlineText: { ...Theme.typography.body, color: Theme.colors.textSecondary, textAlign: 'center', marginTop: 16 }
});
