import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apiClient from '@/src/api/client';
import { Theme } from '@/src/theme';
import Button from '@/src/components/ui/Button';
import GlassCard from '@/src/components/ui/GlassCard';

export default function SupportScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ issue_type: 'Product Issue', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  const issueTypes = ['Product Issue', 'Damaged Stock', 'Return Request', 'Payment Issue', 'Other'];

  const handleSubmit = async () => {
    if (!form.description) {
      Alert.alert('Error', 'Please describe your issue');
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post('/tickets', form);
      Alert.alert('Ticket Raised', 'Support team will contact you shortly.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.detail || 'Failed to raise ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Center</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contactRow}>
            <View style={styles.contactCard}>
              <View style={styles.iconCircle}><Ionicons name="call" size={24} color={Theme.colors.primary} /></View>
              <Text style={styles.contactTitle}>Call RM</Text>
              <Text style={styles.contactSub}>+91 98765 43210</Text>
            </View>
            <View style={styles.contactCard}>
              <View style={styles.iconCircle}><Ionicons name="chatbubbles" size={24} color={Theme.colors.accent} /></View>
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactSub}>Usually replies in 5m</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Raise a New Ticket</Text>

          <GlassCard intensity={80} style={styles.formCard}>
            <Text style={styles.label}>Issue Type</Text>
            <View style={styles.chipRow}>
              {issueTypes.map(type => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.chip, form.issue_type === type && styles.chipActive]}
                  onPress={() => setForm({...form, issue_type: type})}
                >
                  <Text style={[styles.chipText, form.issue_type === type && styles.chipTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Please provide details about the issue..."
              value={form.description}
              onChangeText={(t) => setForm({...form, description: t})}
              multiline
              numberOfLines={4}
              placeholderTextColor={Theme.colors.textSecondary}
            />

            <Button 
              title="Submit Ticket"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={{ marginTop: Theme.spacing.md }}
            />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  backBtn: { marginRight: Theme.spacing.md },
  headerTitle: { ...Theme.typography.h2 },
  content: { padding: Theme.spacing.lg },
  contactRow: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.xl },
  contactCard: { flex: 1, backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.border },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  contactTitle: { ...Theme.typography.body, fontWeight: '700', marginBottom: 2 },
  contactSub: { ...Theme.typography.small, color: Theme.colors.textSecondary },
  sectionTitle: { ...Theme.typography.h3, marginBottom: Theme.spacing.md },
  formCard: { backgroundColor: Theme.colors.card, padding: Theme.spacing.lg, borderRadius: Theme.borderRadius.xl },
  label: { ...Theme.typography.small, color: Theme.colors.text, marginBottom: Theme.spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Theme.spacing.lg },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Theme.borderRadius.round, backgroundColor: Theme.colors.background, borderWidth: 1, borderColor: Theme.colors.border },
  chipActive: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  chipText: { ...Theme.typography.caption, fontWeight: '500' },
  chipTextActive: { color: '#FFF' },
  input: { backgroundColor: Theme.colors.background, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.borderRadius.md, padding: Theme.spacing.md, ...Theme.typography.body },
  textArea: { height: 100, textAlignVertical: 'top' },
});
