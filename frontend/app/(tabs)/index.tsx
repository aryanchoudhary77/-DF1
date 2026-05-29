import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Theme } from '@/src/theme';
import Skeleton from '@/src/components/ui/Skeleton';

export default function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const renderSkeletons = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <View>
          <Skeleton width={150} height={30} style={{ marginBottom: 8 }} />
          <Skeleton width={200} height={16} />
        </View>
        <Skeleton width={50} height={50} borderRadius={25} />
      </View>
      <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 24 }} />
      <Skeleton width="100%" height={160} borderRadius={16} style={{ marginBottom: 24 }} />
      <View style={styles.actionGrid}>
        <Skeleton width="48%" height={100} borderRadius={12} />
        <Skeleton width="48%" height={100} borderRadius={12} />
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return <SafeAreaView style={styles.container}>{renderSkeletons()}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello {user?.name?.split(' ')[0] || 'Dealer'}!</Text>
            <Text style={styles.subGreeting}>Manage your sales with care.</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchText}>Search products, orders...</Text>
          <Ionicons name="search" size={20} color={Theme.colors.textSecondary} />
        </TouchableOpacity>

        {data?.schemes && data.schemes.length > 0 && (
          <View style={styles.schemeCard}>
            <View style={styles.schemeOverlay} />
            <View style={styles.schemeHeader}>
              <Text style={styles.schemeTitle}>{data.schemes[0].title}</Text>
              <Ionicons name="sparkles" size={20} color={Theme.colors.accent} />
            </View>
            <Text style={styles.schemeDesc}>{data.schemes[0].description}</Text>
            <TouchableOpacity style={styles.schemeAction}>
              <Text style={styles.schemeActionText}>View Details &gt;</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/analytics')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F4D0' }]}>
              <Ionicons name="stats-chart" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/maps')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="map" size={24} color={Theme.colors.accent} />
            </View>
            <Text style={styles.actionText}>Network</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ledgerRow}>
          <View style={styles.ledgerCard}>
            <Text style={styles.ledgerLabel}>Total Outstanding</Text>
            <Text style={styles.ledgerValue}>₹{data?.dealer?.outstanding_amount?.toLocaleString('en-IN') || 0}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="arrow-up" size={12} color={Theme.colors.error} />
                <Text style={[styles.badgeText, { color: Theme.colors.error }]}>Due</Text>
              </View>
            </View>
          </View>
          <View style={styles.ledgerCard}>
            <Text style={styles.ledgerLabel}>Available Credit</Text>
            <Text style={styles.ledgerValue}>₹{((data?.dealer?.credit_limit || 0) - (data?.dealer?.outstanding_amount || 0)).toLocaleString('en-IN')}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#E0F4D0' }]}>
                <Ionicons name="checkmark-circle" size={12} color={Theme.colors.success} />
                <Text style={[styles.badgeText, { color: Theme.colors.success }]}>Safe</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => router.push('/orders')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ordersContainer}>
          {data?.recent_orders && data.recent_orders.length > 0 ? (
            data.recent_orders.map((order: any) => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderIcon}>
                  <Ionicons name="cube" size={24} color={Theme.colors.primary} />
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>#{order.id.substring(0, 8).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderAmount}>₹{order.total_amount?.toLocaleString('en-IN')}</Text>
                  <View style={[styles.statusBadge, order.order_status === 'placed' ? styles.statusWarning : styles.statusSuccess]}>
                    <Text style={[styles.statusText, order.order_status === 'placed' ? { color: '#B45309' } : { color: Theme.colors.success }]}>
                      {order.order_status}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={Theme.colors.border} />
              <Text style={styles.emptyText}>No recent orders</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.lg, paddingBottom: Theme.spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.lg },
  greeting: { ...Theme.typography.h2 },
  subGreeting: { ...Theme.typography.caption, marginTop: 4 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0F4D0', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  searchBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  searchText: { ...Theme.typography.body, color: Theme.colors.textSecondary },
  schemeCard: { backgroundColor: Theme.colors.primary, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.xl, marginBottom: Theme.spacing.lg, overflow: 'hidden' },
  schemeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: Theme.borderRadius.xl },
  schemeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.sm },
  schemeTitle: { ...Theme.typography.small, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1 },
  schemeDesc: { ...Theme.typography.h3, color: '#FFFFFF', lineHeight: 28, marginBottom: Theme.spacing.md },
  schemeAction: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.borderRadius.round },
  schemeActionText: { ...Theme.typography.small, color: '#FFFFFF' },
  actionGrid: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.lg },
  actionCard: { flex: 1, backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.lg, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.sm },
  actionText: { ...Theme.typography.small, color: Theme.colors.text, fontWeight: '600' },
  ledgerRow: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.lg },
  ledgerCard: { flex: 1, backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ledgerLabel: { ...Theme.typography.small, marginBottom: Theme.spacing.xs },
  ledgerValue: { ...Theme.typography.h2, marginBottom: Theme.spacing.sm },
  badgeRow: { flexDirection: 'row' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Theme.borderRadius.round },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.md },
  sectionTitle: { ...Theme.typography.h3 },
  seeAll: { ...Theme.typography.small, color: Theme.colors.primary, fontWeight: '700' },
  ordersContainer: { gap: Theme.spacing.sm },
  orderItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  orderIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  orderDetails: { flex: 1 },
  orderId: { ...Theme.typography.body, fontWeight: '700', marginBottom: 2 },
  orderDate: { ...Theme.typography.caption },
  orderRight: { alignItems: 'flex-end' },
  orderAmount: { ...Theme.typography.body, fontWeight: '700', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Theme.borderRadius.round },
  statusSuccess: { backgroundColor: '#E0F4D0' },
  statusWarning: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  emptyState: { alignItems: 'center', padding: Theme.spacing.xxl },
  emptyText: { ...Theme.typography.caption, marginTop: Theme.spacing.sm },
});
