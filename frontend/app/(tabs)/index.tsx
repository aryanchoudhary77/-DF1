import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import apiClient from '@/src/api/client';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Theme } from '@/src/theme';
import Skeleton from '@/src/components/ui/Skeleton';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const fetchDashboard = async () => {
    try {
      const [dashRes, walletRes] = await Promise.all([
        apiClient.get('/dashboard'),
        apiClient.get('/gamification/wallet').catch(() => ({ data: { coins: 1250, rank: 'Gold' } })) // fallback if not yet loaded
      ]);
      setData(dashRes.data);
      setWallet(walletRes.data);
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

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Skeleton width={150} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <ScrollView style={{ padding: 16 }}>
          <Skeleton width="100%" height={200} borderRadius={24} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
            <Skeleton width="47%" height={100} borderRadius={16} />
            <Skeleton width="47%" height={100} borderRadius={16} />
          </View>
          <Skeleton width="100%" height={100} borderRadius={16} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Dynamic Enterprise Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name || 'Dealer') + '&background=0D8ABC&color=fff' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user?.name || 'Dealer'}</Text>
              <View style={[styles.miniBadge, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="star" size={10} color="#B45309" />
                <Text style={styles.miniBadgeText}>{wallet?.rank || 'Gold'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.coinBadge} onPress={() => router.push('/rewards')}>
            <Ionicons name="diamond" size={16} color="#F59E0B" />
            <Text style={styles.coinText}>{wallet?.coins?.toLocaleString() || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color={Theme.colors.text} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Premium Rounded Search */}
        <TouchableOpacity style={styles.searchBox} onPress={() => router.push('/products')}>
          <Ionicons name="search" size={20} color={Theme.colors.textSecondary} />
          <Text style={styles.searchText}>Search products, categories...</Text>
          <View style={styles.micBtn}>
            <Ionicons name="mic" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Primary Metric Card: Sales & Targets */}
        <LinearGradient
          colors={['#0F4C3A', '#1C6B53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryCard}
        >
          <View style={styles.cardGlow} />
          <View style={styles.primaryCardHeader}>
            <View>
              <Text style={styles.primaryLabel}>Monthly Sales Target</Text>
              <Text style={styles.rankTitle}>₹4,50,000 / ₹5L</Text>
            </View>
            <Ionicons name="analytics" size={32} color="#10B981" />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>90% Achieved</Text>
              <Text style={styles.progressText}>₹50,000 left</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '90%', backgroundColor: '#10B981' }]} />
            </View>
          </View>

          <View style={styles.primaryStatsRow}>
            <View>
              <Text style={styles.primaryStatLabel}>Total Outstanding</Text>
              <Text style={styles.primaryStatValue}>₹{data?.dealer?.outstanding_amount?.toLocaleString() || 0}</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.primaryStatLabel}>Available Credit</Text>
              <Text style={styles.primaryStatValue}>₹{((data?.dealer?.credit_limit || 0) - (data?.dealer?.outstanding_amount || 0)).toLocaleString()}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Action Grid */}
        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.qCard} onPress={() => router.push('/orders')}>
            <View style={[styles.qIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="cube" size={22} color="#6366F1" />
            </View>
            <Text style={styles.qTitle}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qCard} onPress={() => router.push('/rewards')}>
            <View style={[styles.qIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="gift" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.qTitle}>Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qCard} onPress={() => router.push('/ledger')}>
            <View style={[styles.qIcon, { backgroundColor: '#ECFCCB' }]}>
              <Ionicons name="wallet" size={22} color="#10B981" />
            </View>
            <Text style={styles.qTitle}>Ledger</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qCard} onPress={() => router.push('/support')}>
            <View style={[styles.qIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="headset" size={22} color="#EF4444" />
            </View>
            <Text style={styles.qTitle}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Smart Insights Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Smart Insights</Text>
          <Ionicons name="sparkles" size={20} color="#F59E0B" />
        </View>
        
        <View style={styles.insightCard}>
          <View style={styles.insightIconWrap}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>High Demand Alert</Text>
            <Text style={styles.insightText}>Hybrid Cotton Seeds are trending in your territory. Stock up before monsoon!</Text>
            <TouchableOpacity style={styles.insightBtn} onPress={() => router.push('/products')}>
              <Text style={styles.insightBtnText}>View Catalog</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Leaderboard Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Dealers in Region</Text>
          <TouchableOpacity onPress={() => router.push('/rewards')}>
            <Text style={styles.seeAll}>View Leaderboard</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.leaderboardCard}>
          <View style={styles.leaderRow}>
            <Text style={styles.leaderRank}>1</Text>
            <Ionicons name="person-circle" size={32} color={Theme.colors.primaryLight} />
            <Text style={styles.leaderName}>Ravi Traders</Text>
            <Text style={styles.leaderPoints}>22,400 pts</Text>
          </View>
          <View style={[styles.leaderRow, styles.leaderActive]}>
            <Text style={styles.leaderRank}>2</Text>
            <Image source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name || 'Dealer') }} style={styles.leaderAvatar} />
            <Text style={[styles.leaderName, { fontWeight: '800' }]}>You</Text>
            <Text style={[styles.leaderPoints, { color: Theme.colors.primary }]}>{wallet?.coins?.toLocaleString() || 0} pts</Text>
          </View>
          <View style={styles.leaderRow}>
            <Text style={styles.leaderRank}>3</Text>
            <Ionicons name="person-circle" size={32} color={Theme.colors.primaryLight} />
            <Text style={styles.leaderName}>Kisan Kendra</Text>
            <Text style={styles.leaderPoints}>10,200 pts</Text>
          </View>
        </View>

        {/* Announcements & Training */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Announcements & Training</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80' }} 
            style={styles.trainingCard}
            imageStyle={{ borderRadius: 16 }}
          >
            <View style={styles.trainingOverlay} />
            <View style={styles.trainingContent}>
              <View style={styles.playBtn}><Ionicons name="play" size={16} color="#000" /></View>
              <Text style={styles.trainingTitle}>Pesticide Safety Webinar</Text>
              <Text style={styles.trainingTime}>10 mins • Earn 50 Coins</Text>
            </View>
          </ImageBackground>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1592982537447-6f204c3e8006?auto=format&fit=crop&w=600&q=80' }} 
            style={styles.trainingCard}
            imageStyle={{ borderRadius: 16 }}
          >
            <View style={styles.trainingOverlay} />
            <View style={styles.trainingContent}>
              <View style={styles.playBtn}><Ionicons name="play" size={16} color="#000" /></View>
              <Text style={styles.trainingTitle}>Monsoon Prep Guide</Text>
              <Text style={styles.trainingTime}>15 mins • Earn 100 Coins</Text>
            </View>
          </ImageBackground>
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Theme.spacing.lg, paddingBottom: Theme.spacing.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#FFF' },
  greeting: { ...Theme.typography.caption, fontSize: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { ...Theme.typography.h3, fontWeight: '700' },
  miniBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  miniBadgeText: { fontSize: 9, fontWeight: '800', color: '#B45309', textTransform: 'uppercase' },
  
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: '#FDE68A' },
  coinText: { color: '#B45309', fontWeight: '800', fontSize: 13 },
  iconBtn: { position: 'relative', backgroundColor: '#FFF', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: Theme.colors.border },
  badge: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: Theme.colors.error, borderWidth: 2, borderColor: '#FFF' },
  
  scrollContent: { padding: Theme.spacing.lg, paddingBottom: 100 },
  
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, paddingHorizontal: 16, borderRadius: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  searchText: { flex: 1, ...Theme.typography.body, color: Theme.colors.textSecondary, marginLeft: 12 },
  micBtn: { backgroundColor: Theme.colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  primaryCard: { borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: Theme.colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10, overflow: 'hidden' },
  cardGlow: { position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },
  primaryCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  primaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  rankTitle: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  progressContainer: { marginBottom: 24 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressBarFill: { height: 6, borderRadius: 3 },
  primaryStatsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 16 },
  primaryStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 },
  primaryStatValue: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  quickGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  qCard: { alignItems: 'center', gap: 8 },
  qIcon: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  qTitle: { ...Theme.typography.small, fontWeight: '600', color: Theme.colors.text },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  sectionTitle: { ...Theme.typography.h3 },
  seeAll: { ...Theme.typography.small, color: Theme.colors.primary, fontWeight: '700' },

  insightCard: { flexDirection: 'row', backgroundColor: '#F0FDF4', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#A3D868', marginBottom: 24 },
  insightIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  insightContent: { flex: 1 },
  insightTitle: { ...Theme.typography.body, fontWeight: '700', color: '#065F46', marginBottom: 4 },
  insightText: { ...Theme.typography.caption, color: '#064E3B', lineHeight: 20, marginBottom: 12 },
  insightBtn: { alignSelf: 'flex-start', backgroundColor: '#059669', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  insightBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  leaderboardCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 24 },
  leaderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  leaderActive: { backgroundColor: '#F0FDF4', borderRadius: 12, paddingHorizontal: 8, marginHorizontal: -8, borderBottomWidth: 0 },
  leaderRank: { width: 30, ...Theme.typography.h3, color: Theme.colors.textSecondary, textAlign: 'center' },
  leaderAvatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 12 },
  leaderName: { flex: 1, ...Theme.typography.body, fontWeight: '600', marginLeft: 12 },
  leaderPoints: { ...Theme.typography.body, fontWeight: '700', color: Theme.colors.accent },

  trainingCard: { width: 240, height: 140, borderRadius: 16, overflow: 'hidden' },
  trainingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  trainingContent: { flex: 1, padding: 16, justifyContent: 'flex-end' },
  playBtn: { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  trainingTitle: { color: '#FFF', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  trainingTime: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }
});
