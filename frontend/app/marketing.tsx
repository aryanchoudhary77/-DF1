import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/src/theme';

export default function MarketingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketing Zone</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Campaign Creatives</Text>
        <Text style={styles.sectionSub}>Download and share on WhatsApp or print for your store.</Text>

        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1592982537447-6f204c3e8006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
          style={styles.creativeCard}
          imageStyle={{ borderRadius: Theme.borderRadius.lg }}
        >
          <View style={styles.creativeOverlay} />
          <View style={styles.creativeContent}>
            <Text style={styles.creativeTitle}>Monsoon Mega Sale</Text>
            <Text style={styles.creativeDesc}>Share this poster to inform farmers about the 15% discount on all seeds.</Text>
            <View style={styles.creativeActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="download-outline" size={18} color={Theme.colors.text} />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <Text style={styles.sectionTitle}>Product Brochures (PDFs)</Text>
        <View style={styles.docRow}>
          <View style={styles.docIcon}><Ionicons name="document-text" size={24} color="#EF4444" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docTitle}>Chlorpyrifos Usage Guide</Text>
            <Text style={styles.docSub}>English & Hindi • 2.4 MB</Text>
          </View>
          <TouchableOpacity><Ionicons name="download-outline" size={24} color={Theme.colors.primary} /></TouchableOpacity>
        </View>

        <View style={styles.docRow}>
          <View style={styles.docIcon}><Ionicons name="document-text" size={24} color="#EF4444" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docTitle}>Hybrid Cotton Specifications</Text>
            <Text style={styles.docSub}>Gujarati • 1.1 MB</Text>
          </View>
          <TouchableOpacity><Ionicons name="download-outline" size={24} color={Theme.colors.primary} /></TouchableOpacity>
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
  sectionTitle: { ...Theme.typography.h3 },
  sectionSub: { ...Theme.typography.caption, marginBottom: Theme.spacing.md },
  creativeCard: { height: 200, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.xl, overflow: 'hidden' },
  creativeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  creativeContent: { flex: 1, padding: Theme.spacing.lg, justifyContent: 'flex-end' },
  creativeTitle: { ...Theme.typography.h2, color: '#FFF', marginBottom: 4 },
  creativeDesc: { ...Theme.typography.small, color: '#E5E7EB', marginBottom: 16 },
  creativeActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: Theme.borderRadius.round, gap: 6 },
  actionText: { ...Theme.typography.small, fontWeight: '700', color: Theme.colors.text },
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, marginBottom: Theme.spacing.sm, borderWidth: 1, borderColor: Theme.colors.border },
  docIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  docTitle: { ...Theme.typography.body, fontWeight: '600' },
  docSub: { ...Theme.typography.caption, marginTop: 2 }
});
