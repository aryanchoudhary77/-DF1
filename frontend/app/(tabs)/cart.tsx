import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '@/src/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';
import Button from '@/src/components/ui/Button';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/orders', items);
      clearCart();
      Alert.alert('Success', 'Order placed successfully');
      router.push('/orders');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))} style={styles.qtyBtn}>
          <Ionicons name="remove" size={16} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.quantity + 1)} style={styles.qtyBtn}>
          <Ionicons name="add" size={16} color={Theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item.product_id)} style={styles.removeBtn}>
          <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={48} color={Theme.colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some agricultural products to proceed.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product_id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{getTotal().toLocaleString('en-IN')}</Text>
            </View>
            <Button 
              title="Place Order"
              onPress={handleCheckout}
              isLoading={isSubmitting}
            />
          </View>
        </>
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
  cartItem: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  itemInfo: { flex: 1, marginRight: Theme.spacing.md },
  itemTitle: { ...Theme.typography.body, fontWeight: '600', marginBottom: 4 },
  itemPrice: { ...Theme.typography.h3, color: Theme.colors.primary },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: Theme.colors.background, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.border },
  qtyText: { marginHorizontal: 12, ...Theme.typography.h3 },
  removeBtn: { marginLeft: 16, padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
  footer: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingBottom: Theme.spacing.xl },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Theme.spacing.lg },
  totalLabel: { ...Theme.typography.body, color: Theme.colors.textSecondary },
  totalValue: { ...Theme.typography.h1, color: Theme.colors.primary },
});
