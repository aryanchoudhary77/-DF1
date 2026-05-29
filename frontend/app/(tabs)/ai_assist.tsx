import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';
import { Theme } from '@/src/theme';
import Button from '@/src/components/ui/Button';

export default function AIAssistScreen() {
  const [form, setForm] = useState({ crop_type: '', disease: '', season: '', region: '' });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    if (!form.crop_type || !form.disease) return;
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const res = await apiClient.post('/ai/recommend', form);
      setRecommendation(res.data.recommendation);
    } catch (e) {
      console.error(e);
      setRecommendation("Failed to get recommendation from AI. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Copilot</Text>
          <Ionicons name="sparkles" size={24} color={Theme.colors.accent} />
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.card}>
            <View style={styles.iconHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="leaf-outline" size={20} color={Theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Crop Diagnosis</Text>
                <Text style={styles.cardSub}>Describe the issue to get smart recommendations</Text>
              </View>
            </View>

            <Text style={styles.label}>Crop Type</Text>
            <TextInput style={styles.input} placeholder="e.g. Cotton, Paddy" value={form.crop_type} onChangeText={t => setForm({...form, crop_type: t})} placeholderTextColor={Theme.colors.textSecondary} />

            <Text style={styles.label}>Disease / Problem Symptoms</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="e.g. Yellow leaves, Pests" value={form.disease} onChangeText={t => setForm({...form, disease: t})} multiline numberOfLines={3} placeholderTextColor={Theme.colors.textSecondary} />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Season</Text>
                <TextInput style={styles.input} placeholder="e.g. Rabi" value={form.season} onChangeText={t => setForm({...form, season: t})} placeholderTextColor={Theme.colors.textSecondary} />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Region</Text>
                <TextInput style={styles.input} placeholder="e.g. Punjab" value={form.region} onChangeText={t => setForm({...form, region: t})} placeholderTextColor={Theme.colors.textSecondary} />
              </View>
            </View>

            <Button 
              title="Analyze & Recommend"
              onPress={getRecommendation}
              isLoading={isLoading}
              icon={<Ionicons name="analytics" size={20} color="#FFF" />}
              style={{ marginTop: Theme.spacing.md }}
            />
          </View>

          {recommendation && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="bulb-outline" size={24} color={Theme.colors.primary} />
                <Text style={styles.resultTitle}>AI Insights</Text>
              </View>
              <Text style={styles.resultText}>{recommendation}</Text>
              <Button title="Add Suggested to Cart" onPress={() => {}} variant="outline" style={{ marginTop: 16 }} />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Theme.spacing.lg, backgroundColor: Theme.colors.card, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  headerTitle: { ...Theme.typography.h2 },
  content: { padding: Theme.spacing.lg },
  card: { backgroundColor: Theme.colors.card, padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3, marginBottom: Theme.spacing.lg },
  iconHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.xl },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  cardTitle: { ...Theme.typography.h3 },
  cardSub: { ...Theme.typography.caption },
  label: { ...Theme.typography.small, color: Theme.colors.text, marginBottom: Theme.spacing.xs },
  input: { backgroundColor: Theme.colors.background, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.borderRadius.md, padding: Theme.spacing.md, marginBottom: Theme.spacing.lg, ...Theme.typography.body },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: Theme.spacing.md },
  half: { flex: 1 },
  resultCard: { backgroundColor: '#F0FDF4', padding: Theme.spacing.xl, borderRadius: Theme.borderRadius.xl, borderWidth: 1, borderColor: '#A3D868', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.md, gap: Theme.spacing.sm },
  resultTitle: { ...Theme.typography.h3, color: Theme.colors.primary },
  resultText: { ...Theme.typography.body, lineHeight: 24, color: Theme.colors.text }
});
