import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C4E33" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1C4E33']} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello {user?.name || 'Dealer'}!</Text>
            <Text style={styles.subGreeting}>Keep manage your sales with care.</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="#1C4E33" />
          </View>
        </View>

        {/* Search Bar - Fake */}
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>Search products, orders...</Text>
          <Ionicons name="search" size={20} color="#9CA3AF" />
        </View>

        {/* Scheme Banner */}
        {data?.schemes && data.schemes.length > 0 && (
          <View style={styles.schemeCard}>
            <View style={styles.schemeHeader}>
              <Text style={styles.schemeTitle}>{data.schemes[0].title}</Text>
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.schemeDesc}>{data.schemes[0].description}</Text>
            <TouchableOpacity style={styles.schemeAction}>
              <Text style={styles.schemeActionText}>View Details &gt;</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/analytics')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F4D0' }]}>
              <Ionicons name="stats-chart" size={24} color="#1C4E33" />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/maps')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="map" size={24} color="#D97706" />
            </View>
            <Text style={styles.actionText}>Dealer Network</Text>
          </TouchableOpacity>
        </View>

        {/* Ledger Summary */}
        <View style={styles.ledgerRow}>
          <View style={styles.ledgerCard}>
            <Text style={styles.ledgerLabel}>Total Outstanding</Text>
            <Text style={styles.ledgerValue}>₹{data?.dealer?.outstanding_amount?.toLocaleString('en-IN') || 0}</Text>
            <Text style={styles.ledgerSubtext}>Due Amount</Text>
          </View>
          <View style={styles.ledgerCard}>
            <Text style={styles.ledgerLabel}>Available Credit</Text>
            <Text style={styles.ledgerValue}>₹{((data?.dealer?.credit_limit || 0) - (data?.dealer?.outstanding_amount || 0)).toLocaleString('en-IN')}</Text>
            <Text style={styles.ledgerSubtext}>Limit: ₹{data?.dealer?.credit_limit?.toLocaleString('en-IN') || 0}</Text>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color="#1A231F" />
          </TouchableOpacity>
        </View>

        <View style={styles.ordersContainer}>
          {data?.recent_orders && data.recent_orders.length > 0 ? (
            data.recent_orders.map((order: any) => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderIcon}>
                  <Ionicons name="cube" size={20} color="#1A231F" />
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>Order #{order.id.substring(0, 8).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderStatus(order.order_status)}>{order.order_status}</Text>
                  <Text style={styles.orderAmount}>₹{order.total_amount}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent orders</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9F1',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A231F',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F4D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  schemeCard: {
    backgroundColor: '#1C4E33',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  schemeTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  schemeDesc: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: 16,
  },
  schemeActionText: {
    color: '#A3D868',
    fontSize: 14,
    fontWeight: '600',
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  ledgerCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ledgerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  ledgerValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A231F',
    marginBottom: 4,
  },
  ledgerSubtext: {
    fontSize: 12,
    color: '#10B981',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A231F',
  },
  ordersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600', color: '#1A231F' },

    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F9F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A231F',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderStatus: (status: string) => ({
    fontSize: 12,
    fontWeight: '500',
    color: status === 'placed' ? '#F59E0B' : '#10B981',
    marginBottom: 4,
  }),
  orderAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A231F',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: 20,
  }
});
