import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';
import { BarChart, LineChart } from 'react-native-chart-kit';
import GlassCard from '@/src/components/ui/GlassCard';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Sales');

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    propsForLabels: { fontSize: 10, fill: Theme.colors.textSecondary }
  };

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [120, 180, 140, 250, 310, 420] }],
  };

  const categoryData = {
    labels: ['Seeds', 'Fertz', 'Pesticides', 'PGR'],
    datasets: [{ data: [45, 25, 20, 10] }],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics Center</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {['Sales', 'Revenue', 'Territory'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* KPI Row */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Monthly Revenue</Text>
            <Text style={styles.kpiValue}>₹4.2L</Text>
            <Text style={styles.kpiChange}>+14% vs last month</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Dealer Rank</Text>
            <Text style={styles.kpiValue}>#12</Text>
            <Text style={styles.kpiChange}>Top 5% in Region</Text>
          </View>
        </View>

        {/* Charts */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Revenue Growth (6 Months)</Text>
          <LineChart
            data={salesData}
            width={width - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
            withInnerLines={false}
            withOuterLines={false}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Product Category Split (%)</Text>
          <BarChart
            data={categoryData}
            width={width - 64}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix="%"
            style={styles.chartStyle}
            withInnerLines={false}
          />
        </View>

        {/* Performance Goals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance Goals</Text>
        </View>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Q2 Sales Target</Text>
            <Text style={styles.goalValue}>₹12L / ₹15L</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '80%' }]} />
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
  headerTitle: { ...Theme.typography.h2, flex: 1 },
  exportBtn: { backgroundColor: '#F0FDF4', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#A3D868' },
  tabs: { flexDirection: 'row', backgroundColor: Theme.colors.card, paddingHorizontal: Theme.spacing.lg, paddingBottom: Theme.spacing.md, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  tab: { marginRight: 24, paddingBottom: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Theme.colors.primary },
  tabText: { ...Theme.typography.body, color: Theme.colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Theme.colors.primary, fontWeight: '800' },
  content: { padding: Theme.spacing.lg, paddingBottom: 100 },
  kpiRow: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.xl },
  kpiCard: { flex: 1, backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  kpiLabel: { ...Theme.typography.small, color: Theme.colors.textSecondary, marginBottom: 8 },
  kpiValue: { ...Theme.typography.h2, color: Theme.colors.primary, marginBottom: 4 },
  kpiChange: { fontSize: 11, fontWeight: '600', color: Theme.colors.success },
  chartCard: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: Theme.spacing.xl, alignItems: 'center' },
  chartTitle: { ...Theme.typography.h3, marginBottom: Theme.spacing.lg, alignSelf: 'flex-start' },
  chartStyle: { borderRadius: 16 },
  sectionHeader: { marginBottom: Theme.spacing.md },
  sectionTitle: { ...Theme.typography.h3 },
  goalCard: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.xl, borderWidth: 1, borderColor: Theme.colors.border },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  goalTitle: { ...Theme.typography.body, fontWeight: '600' },
  goalValue: { ...Theme.typography.body, fontWeight: '700', color: Theme.colors.primary },
  progressBarBg: { height: 8, backgroundColor: Theme.colors.background, borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: Theme.colors.accent, borderRadius: 4 },
});
