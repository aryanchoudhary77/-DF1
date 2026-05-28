import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const router = useRouter();

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(28, 78, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
  };

  const productData = {
    labels: ['Seeds', 'Fertilizers', 'Pesticides', 'PGR'],
    datasets: [{ data: [40, 20, 30, 10] }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dealer Analytics</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sales Revenue Trend</Text>
          <LineChart
            data={salesData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Product Category Sales</Text>
          <BarChart
            data={productData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`}}
            yAxisLabel=""
            yAxisSuffix="%"
            style={styles.chart}
            withInnerLines={false}
          />
        </View>

        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>AI Insights</Text>
          <Text style={styles.insightText}>• Seeds category sales increased by 15% this month.</Text>
          <Text style={styles.insightText}>• Consider stocking up on Pesticides for the upcoming monsoon season.</Text>
          <Text style={styles.insightText}>• Reorder prediction: High demand expected for 'Hybrid Cotton Seeds' next week.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9F1' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A231F' },
  content: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 16, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A231F', marginBottom: 16, alignSelf: 'flex-start' },
  chart: { borderRadius: 16 },
  insightsCard: { backgroundColor: '#E0F4D0', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#A3D868' },
  insightsTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C4E33', marginBottom: 12 },
  insightText: { fontSize: 14, color: '#1A231F', marginBottom: 8, lineHeight: 20 }
});
