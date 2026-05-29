import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';
import apiClient from '@/src/api/client';
import Skeleton from '@/src/components/ui/Skeleton';

export default function RewardsScreen() {
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/gamification/wallet')
      .then(res => setWallet(res.data))
      .catch(() => setWallet({ coins: 1250, rank: 'Gold', xp: 8500, next_rank_xp: 10000, streak: 14 }))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <View style={styles.loader}><Skeleton width="100%" height={200} /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty & Rewards</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Advanced Tier Card */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
          style={styles.tierCard}
          imageStyle={{ borderRadius: Theme.borderRadius.xl }}
        >
          <View style={styles.tierOverlay} />
          <View style={styles.tierContent}>
            <View style={styles.badgeWrap}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <Text style={styles.badgeText}>{wallet?.rank} Elite</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={styles.pointsLabel}>Dream Coins</Text>
                <Text style={styles.pointsValue}>{wallet?.coins?.toLocaleString()}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={16} color="#EF4444" />
                <Text style={styles.streakText}>{wallet?.streak} Day Streak</Text>
              </View>
            </View>
            
            <View style={styles.progressWrap}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>{wallet?.next_rank_xp - wallet?.xp} XP to Platinum</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(wallet?.xp / wallet?.next_rank_xp) * 100}%` }]} />
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Spin Wheel Teaser */}
        <TouchableOpacity style={styles.spinCard}>
          <View style={styles.spinIcon}><Ionicons name="aperture" size={32} color="#F59E0B" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.spinTitle}>Daily Spin & Win</Text>
            <Text style={styles.spinSub}>You have 1 free spin available today!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Theme.colors.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Missions & Challenges</Text>
        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <Text style={styles.missionTitle}>Sell 100kg Urea</Text>
            <Text style={styles.missionReward}>+500 Coins</Text>
          </View>
          <Text style={styles.missionSub}>Monthly Target • Ends in 12 Days</Text>
          <View style={styles.progressBarBg2}>
            <View style={[styles.progressBarFill2, { width: '45%' }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Reward Store</Text>
        <View style={styles.rewardGrid}>
          <View style={styles.rewardCard}>
            <View style={styles.rewardIconBg}><Ionicons name="airplane" size={32} color={Theme.colors.primary} /></View>
            <Text style={styles.rewardTitle}>Goa Trip</Text>
            <Text style={styles.rewardPts}>15,000 pts</Text>
            <View style={styles.lockOverlay}><Ionicons name="lock-closed" size={20} color="#FFF" /></View>
          </View>

          <View style={styles.rewardCard}>
            <View style={styles.rewardIconBg}><Ionicons name="cash" size={32} color={Theme.colors.primary} /></View>
            <Text style={styles.rewardTitle}>₹5k Cashback</Text>
            <Text style={styles.rewardPts}>5,000 pts</Text>
            <TouchableOpacity style={styles.redeemBtn}>
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  backBtn: { marginRight: Theme.spacing.md },
  headerTitle: { ...Theme.typography.h2 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Theme.spacing.lg },
  
  tierCard: { height: 240, borderRadius: Theme.borderRadius.xl, marginBottom: Theme.spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  tierOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17, 24, 39, 0.85)', borderRadius: Theme.borderRadius.xl },
  tierContent: { flex: 1, padding: Theme.spacing.xl, justifyContent: 'space-between' },
  badgeWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.borderRadius.round, alignSelf: 'flex-start', gap: 6 },
  badgeText: { color: '#F59E0B', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  pointsLabel: { ...Theme.typography.small, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  pointsValue: { ...Theme.typography.h1, fontSize: 40, color: '#FFFFFF' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4, borderWidth: 1, borderColor: '#EF4444' },
  streakText: { color: '#FECACA', fontWeight: '700', fontSize: 12 },
  progressWrap: { width: '100%', marginTop: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#F59E0B', borderRadius: 3 },

  spinCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#FDE68A' },
  spinIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  spinTitle: { ...Theme.typography.body, fontWeight: '700', color: '#B45309', marginBottom: 2 },
  spinSub: { ...Theme.typography.caption, color: '#92400E' },

  sectionTitle: { ...Theme.typography.h3, marginBottom: Theme.spacing.md },
  missionCard: { backgroundColor: Theme.colors.card, padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: Theme.colors.border },
  missionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  missionTitle: { ...Theme.typography.body, fontWeight: '700' },
  missionReward: { ...Theme.typography.body, color: Theme.colors.accent, fontWeight: '800' },
  missionSub: { ...Theme.typography.caption, marginBottom: 16 },
  progressBarBg2: { height: 6, backgroundColor: Theme.colors.background, borderRadius: 3 },
  progressBarFill2: { height: 6, backgroundColor: Theme.colors.primary, borderRadius: 3 },

  rewardGrid: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.xl },
  rewardCard: { flex: 1, backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.border, overflow: 'hidden' },
  rewardIconBg: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  rewardTitle: { ...Theme.typography.body, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  rewardPts: { ...Theme.typography.small, color: Theme.colors.accent, fontWeight: '700', marginBottom: 16 },
  redeemBtn: { backgroundColor: Theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Theme.borderRadius.round, width: '100%', alignItems: 'center' },
  redeemText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' },
});
