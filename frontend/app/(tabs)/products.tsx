import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';
import { useCartStore } from '@/src/store/useCartStore';
import { Theme } from '@/src/theme';
import Skeleton from '@/src/components/ui/Skeleton';
import Button from '@/src/components/ui/Button';

const { width } = Dimensions.get('window');
const cardWidth = (width - Theme.spacing.lg * 2 - Theme.spacing.sm) / 2;

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
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <View style={styles.imagePlaceholder}>
        <Ionicons name="leaf-outline" size={40} color={Theme.colors.primaryLight} opacity={0.5} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.specsContainer}>
          <Text style={styles.spec}><Text style={styles.specLabel}>Crop: </Text>{item.crop_usage}</Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.dealerPrice}>₹{item.dealer_price}</Text>
            <Text style={styles.mrp}>₹{item.mrp}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSkeletons = () => (
    <View style={styles.skeletonGrid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <Skeleton width="100%" height={120} borderRadius={Theme.borderRadius.md} style={{ marginBottom: 12 }} />
          <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="60%" height={12} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View>
              <Skeleton width={50} height={20} style={{ marginBottom: 4 }} />
              <Skeleton width={40} height={12} />
            </View>
            <Skeleton width={36} height={36} borderRadius={18} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catalog</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ScrollView contentContainerStyle={styles.listContainer}>{renderSkeletons()}</ScrollView>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  headerTitle: { ...Theme.typography.h2 },
  filterBtn: { padding: Theme.spacing.xs },
  listContainer: { padding: Theme.spacing.lg },
  columnWrapper: { justifyContent: 'space-between', marginBottom: Theme.spacing.sm },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  skeletonCard: { width: cardWidth, backgroundColor: Theme.colors.card, padding: Theme.spacing.sm, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.sm },
  productCard: { width: cardWidth, backgroundColor: Theme.colors.card, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  imagePlaceholder: { width: '100%', height: 120, backgroundColor: '#F0FDF4', borderRadius: Theme.borderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.md, overflow: 'hidden' },
  categoryBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Theme.borderRadius.round },
  categoryText: { fontSize: 10, fontWeight: '700', color: Theme.colors.primary, textTransform: 'uppercase' },
  productInfo: { flex: 1 },
  title: { ...Theme.typography.body, fontWeight: '700', marginBottom: 2 },
  description: { ...Theme.typography.caption, fontSize: 12, marginBottom: 8, height: 32 },
  specsContainer: { marginBottom: 12 },
  spec: { fontSize: 11, color: Theme.colors.textSecondary },
  specLabel: { fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  dealerPrice: { ...Theme.typography.h3, color: Theme.colors.primary },
  mrp: { fontSize: 11, color: Theme.colors.textSecondary, textDecorationLine: 'line-through', marginTop: 2 },
  addButton: { backgroundColor: Theme.colors.primary, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
