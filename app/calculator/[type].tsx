import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { calculateNigeriaTax } from '../../utils/taxEngine';
import { formatCurrency } from '../../utils/formatter';

export default function ResultScreen() {
  const router = useRouter();
  const { type, amount, year } = useLocalSearchParams();

  // Convert params to usable types
  const isPost2026 = year === '2026';
  const grossIncome = parseFloat(amount as string);

  // Perform calculation once using useMemo for performance
  const results = useMemo(() =>
    calculateNigeriaTax(grossIncome, isPost2026),
    [grossIncome, isPost2026]
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{type === 'paye' ? 'PAYE Summary' : 'PIT Estimate'}</Text>
        <Text style={styles.subtitle}>Tax Year: {year}</Text>
      </View>

      {/* Main Result Card - PRD Section 9 */}
      <View style={styles.mainCard}>
        <Text style={styles.label}>Take-Home (Monthly)</Text>
        <Text style={styles.netAmount}>{formatCurrency(results.netIncome / 12)}</Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Total Annual Tax</Text>
          <Text style={styles.rowValue}>{formatCurrency(results.annualTax)}</Text>
        </View>
      </View>

      {/* Plain English Breakdown - PRD Section 2 & 9 */}
      <Text style={styles.sectionTitle}>How was this calculated?</Text>

      <View style={styles.breakdownCard}>
        <Step
          title="1. Statutory Deduction"
          desc="8% of your gross income is set aside for your pension before tax is applied."
          value={`- ${formatCurrency(grossIncome * 0.08)}`}
        />
        <Step
          title={isPost2026 ? "2. Tax-Free Threshold" : "2. Consolidated Relief (CRA)"}
          desc={isPost2026
            ? "Under the 2026 Act, the first ₦800,000 of your income is 100% tax-free."
            : "A portion of your income is protected from tax to reduce your burden."}
          value={`- ${formatCurrency(results.reliefAmount)}`}
        />
        <Step
          title="3. Taxable Income"
          desc="This is the amount the government actually applies tax rates to."
          value={formatCurrency(results.taxableIncome)}
          isTotal
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>RE-CALCULATE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Small helper component for the Breakdown steps
function Step({ title, desc, value, isTotal = false }: any) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepTextContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>
      <Text style={[styles.stepValue, isTotal && styles.totalValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  header: { padding: 30, backgroundColor: '#006837', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#A5D6A7', fontSize: 16 },
  mainCard: { margin: 20, marginTop: -30, backgroundColor: '#FFF', borderRadius: 15, padding: 25, elevation: 5 },
  label: { color: '#666', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  netAmount: { fontSize: 36, fontWeight: '900', color: '#333', marginVertical: 10 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: '#666', fontWeight: '600' },
  rowValue: { color: '#D32F2F', fontWeight: 'bold' },
  sectionTitle: { marginLeft: 25, fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  breakdownCard: { margin: 20, backgroundColor: '#FFF', borderRadius: 15, padding: 20 },
  stepContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  stepTextContent: { flex: 0.7 },
  stepTitle: { fontWeight: 'bold', color: '#333' },
  stepDesc: { fontSize: 12, color: '#777', marginTop: 2 },
  stepValue: { fontWeight: '600', color: '#444' },
  totalValue: { color: '#006837', fontSize: 16 },
  backButton: { margin: 20, padding: 18, alignItems: 'center' },
  backButtonText: { color: '#006837', fontWeight: 'bold' }
});