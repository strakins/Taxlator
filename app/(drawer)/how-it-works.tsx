import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/calculatorstyles';

export default function HowItWorks() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Tax Guidelines' }} />

      <Text style={styles.mainTitle}>Understanding 2026 Tax Laws</Text>
      <Text style={styles.intro}>
        Taxlator is updated with the latest Nigerian Fiscal Reforms to help you plan your finances accurately.
      </Text>

      {/* SECTION 1: PAYE */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={24} color={Colors.primary} />
          <Text style={styles.cardTitle}>Personal Income Tax (PAYE)</Text>
        </View>
        <Text style={styles.bodyText}>
          The 2026 reform simplifies deductions. The standard <Text style={styles.bold}>8% Pension</Text>, <Text style={styles.bold}>5% NHIS</Text>, and <Text style={styles.bold}>2.5% NHF</Text> remain deductible from your Gross Income before tax is applied.
        </Text>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            💡 <Text style={styles.bold}>New for 2026:</Text> Rent Relief is now capped at ₦500,000 or 20% of your Gross Income, whichever is lower.
          </Text>
        </View>
      </View>

      {/* SECTION 2: VAT */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="receipt" size={24} color="#f59e0b" />
          <Text style={styles.cardTitle}>Value Added Tax (VAT)</Text>
        </View>
        <Text style={styles.bodyText}>
          The standard VAT rate for 2026 is <Text style={styles.bold}>10%</Text>. Taxlator allows you to:
        </Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Add VAT:</Text> Calculate total cost for exclusive prices.</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>VAT Inclusive:</Text> Extract the tax amount from a total price.</Text>
      </View>

      {/* SECTION 3: CIT */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="business" size={24} color="#10b981" />
          <Text style={styles.cardTitle}>Company Income Tax (CIT)</Text>
        </View>
        <Text style={styles.bodyText}>
          CIT depends on company size:
        </Text>
        <View style={styles.table}>
            <View style={styles.tableRow}><Text style={styles.tableCell}>Small (Under ₦25m)</Text><Text style={styles.tableVal}>0%</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCell}>Medium (₦25m - ₦100m)</Text><Text style={styles.tableVal}>20%</Text></View>
            <View style={styles.tableRow}><Text style={styles.tableCell}>Large (Over ₦100m)</Text><Text style={styles.tableVal}>30%</Text></View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.firsButton}
        onPress={() => Linking.openURL('https://firs.gov.ng')}
      >
        <Text style={styles.firsButtonText}>Read Official FIRS Docs</Text>
        <Ionicons name="open-outline" size={18} color="white" />
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Note: Taxlator provides estimates based on current laws. Consult a certified tax professional for legal filings.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingBottom: 40 },
  mainTitle: { fontSize: 26, fontWeight: '900', color: Colors.primary, marginBottom: 10 },
  intro: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 25 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  bodyText: { fontSize: 14, color: '#475569', lineHeight: 20 },
  bold: { fontWeight: '700', color: '#0f172a' },
  highlightBox: { marginTop: 15, padding: 12, backgroundColor: '#eff6ff', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  highlightText: { fontSize: 13, color: '#1e40af', lineHeight: 18 },
  listItem: { fontSize: 14, color: '#475569', marginTop: 8, marginLeft: 5 },
  table: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tableCell: { fontSize: 13, color: '#64748b' },
  tableVal: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  firsButton: { backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 16, borderRadius: 12, marginTop: 10 },
  firsButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disclaimer: { textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 30, fontStyle: 'italic' }
});