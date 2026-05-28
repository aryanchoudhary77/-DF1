import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '@/src/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';
import { useRouter } from 'expo-router';

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
          <Ionicons name="remove" size={16} color="#1A231F" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.quantity + 1)} style={styles.qtyBtn}>
          <Ionicons name="add" size={16} color="#1A231F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item.product_id)} style={styles.removeBtn}>
          <Ionicons name="trash-outline" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart & Checkout</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product_id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{getTotal()}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutBtn, isSubmitting && styles.checkoutBtnDisabled]} 
              onPress={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.checkoutBtnText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9F1' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A231F' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  listContainer: { padding: 16 },
  cartItem: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#1A231F', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#1C4E33', fontWeight: 'bold' },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#F3F4F6', padding: 8, borderRadius: 8 },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },
  removeBtn: { marginLeft: 16, padding: 8 },
  footer: { backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 18, color: '#6B7280', fontWeight: '600' },
  totalValue: { fontSize: 24, color: '#1A231F', fontWeight: 'bold' },
  checkoutBtn: { backgroundColor: '#1C4E33', padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutBtnDisabled: { backgroundColor: '#9CA3AF' },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});
