import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';

export default function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'D'}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.dealerCode}>Dealer Code: <Text style={{ fontWeight: '700' }}>{user?.dealer_code}</Text></Text>
          <View style={styles.badge}>
            <Ionicons name="star" size={14} color={Theme.colors.accent} />
            <Text style={styles.badgeText}>Gold Tier Partner</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹12L</Text>
            <Text style={styles.statLabel}>Lifetime Value</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuHeader}>Settings & Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Ionicons name="document-text-outline" size={20} color={Theme.colors.text} /></View>
            <Text style={styles.menuItemText}>My Invoices</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.border} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Ionicons name="headset-outline" size={20} color={Theme.colors.text} /></View>
            <Text style={styles.menuItemText}>Support Tickets</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.border} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Ionicons name="settings-outline" size={20} color={Theme.colors.text} /></View>
            <Text style={styles.menuItemText}>Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.border} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Theme.colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  headerTitle: { ...Theme.typography.h2 },
  content: { padding: Theme.spacing.lg },
  profileCard: { backgroundColor: Theme.colors.card, padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl, alignItems: 'center', marginBottom: Theme.spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: Theme.colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.md },
  avatarText: { ...Theme.typography.h1, color: '#FFFFFF' },
  name: { ...Theme.typography.h2, marginBottom: 4 },
  dealerCode: { ...Theme.typography.body, color: Theme.colors.textSecondary, marginBottom: Theme.spacing.sm },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.borderRadius.round, gap: 4 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#B45309', textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', backgroundColor: Theme.colors.card, borderRadius: Theme.borderRadius.xl, padding: Theme.spacing.md, marginBottom: Theme.spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: Theme.spacing.sm },
  statValue: { ...Theme.typography.h3, color: Theme.colors.primary, marginBottom: 4 },
  statLabel: { ...Theme.typography.small, color: Theme.colors.textSecondary },
  divider: { width: 1, backgroundColor: Theme.colors.border, marginVertical: Theme.spacing.sm },
  menuSection: { marginBottom: Theme.spacing.xl },
  menuHeader: { ...Theme.typography.h3, marginBottom: Theme.spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.sm },
  menuIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  menuItemText: { flex: 1, ...Theme.typography.body, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg },
  logoutText: { ...Theme.typography.body, color: Theme.colors.error, fontWeight: '700', marginLeft: Theme.spacing.sm }
});
