import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';
import Button from '@/src/components/ui/Button';

const { width } = Dimensions.get('window');

const invoices = [
  { id: 'INV-2025-001', date: '10 May 2025', amount: 45000, status: 'overdue', days: 45 },
  { id: 'INV-2025-042', date: '28 May 2025', amount: 105000, status: 'due', days: 15 },
  { id: 'INV-2025-089', date: '02 Jun 2025', amount: 20000, status: 'upcoming', days: -5 },
];

export default function LedgerScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalSelected = selected.reduce((sum, id) => {
    const inv = invoices.find(i => i.id === id);
    return sum + (inv?.amount || 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments & Ledger</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Aging Summary */}
        <View style={styles.agingCard}>
          <Text style={styles.agingTitle}>Outstanding Summary</Text>
          <Text style={styles.agingTotal}>₹1,70,000</Text>
          
          <View style={styles.bucketsRow}>
            <View style={styles.bucket}>
              <View style={[styles.bucketIndicator, { backgroundColor: Theme.colors.success }]} />
              <Text style={styles.bucketLabel}>Not Due</Text>
              <Text style={styles.bucketAmount}>₹20,000</Text>
            </View>
            <View style={styles.bucket}>
              <View style={[styles.bucketIndicator, { backgroundColor: Theme.colors.accent }]} />
              <Text style={styles.bucketLabel}>0-30 Days</Text>
              <Text style={styles.bucketAmount}>₹1,05,000</Text>
            </View>
            <View style={styles.bucket}>
              <View style={[styles.bucketIndicator, { backgroundColor: Theme.colors.error }]} />
              <Text style={styles.bucketLabel}>30+ Days</Text>
              <Text style={styles.bucketAmount}>₹45,000</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="document-text" size={20} color={Theme.colors.primary} />
            <Text style={styles.actionText}>Statement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="cloud-upload" size={20} color={Theme.colors.primary} />
            <Text style={styles.actionText}>Upload UTR</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Pending Invoices</Text>
        
        {invoices.map((inv) => (
          <TouchableOpacity 
            key={inv.id} 
            style={[styles.invoiceCard, selected.includes(inv.id) && styles.invoiceSelected]}
            onPress={() => toggleSelect(inv.id)}
            activeOpacity={0.8}
          >
            <View style={styles.checkbox}>
              {selected.includes(inv.id) && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </View>
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceId}>{inv.id}</Text>
              <Text style={styles.invoiceDate}>Due: {inv.date}</Text>
              {inv.status === 'overdue' && (
                <Text style={styles.overdueText}>{inv.days} Days Overdue</Text>
              )}
            </View>
            <Text style={styles.invoiceAmount}>₹{inv.amount.toLocaleString('en-IN')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected.length > 0 && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.selectedCount}>{selected.length} Selected</Text>
            <Text style={styles.selectedTotal}>₹{totalSelected.toLocaleString('en-IN')}</Text>
          </View>
          <Button title="Pay Now" onPress={() => {}} style={{ paddingHorizontal: 32 }} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  backBtn: { marginRight: Theme.spacing.md },
  headerTitle: { ...Theme.typography.h2 },
  content: { padding: Theme.spacing.lg, paddingBottom: 100 },
  agingCard: { backgroundColor: '#111827', padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl, marginBottom: Theme.spacing.lg },
  agingTitle: { ...Theme.typography.small, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  agingTotal: { ...Theme.typography.h1, color: '#FFFFFF', fontSize: 36, marginTop: 8, marginBottom: 24 },
  bucketsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bucket: { flex: 1 },
  bucketIndicator: { width: 12, height: 4, borderRadius: 2, marginBottom: 8 },
  bucketLabel: { ...Theme.typography.caption, color: 'rgba(255,255,255,0.6)' },
  bucketAmount: { ...Theme.typography.body, color: '#FFFFFF', fontWeight: '700', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.xl },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4', padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, gap: 8, borderWidth: 1, borderColor: '#A3D868' },
  actionText: { ...Theme.typography.body, fontWeight: '600', color: Theme.colors.primary },
  sectionTitle: { ...Theme.typography.h3, marginBottom: Theme.spacing.md },
  invoiceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.sm, borderWidth: 1, borderColor: Theme.colors.border },
  invoiceSelected: { borderColor: Theme.colors.primary, backgroundColor: '#F0FDF4' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Theme.colors.border, justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  invoiceDetails: { flex: 1 },
  invoiceId: { ...Theme.typography.body, fontWeight: '700' },
  invoiceDate: { ...Theme.typography.caption, marginTop: 2 },
  overdueText: { fontSize: 12, color: Theme.colors.error, fontWeight: '600', marginTop: 4 },
  invoiceAmount: { ...Theme.typography.h3, color: Theme.colors.text },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Theme.colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 10 },
  selectedCount: { ...Theme.typography.caption },
  selectedTotal: { ...Theme.typography.h2, color: Theme.colors.primary },
});
