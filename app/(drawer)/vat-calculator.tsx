import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Shared utilities
import { saveTaxRecord } from '@/utils/storage';
import { Colors } from '@/constants/calculatorstyles';

// Updated Categories from "VAT CALCULATION.png"
const VAT_TYPES = [
  { id: 'domestic', label: 'Domestic sale/Purchase 7.5%', rate: 0.075 },
  { id: 'export', label: 'Export/International 0%', rate: 0 },
  { id: 'digital', label: 'Digital Services 7.5%', rate: 0.075 },
  { id: 'exempt', label: 'Exempt Items (no VAT)', rate: 0 },
];

export default function VATCalculator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('200,000'); // Default from your screenshot
  const [isAddingVAT, setIsAddingVAT] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>(['domestic']);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const formatInput = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    return numeric ? Number(numeric).toLocaleString() : '';
  };

  const parseAmount = (value: string) => parseFloat(value.replace(/,/g, '')) || 0;

  // Custom formatter for the "#" symbol seen in your results screenshots
  const imgFormat = (val: number) =>
    `#${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const calculation = useMemo(() => {
    const baseAmount = parseAmount(amount);
    const selectedRates = VAT_TYPES.filter(type => selectedIds.includes(type.id));

    const items = selectedRates.map(item => {
      let itemVat = 0;
      if (item.rate > 0) {
        // Adding VAT: Amount * 7.5%
        // Removing VAT: Amount - (Amount / 1.075)
        itemVat = isAddingVAT
          ? baseAmount * item.rate
          : (baseAmount - (baseAmount / (1 + item.rate)));
      }
      return { ...item, calculatedVat: itemVat };
    });

    const totalVatAmount = items.reduce((sum, item) => sum + item.calculatedVat, 0);
    const finalResult = isAddingVAT ? baseAmount + totalVatAmount : baseAmount - totalVatAmount;

    return {
      baseAmount,
      totalVatAmount,
      finalResult,
      items,
      summaryLabels: selectedRates.map(r => r.label).join(', '),
    };
  }, [amount, selectedIds, isAddingVAT]);

  const handleCalculate = async () => {
    if (!amount) {
      Alert.alert('Missing Amount', 'Please enter a transaction amount.');
      return;
    }

    await saveTaxRecord({
      id: Date.now().toString(),
      type: 'VAT',
      title: 'VAT Result',
      userName: calculation.summaryLabels,
      income: calculation.baseAmount.toString(),
      tax: calculation.totalVatAmount.toString(),
      net: calculation.finalResult.toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      year: '2026',
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(2);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Header Section */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtnContainer}>
               <Ionicons name="chevron-back-outline" size={18} color="#153d8a" />
               <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.headerTextWrapper}>
              <Text style={styles.title}>{step === 1 ? 'VAT Calculation' : 'VAT Result'}</Text>
              {step === 1 && (
                <Text style={styles.subtitle}>
                  Quickly add or remove tax from your prices using the latest 2026 rates.
                </Text>
              )}
            </View>
          </View>

          <View style={{ padding: 20 }}>
            {step === 1 ? (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Transaction Amount</Text>
                <TextInput
                  style={styles.mainInput}
                  value={amount}
                  onChangeText={(t) => setAmount(formatInput(t))}
                  keyboardType="numeric"
                  placeholder="200,000"
                  placeholderTextColor="#94a3b8"
                />

                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, isAddingVAT && styles.toggleBtnActive]}
                    onPress={() => setIsAddingVAT(true)}
                  >
                    <Text style={[styles.toggleBtnText, isAddingVAT && styles.toggleBtnTextActive]}>+Add VAT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleBtn, !isAddingVAT && styles.toggleBtnActive]}
                    onPress={() => setIsAddingVAT(false)}
                  >
                    <Text style={[styles.toggleBtnText, !isAddingVAT && styles.toggleBtnTextActive]}>-Remove VAT</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputLabel, { marginTop: 25 }]}>Transaction type</Text>
                <View style={styles.gridContainer}>
                  {VAT_TYPES.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.gridItem, isSelected && styles.gridItemActive]}
                        onPress={() => setSelectedIds([item.id])} // Single selection based on your radio-style image
                      >
                        <Text style={[styles.gridLabel, isSelected && { color: '#153d8a' }]}>{item.label}</Text>
                        <Ionicons
                          name={isSelected ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={isSelected ? '#153d8a' : '#cbd5e1'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.proceedButton} onPress={handleCalculate}>
                  <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* Result Card styled like vathalfresult.png */}
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>VAT Result</Text>
                  <Text style={styles.resultValue}>{imgFormat(calculation.totalVatAmount)}</Text>
                  <Text style={styles.totalTaxDueLabel}>VAT Amount(7.5%)</Text>
                </View>

                <View style={styles.summaryRow}>
                  <SummaryBox
                    label="Transaction Amount( Excluding VAT)"
                    value={imgFormat(isAddingVAT ? calculation.baseAmount : calculation.finalResult)}
                  />
                  <SummaryBox
                    label="Total Amount( Including VAT)"
                    value={imgFormat(isAddingVAT ? calculation.finalResult : calculation.baseAmount)}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setShowBreakdown(!showBreakdown);
                  }}
                  style={styles.breakdownToggle}
                >
                  <Text style={{ fontWeight: '600', color: '#153d8a' }}>View Tax Breakdown</Text>
                  <Ionicons name={showBreakdown ? 'chevron-up' : 'chevron-down'} size={20} color="#153d8a" />
                </TouchableOpacity>

                {showBreakdown && (
                  <View style={styles.breakdownCard}>
                    <Text style={styles.breakdownTitle}>Tax Calculation Breakdown</Text>

                    <DetailRow
                      label={isAddingVAT ? "Amount (Excl. VAT)" : "Amount (Incl. VAT)"}
                      value={imgFormat(calculation.baseAmount)}
                    />

                    {calculation.items.map((item) => (
                      <DetailRow
                        key={item.id}
                        label={`VAT ${item.label}`}
                        value={`${isAddingVAT ? '+' : '-'} ${imgFormat(item.calculatedVat)}`}
                      />
                    ))}

                    <View style={styles.divider} />

                    <DetailRow
                      label={isAddingVAT ? "Total Payable" : "Net Amount"}
                      value={imgFormat(calculation.finalResult)}
                      bold
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.proceedButton, { marginTop: 30 }]}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.proceedButtonText}>New Calculation</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ===================== SUB-COMPONENTS ===================== */

function SummaryBox({ label, value }: any) {
  return (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function DetailRow({ label, value, bold }: any) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, bold && { fontWeight: '700', color: '#1e293b' }]}>{label}</Text>
      <Text style={[styles.detailValue, bold && { fontWeight: '700', color: '#153d8a' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  headerContainer: { paddingHorizontal: 20, paddingTop: 10 },
  backBtnContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backBtnText: { color: '#153d8a', fontWeight: '600', marginLeft: 4 },
  headerTextWrapper: { alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#153d8a', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 8, paddingHorizontal: 30 },
  formContainer: { marginTop: 10 },
  inputLabel: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8 },
  mainInput: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 15, fontSize: 16, color: '#000' },
  toggleRow: { flexDirection: 'row', gap: 12, marginTop: 15 },
  toggleBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#153d8a', borderColor: '#153d8a' },
  toggleBtnText: { fontWeight: '700', color: '#1e293b' },
  toggleBtnTextActive: { color: '#fff' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginVertical: 6 },
  gridItemActive: { borderColor: '#153d8a', backgroundColor: '#f0f4ff' },
  gridLabel: { fontSize: 12, fontWeight: '600', color: '#475569', flex: 1 },
  proceedButton: { backgroundColor: '#153d8a', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 40 },
  proceedButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultCard: { alignItems: 'center', paddingVertical: 40, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  resultLabel: { color: '#4b5563', fontSize: 16, fontWeight: '500' },
  resultValue: { fontSize: 42, fontWeight: '700', color: '#153d8a', marginVertical: 10 },
  totalTaxDueLabel: { color: '#4b5563', fontSize: 16 },
  summaryRow: { flexDirection: 'row', gap: 12, marginVertical: 25 },
  summaryBox: { flex: 1, backgroundColor: '#f3f4f6', padding: 18, borderRadius: 16 },
  summaryLabel: { color: '#4b5563', fontSize: 13, marginBottom: 8 },
  summaryValue: { fontWeight: '800', fontSize: 16, color: '#000' },
  breakdownToggle: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center' },
  breakdownCard: { padding: 20, borderRadius: 16, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', marginTop: 20 },
  breakdownTitle: { fontSize: 18, fontWeight: '700', color: '#153d8a', marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { color: '#4b5563', fontSize: 14 },
  detailValue: { color: '#4b5563', fontSize: 14, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 15 },
});