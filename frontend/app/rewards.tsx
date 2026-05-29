import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';

export default function RewardsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty & Rewards</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Tier Card */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
          style={styles.tierCard}
          imageStyle={{ borderRadius: Theme.borderRadius.xl }}
        >
          <View style={styles.tierOverlay} />
          <View style={styles.tierContent}>
            <View style={styles.badgeWrap}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <Text style={styles.badgeText}>Gold Partner</Text>
            </View>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>12,450</Text>
            
            <View style={styles.progressWrap}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>2,550 pts to Platinum</Text>
                <Text style={styles.progressText}>83%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '83%' }]} />
              </View>
            </View>
          </View>
        </ImageBackground>

        <Text style={styles.sectionTitle}>Unlockable Rewards</Text>

        <View style={styles.rewardGrid}>
          <View style={styles.rewardCard}>
            <View style={styles.rewardIconBg}><Ionicons name="airplane" size={32} color={Theme.colors.primary} /></View>
            <Text style={styles.rewardTitle}>Goa Trip</Text>
            <Text style={styles.rewardPts}>15,000 pts</Text>
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={20} color="#FFF" />
            </View>
          </View>

          <View style={styles.rewardCard}>
            <View style={styles.rewardIconBg}><Ionicons name="tv" size={32} color={Theme.colors.primary} /></View>
            <Text style={styles.rewardTitle}>Smart TV 55"</Text>
            <Text style={styles.rewardPts}>10,000 pts</Text>
            <TouchableOpacity style={styles.redeemBtn}>
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
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

        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementRow}>
          <View style={styles.achieveIcon}><Ionicons name="star" size={20} color="#F59E0B" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.achieveTitle}>Monsoon Master</Text>
            <Text style={styles.achieveDesc}>Sold 500 units of Hybrid Seeds</Text>
          </View>
          <Text style={styles.achievePts}>+500</Text>
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
  content: { padding: Theme.spacing.lg },
  tierCard: { height: 220, borderRadius: Theme.borderRadius.xl, marginBottom: Theme.spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  tierOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17, 24, 39, 0.8)', borderRadius: Theme.borderRadius.xl },
  tierContent: { flex: 1, padding: Theme.spacing.xl, justifyContent: 'center' },
  badgeWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.borderRadius.round, alignSelf: 'flex-start', gap: 6, marginBottom: 16 },
  badgeText: { color: '#F59E0B', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  pointsLabel: { ...Theme.typography.small, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  pointsValue: { ...Theme.typography.h1, fontSize: 40, color: '#FFFFFF', marginBottom: 24 },
  progressWrap: { width: '100%' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#F59E0B', borderRadius: 3 },
  sectionTitle: { ...Theme.typography.h3, marginBottom: Theme.spacing.md },
  rewardGrid: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.xl },
  rewardCard: { flex: 1, backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.border, overflow: 'hidden' },
  rewardIconBg: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  rewardTitle: { ...Theme.typography.body, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  rewardPts: { ...Theme.typography.small, color: Theme.colors.accent, fontWeight: '700', marginBottom: 16 },
  redeemBtn: { backgroundColor: Theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Theme.borderRadius.round, width: '100%', alignItems: 'center' },
  redeemText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' },
  achievementRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.sm, borderWidth: 1, borderColor: Theme.colors.border },
  achieveIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  achieveTitle: { ...Theme.typography.body, fontWeight: '700' },
  achieveDesc: { ...Theme.typography.caption, marginTop: 2 },
  achievePts: { ...Theme.typography.h3, color: Theme.colors.success }
});
