import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, styles as globalStyles } from '../../constants/calculatorstyles';
import { formatCurrency } from '../../utils/formatter';
import { saveTaxRecord } from '../../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ============================
   NIGERIA PIT TAX BANDS (ANNUAL)
============================ */
const TAX_BANDS = [
  { limit: 800_000, rate: 0 },
  { limit: 3_000_000, rate: 0.15 },
  { limit: 12_000_000, rate: 0.18 },
  { limit: 25_000_000, rate: 0.21 },
  { limit: 50_000_000, rate: 0.23 },
  { limit: Infinity, rate: 0.25 },
];

export default function FreelancerTaxCalculator() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [grossIncome, setGrossIncome] = useState('');
  const [pension, setPension] = useState('');
  const [businessExpenses, setBusinessExpenses] = useState('');

  /* ---------------- HELPERS ---------------- */
  const formatInput = (text: string) =>
    text.replace(/[^0-9]/g, '')
      ? Number(text.replace(/[^0-9]/g, '')).toLocaleString()
      : '';

  const parse = (v: string) => Number(v.replace(/,/g, '')) || 0;

  /* ---------------- CALCULATION ---------------- */
  const calculation = useMemo(() => {
    const gross = parse(grossIncome);
    const pensionVal = parse(pension);
    const expensesVal = parse(businessExpenses);

    const totalDeductions = pensionVal + expensesVal;
    const taxableIncome = Math.max(gross - totalDeductions, 0);

    let remaining = taxableIncome;
    let lastLimit = 0;
    let totalTax = 0;

    const bandBreakdown: any[] = [];

    for (const band of TAX_BANDS) {
      if (remaining <= 0) break;

      const bandSize = band.limit - lastLimit;
      const taxableAtBand = Math.min(remaining, bandSize);
      const taxForBand = taxableAtBand * band.rate;

      bandBreakdown.push({
        range:
          band.limit === Infinity
            ? `Above ₦${formatCurrency(lastLimit)}`
            : `${formatCurrency(lastLimit)} - ${formatCurrency(
                band.limit
              )}`,
        rate: `${band.rate * 100}%`,
        taxable: taxableAtBand,
        tax: taxForBand,
      });

      totalTax += taxForBand;
      remaining -= taxableAtBand;
      lastLimit = band.limit;
    }

    return {
      gross,
      pensionVal,
      expensesVal,
      totalDeductions,
      taxableIncome,
      totalTax,
      monthlyTax: totalTax / 12,
      netIncome: gross - totalTax,
      bandBreakdown,
    };
  }, [grossIncome, pension, businessExpenses]);

  /* ---------------- ACTION ---------------- */
  const handleCalculate = async () => {
    if (!grossIncome) {
      Alert.alert('Error', 'Enter your gross income');
      return;
    }

    await saveTaxRecord({
      id: Date.now().toString(),
      type: 'FREELANCE',
      title: 'Freelancer PIT',
      userName: 'Self Employed',
      income: calculation.gross.toString(),
      tax: calculation.totalTax.toString(),
      net: calculation.netIncome.toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      year: '2026',
    });

    setStep(2);
  };

  const resetCalculator = () => {
    setGrossIncome('');
    setPension('');
    setBusinessExpenses('');

    setShowBreakdown(false);
    setStep(1);
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.safeArea}
      >
        <ScrollView contentContainerStyle={globalStyles.scroll}>
          <View style={{ padding: 20, paddingTop: 30 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}> <Ionicons name='chevron-back-outline' /> Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: '800', marginTop: 10, color: Colors.primary }}>
              Freelancers / Self-Employed (PIT)
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            {step === 1 ? (
              <View style={globalStyles.stepCard}>
                <Text style={globalStyles.cardTitle}>Gross Annual Income</Text>
                <TextInput
                  style={globalStyles.input}
                  keyboardType="numeric"
                  placeholder="₦ 0"
                  value={grossIncome}
                  onChangeText={(t) => setGrossIncome(formatInput(t))}
                />

                <Text style={[globalStyles.cardTitle, { marginTop: 15 }]}>
                  Pension Deduction
                </Text>
                <TextInput
                  style={globalStyles.input}
                  keyboardType="numeric"
                  placeholder="₦ 0"
                  value={pension}
                  onChangeText={(t) => setPension(formatInput(t))}
                />

                <Text style={[globalStyles.cardTitle, { marginTop: 15 }]}>
                  Business Expenses (100%)
                </Text>
                <TextInput
                  style={globalStyles.input}
                  keyboardType="numeric"
                  placeholder="₦ 0"
                  value={businessExpenses}
                  onChangeText={(t) => setBusinessExpenses(formatInput(t))}
                />

                <TouchableOpacity
                  style={[globalStyles.primaryButton, { marginTop: 25 }]}
                  onPress={handleCalculate}
                >
                  <Text style={globalStyles.primaryButtonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* RESULT SUMMARY */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, color: Colors.secondaryText }}>
                    Total Tax Due
                  </Text>
                  <Text style={{ fontSize: 40, fontWeight: '900', color: Colors.primary }}>
                    {formatCurrency(calculation.totalTax)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <SummaryCard
                    label="Gross Income"
                    value={formatCurrency(calculation.gross)}
                  />
                  <SummaryCard
                    label="Net Income"
                    value={formatCurrency(calculation.netIncome)}
                  />
                </View>

                {/* BREAKDOWN */}
                <TouchableOpacity
                  onPress={() => setShowBreakdown(!showBreakdown)}
                  style={{
                    marginTop: 20,
                    backgroundColor: '#fff',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: Colors.border,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontWeight: '700' }}>View Tax Breakdown</Text>
                  <Ionicons
                    name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                  />
                </TouchableOpacity>

                {showBreakdown && (
                  <View style={{ marginTop: 15, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12 }}>
                    <Text style={{ fontWeight: '800', color: Colors.primary, marginBottom: 10 }}>
                      Tax Calculation Breakdown
                    </Text>

                    <BreakdownRow label="Business Expenses (100%)" value={`-${formatCurrency(calculation.expensesVal)}`} />
                    <BreakdownRow label="Pension Deduction" value={`-${formatCurrency(calculation.pensionVal)}`} />

                    {/* Horizontal Line added between Pension and Total Deductions */}
                    <View style={{ marginVertical: 8, borderBottomWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' }} />

                    <BreakdownRow
                        label="Total Deductions"
                        value={`${formatCurrency(calculation.totalDeductions)}`}
                        bold
                    />
                    <BreakdownRow
                        label="Annual Taxable Income"
                        value={formatCurrency(calculation.taxableIncome)}
                        bold
                    />

                    <View style={{ marginVertical: 12, borderBottomWidth: 1, borderColor: Colors.border }} />

                    <Text style={{ fontWeight: '700', marginBottom: 8 }}>
                      Progressive Tax Band (Annual)
                    </Text>

                    {calculation.bandBreakdown.map((b, i) => (
                      <BreakdownRow
                        key={i}
                        label={`${b.range} @ ${b.rate}`}
                        value={formatCurrency(b.tax)}
                      />
                    ))}

                    <View style={{ marginVertical: 12, borderBottomWidth: 1, borderColor: Colors.border }} />

                    <BreakdownRow
                      label="Total Annual Tax"
                      value={formatCurrency(calculation.totalTax)}
                      bold
                      color={Colors.error}
                    />
                    <BreakdownRow
                      label="Monthly Tax"
                      value={formatCurrency(calculation.monthlyTax)}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={[globalStyles.primaryButton, { marginTop: 25 }]}
                  onPress={resetCalculator}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Calculate Another Tax
                  </Text>
                </TouchableOpacity>

              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
}

/* ============================
   SMALL COMPONENTS
============================ */
function SummaryCard({ label, value }: any) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <Text style={{ fontSize: 12, color: Colors.secondaryText }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

function BreakdownRow({ label, value, bold, color }: any) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{
        fontSize: 13,
        color: bold ? Colors.text : Colors.secondaryText,
        fontWeight: bold ? '700' : '400'
      }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: bold ? '800' : '600',
          color: color || Colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  backText: { 
    color: Colors.card, 
    fontWeight: '700',
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
    width: 60
  },
})