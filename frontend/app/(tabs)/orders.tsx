import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';
import { Theme } from '@/src/theme';
import Skeleton from '@/src/components/ui/Skeleton';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'placed': return '#F59E0B'; // yellow
      case 'approved': return '#3B82F6'; // blue
      case 'dispatched': return '#8B5CF6'; // light blue
      case 'delivered': return '#10B981'; // green
      default: return Theme.colors.textSecondary;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <View style={styles.iconCircle}>
            <Ionicons name="cube" size={20} color={Theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.orderId}>#{item._id.substring(0, 8).toUpperCase()}</Text>
            <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.order_status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.order_status) }]}>{item.order_status}</Text>
        </View>
      </View>
      
      <View style={styles.itemsList}>
        {item.items.map((i: any, idx: number) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemText}>{i.quantity}x {i.title}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>₹{item.total_amount.toLocaleString('en-IN')}</Text>
      </View>
    </View>
  );

  const renderSkeletons = () => (
    <View style={styles.listContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={24} borderRadius={12} />
          </View>
          <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={16} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Skeleton width={60} height={20} />
            <Skeleton width={100} height={24} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>
      
      {isLoading ? (
        renderSkeletons()
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="receipt-outline" size={48} color={Theme.colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Your past orders will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  headerTitle: { ...Theme.typography.h2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xxl },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.lg },
  emptyTitle: { ...Theme.typography.h3, marginBottom: Theme.spacing.xs },
  emptyText: { ...Theme.typography.body, color: Theme.colors.textSecondary, textAlign: 'center' },
  listContainer: { padding: Theme.spacing.lg },
  skeletonCard: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.md },
  orderCard: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: Theme.colors.border, paddingBottom: 16 },
  orderHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.sm },
  orderId: { ...Theme.typography.body, fontWeight: '700', marginBottom: 2 },
  orderDate: { ...Theme.typography.small },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.borderRadius.round },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  itemsList: { marginBottom: 16 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemText: { ...Theme.typography.body, color: Theme.colors.textSecondary },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingTop: 16 },
  totalText: { ...Theme.typography.body, color: Theme.colors.textSecondary },
  totalAmount: { ...Theme.typography.h2, color: Theme.colors.primary }
});
