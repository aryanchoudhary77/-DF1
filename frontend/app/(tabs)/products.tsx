import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/src/api/client';
import { useCartStore } from '@/src/store/useCartStore';

export default function ProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addItem({
      product_id: product._id,
      title: product.title,
      price: product.dealer_price,
      quantity: 1,
    });
    Alert.alert("Added", `${product.title} added to cart`);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.categoryBadge}>{item.category}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.specsContainer}>
          <Text style={styles.spec}><Text style={styles.specLabel}>Dosage: </Text>{item.dosage}</Text>
          <Text style={styles.spec}><Text style={styles.specLabel}>Crop: </Text>{item.crop_usage}</Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.dealerPrice}>₹{item.dealer_price}</Text>
            <Text style={styles.mrp}>MRP: ₹{item.mrp}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Text style={styles.addButtonText}>Add +</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C4E33" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Catalog</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9F1' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F9F1' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A231F' },
  listContainer: { padding: 16 },
  productCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  productHeader: { marginBottom: 12 },
  categoryBadge: { backgroundColor: '#E0F4D0', color: '#1C4E33', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: '600', alignSelf: 'flex-start' },
  productInfo: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1A231F', marginBottom: 4 },
  description: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  specsContainer: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 16 },
  spec: { fontSize: 12, color: '#4B5563', marginBottom: 4 },
  specLabel: { fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dealerPrice: { fontSize: 20, fontWeight: 'bold', color: '#1C4E33' },
  mrp: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' },
  addButton: { backgroundColor: '#1C4E33', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  addButtonText: { color: '#FFFFFF', fontWeight: 'bold' }
});
