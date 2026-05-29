import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';
import apiClient from '@/src/api/client';
import Skeleton from '@/src/components/ui/Skeleton';

export default function NetworkScreen() {
  const router = useRouter();
  const [networkData, setNetworkData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNetwork();
  }, []);

  const fetchNetwork = async () => {
    try {
      const res = await apiClient.get('/network');
      setNetworkData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDownline = ({ item }: { item: any }) => (
    <View style={styles.dealerCard}>
      <View style={styles.dealerAvatar}>
        <Text style={styles.dealerInitials}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.dealerInfo}>
        <Text style={styles.dealerName}>{item.name}</Text>
        <Text style={styles.dealerId}>{item.id}</Text>
      </View>
      <View style={styles.dealerStats}>
        <Text style={styles.dealerSales}>₹{item.sales.toLocaleString('en-IN')}</Text>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network & Team</Text>
      </View>

      {isLoading ? (
        <View style={styles.loader}><Skeleton width="90%" height={200} borderRadius={16} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>My Referral Network</Text>
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>Code: {networkData?.referral_code}</Text>
              </View>
            </View>
            
            <View style={styles.summaryStats}>
              <View style={styles.statCol}>
                <Text style={styles.statVal}>{networkData?.team_size}</Text>
                <Text style={styles.statLbl}>Total Team</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statVal}>{networkData?.active_downlines}</Text>
                <Text style={styles.statLbl}>Active Now</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={[styles.statVal, { color: Theme.colors.success }]}>₹{networkData?.commission_earned?.toLocaleString()}</Text>
                <Text style={styles.statLbl}>Earned MTD</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.inviteBtn}>
              <Ionicons name="share-social" size={18} color="#FFF" />
              <Text style={styles.inviteText}>Invite New Dealer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Downline Performance</Text>
            <TouchableOpacity><Ionicons name="filter" size={20} color={Theme.colors.textSecondary} /></TouchableOpacity>
          </View>

          <FlatList
            data={networkData?.downlines || []}
            keyExtractor={item => item.id}
            renderItem={renderDownline}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
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
  
  summaryCard: { backgroundColor: '#111827', padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl, marginBottom: Theme.spacing.xl },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  summaryTitle: { ...Theme.typography.h3, color: '#FFF' },
  codeBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.borderRadius.round, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  codeText: { color: Theme.colors.accent, fontWeight: '700', fontSize: 12 },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCol: { alignItems: 'center' },
  statVal: { ...Theme.typography.h2, color: '#FFF', marginBottom: 4 },
  statLbl: { ...Theme.typography.small, color: 'rgba(255,255,255,0.6)' },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.colors.primary, padding: 16, borderRadius: Theme.borderRadius.lg, gap: 8 },
  inviteText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.md },
  sectionTitle: { ...Theme.typography.h3 },
  dealerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.sm, borderWidth: 1, borderColor: Theme.colors.border },
  dealerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0F4D0', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  dealerInitials: { ...Theme.typography.h3, color: Theme.colors.primary },
  dealerInfo: { flex: 1 },
  dealerName: { ...Theme.typography.body, fontWeight: '700', marginBottom: 4 },
  dealerId: { ...Theme.typography.caption },
  dealerStats: { alignItems: 'flex-end' },
  dealerSales: { ...Theme.typography.body, fontWeight: '700', color: Theme.colors.primary, marginBottom: 4 },
  rankBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  rankText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: Theme.colors.textSecondary }
});
