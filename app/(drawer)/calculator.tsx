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
import { formatCurrency } from '@/utils/formatter';
import { calculateNigeriaPAYE } from '@/utils/taxEnginex';

export default function PAYECalculator() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Input States
  const [grossIncome, setGrossIncome] = useState('');
  const [rentPaid, setRentPaid] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');

  // Deduction Toggles
  const [includePension, setIncludePension] = useState(true);
  const [includeNHF, setIncludeNHF] = useState(true);
  const [includeNHIS, setIncludeNHIS] = useState(true);
  const [showRentInput, setShowRentInput] = useState(false);

  const [showBreakdown, setShowBreakdown] = useState(false);

  const formatInput = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    return numeric ? Number(numeric).toLocaleString() : '';
  };

  const parseAmount = (value: string) => parseFloat(value.replace(/,/g, '')) || 0;

  const calculation = useMemo(() => {
    return calculateNigeriaPAYE(parseAmount(grossIncome), {
      includePension,
      includeNHF,
      includeNHIS,
      rentPaid: showRentInput ? parseAmount(rentPaid) : 0,
      otherDeductions: parseAmount(otherDeductions),
      is2026: true,
    });
  }, [grossIncome, includePension, includeNHF, includeNHIS, showRentInput, rentPaid, otherDeductions]);

  const handleCalculate = async () => {
    if (!grossIncome) {
      Alert.alert('Required Field', 'Please enter your annual gross income.');
      return;
    }

    await saveTaxRecord({
      id: Date.now().toString(),
      type: 'PAYE',
      title: 'PAYE / Personal Income Tax',
      userName: 'Salaried Employee',
      income: calculation.annualGross.toString(),
      tax: calculation.annualTax.toString(),
      net: calculation.annualNet.toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      year: '2026',
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(2);
  };
  const resetCalculator = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setGrossIncome('');
    setRentPaid('');
    setOtherDeductions('');

    setIncludePension(true);
    setIncludeNHF(true);
    setIncludeNHIS(true);
    setShowRentInput(false);

    setShowBreakdown(false);
    setStep(1);
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Header Section */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}> <Ionicons name='chevron-back-outline' /> Back</Text>
            </TouchableOpacity>

            <View style={styles.headerTextWrapper}>
              <Text style={styles.title}>PAYE / PIT Calculator</Text>
              <Text style={styles.subtitle}>
                Calculate your Personal Income Tax based on the latest 2026 Nigerian tax laws.
              </Text>
            </View>
          </View>

          <View style={{ padding: 20 }}>
            {step === 1 ? (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Annual Gross Income</Text>
                <TextInput
                  style={styles.mainInput}
                  value={grossIncome}
                  onChangeText={(t) => setGrossIncome(formatInput(t))}
                  keyboardType="numeric"
                  placeholder="₦ 0"
                  placeholderTextColor="#94a3b8"
                />

                <Text style={[styles.inputLabel, { marginTop: 25 }]}>Tax Relief & Deductions</Text>

                <DeductionToggle
                  label="Pension (8%)"
                  active={includePension}
                  onPress={() => setIncludePension(!includePension)}
                />
                <DeductionToggle
                  label="NHF (2.5%)"
                  active={includeNHF}
                  onPress={() => setIncludeNHF(!includeNHF)}
                />
                <DeductionToggle
                  label="NHIS (5%)"
                  active={includeNHIS}
                  onPress={() => setIncludeNHIS(!includeNHIS)}
                />
                <DeductionToggle
                  label="Rent Relief (Max ₦500k)"
                  active={showRentInput}
                  onPress={() => setShowRentInput(!showRentInput)}
                />

                {showRentInput && (
                  <TextInput
                    style={[styles.mainInput, { marginTop: 10 }]}
                    value={rentPaid}
                    onChangeText={(t) => setRentPaid(formatInput(t))}
                    keyboardType="numeric"
                    placeholder="Annual Rent Paid"
                    placeholderTextColor="#94a3b8"
                  />
                )}

                <Text style={[styles.inputLabel, { marginTop: 20 }]}>Other Deductions</Text>
                <TextInput
                  style={styles.mainInput}
                  value={otherDeductions}
                  onChangeText={(t) => setOtherDeductions(formatInput(t))}
                  keyboardType="numeric"
                  placeholder="₦ 0"
                  placeholderTextColor="#94a3b8"
                />

                <TouchableOpacity style={styles.proceedButton} onPress={handleCalculate}>
                  <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Salaried (PAYE / PIT) Result</Text>
                  <Text style={styles.resultValue}>{formatCurrency(calculation.annualTax)}</Text>
                  <Text style={styles.totalTaxDueLabel}>Total Tax Due</Text>
                </View>

                <View style={styles.summaryRow}>
                  <SummaryBox label="Gross Income" value={formatCurrency(calculation.annualGross)} />
                  <SummaryBox label="Net Income" value={formatCurrency(calculation.annualNet)} />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setShowBreakdown(!showBreakdown);
                  }}
                  style={styles.breakdownToggle}
                >
                  <Text style={{ fontWeight: '700' }}>View Tax Breakdown</Text>
                  <Ionicons name={showBreakdown ? 'chevron-up' : 'chevron-down'} size={20} />
                </TouchableOpacity>

                {showBreakdown && (
                  <View style={styles.breakdownCard}>
                    <Text style={styles.breakdownTitle}>Tax Calculation Breakdown</Text>

                    <DetailRow label="Rent Relief Deduction (20%)" value={`-#${(calculation.deductions.rentRelief).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    <DetailRow label="Pension Deduction (8%)" value={`-#${(calculation.deductions.pension).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    <DetailRow label="National Health Insurance Scheme Deduction (5%)" value={`-#${(calculation.deductions.nhis).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    <DetailRow label="National Housing Fund (2.5%)" value={`-#${(calculation.deductions.nhf).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    <DetailRow label="Other Deductions" value={`-#${(calculation.deductions.otherDeductions).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    <DetailRow label="Other Expenses" value={`-#0.00`} />

                    <DetailRow label="Total Deductions" value={`#${(calculation.deductions.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} bold />
                    <DetailRow label="Annual Taxable Income" value={`#${(calculation.taxableIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} bold />

                    <View style={styles.divider} />

                    <Text style={styles.breakdownSectionTitle}>Progressive Tax Band (Annual)</Text>
                    <DetailRow label="#0 - #800,000" value="0%" />
                    <DetailRow label="#800,001 - #3,000,000" value="15%" />
                    <DetailRow label="#3,000,001 - #12,000,000" value="18%" />
                    <DetailRow label="#12,000,001 - #25,000,000" value="21%" />
                    <DetailRow label="#25,000,001 - #50,000,000" value="23%" />
                    <DetailRow label="Above #50,000,000" value="25%" />

                    <View style={styles.divider} />

                    <Text style={styles.breakdownSectionTitle}>Break Down Your Tax</Text>
                    <DetailRow label="First #800,000" value="#0" />
                    <DetailRow
                        label={`Taxable Remaining = #${calculation.taxableIncome.toLocaleString()} - #800,000`}
                        value={`#${Math.max(0, calculation.taxableIncome - 800000).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    />
                    <DetailRow
                        label={`Tax 15% of #${Math.max(0, calculation.taxableIncome - 800000).toLocaleString()}`}
                        value={`#${calculation.annualTax.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
                    />

                    <View style={styles.divider} />

                    <DetailRow label="Total Annual Tax" value={`#${(calculation.annualTax).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    <DetailRow label="Monthly Tax" value={`#${(calculation.monthlyTax).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.proceedButton, { marginTop: 30 }]}
                  onPress={resetCalculator}
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

function DeductionToggle({ label, active, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkRow}>
      <Text style={styles.checkLabel}>{label}</Text>
      <Ionicons name={active ? 'checkbox' : 'square-outline'} size={24} color="#1e3a8a" />
    </TouchableOpacity>
  );
}

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
      <Text style={[styles.detailLabel, bold && { fontWeight: '600', color: '#1e293b' }]}>{label}</Text>
      <Text style={[styles.detailValue, bold && { fontWeight: '700', color: '#1e293b' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { 
    flexGrow: 1 
  },
  backText: { 
    color: Colors.card, 
    fontWeight: '700',
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
    width: 60
  },
  headerContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  backBtnContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  backBtnText: { 
    color: '#1e3a8a', 
    fontWeight: '600', 
    marginLeft: 4 
  },
  headerTextWrapper: { 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#1e3a8a' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#64748b', 
    textAlign: 'center', 
    marginTop: 8, 
    paddingHorizontal: 20 
  },
  formContainer: { marginTop: 10 },
  inputLabel: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  mainInput: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 15, fontSize: 16, backgroundColor: '#fcfcfc' },
  checkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  checkLabel: { fontSize: 14, color: '#475569', fontWeight: '500' },
  proceedButton: { backgroundColor: '#1e3a8a', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  proceedButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultCard: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  resultLabel: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  resultValue: { fontSize: 36, fontWeight: '900', color: '#1e3a8a', marginVertical: 8 },
  totalTaxDueLabel: { color: '#64748b', fontSize: 14 },
  summaryRow: { flexDirection: 'row', gap: 12, marginVertical: 20 },
  summaryBox: { flex: 1, backgroundColor: '#f1f5f9', padding: 16, borderRadius: 12 },
  summaryLabel: { color: '#64748b', fontSize: 12, marginBottom: 4 },
  summaryValue: { fontWeight: '800', fontSize: 15, color: '#000' },
  breakdownToggle: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderRadius: 12, backgroundColor: '#f1f5f9' },
  breakdownCard: { padding: 20, borderRadius: 8, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#d1d5db', marginTop: 15 },
  breakdownTitle: { fontSize: 18, fontWeight: '700', color: '#1e3a8a', marginBottom: 20 },
  breakdownSectionTitle: { fontSize: 15, fontWeight: '700', color: '#4b5563', marginTop: 10, marginBottom: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { color: '#4b5563', fontSize: 13, flex: 1 },
  detailValue: { color: '#4b5563', fontSize: 13, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#d1d5db', marginVertical: 15 },
});