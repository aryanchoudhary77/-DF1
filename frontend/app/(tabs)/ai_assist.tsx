import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/src/api/client';

export default function AIAssistScreen() {
  const [form, setForm] = useState({ crop_type: '', disease: '', season: '', region: '' });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    if (!form.crop_type) return;
    setIsLoading(true);
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
          <Text style={styles.headerTitle}>AI Recommendation</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconHeader}>
              <Ionicons name="leaf-outline" size={24} color="#1C4E33" />
              <Text style={styles.cardTitle}>Crop Issue Details</Text>
            </View>

            <Text style={styles.label}>Crop Type</Text>
            <TextInput style={styles.input} placeholder="e.g. Cotton, Paddy" value={form.crop_type} onChangeText={t => setForm({...form, crop_type: t})} />

            <Text style={styles.label}>Disease / Problem</Text>
            <TextInput style={styles.input} placeholder="e.g. Yellow leaves, Pests" value={form.disease} onChangeText={t => setForm({...form, disease: t})} />

            <Text style={styles.label}>Season</Text>
            <TextInput style={styles.input} placeholder="e.g. Monsoon, Rabi" value={form.season} onChangeText={t => setForm({...form, season: t})} />

            <Text style={styles.label}>Region</Text>
            <TextInput style={styles.input} placeholder="e.g. Maharashtra, Punjab" value={form.region} onChangeText={t => setForm({...form, region: t})} />

            <TouchableOpacity style={styles.btn} onPress={getRecommendation} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Analyze & Recommend</Text>}
            </TouchableOpacity>
          </View>

          {recommendation && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>AI Insights</Text>
              <Text style={styles.resultText}>{recommendation}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9F1' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A231F' },
  content: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 16 },
  iconHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A231F', marginLeft: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: '#1C4E33', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  resultCard: { backgroundColor: '#E0F4D0', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#A3D868' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C4E33', marginBottom: 12 },
  resultText: { fontSize: 16, color: '#1A231F', lineHeight: 24 }
});
