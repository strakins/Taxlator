import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { calculateNigeriaPAYE } from '../../utils/taxEnginex';
import { Colors } from '../../constants/calculatorstyles';
import { saveTaxRecord } from '@/utils/storage';


if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ===================== HELPERS ===================== */
const formatWithCommas = (value: string) => {
  const numeric = value.replace(/[^0-9]/g, '');
  if (!numeric) return '';
  return Number(numeric).toLocaleString();
};

const parseCurrency = (value: string) =>
  Number(value.replace(/,/g, '')) || 0;

const formatCurrency = (n: number) =>
  `₦${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;

const HISTORY_KEY = '@taxlator_history';

/* ===================== COMPONENT ===================== */
export default function TaxlatorCalculator() {
  const [step, setStep] = useState<'form' | 'result'>('form');

  const [grossIncome, setGrossIncome] = useState('');
  const [rent, setRent] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');

  const [includePension, setIncludePension] = useState(true);
  const [includeNHF, setIncludeNHF] = useState(true);
  const [includeNHIS, setIncludeNHIS] = useState(true);
  const [includeRent, setIncludeRent] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [showBreakdown, setShowBreakdown] = useState(false);

  /* ===================== VALIDATION ===================== */
  const validate = () => {
    const e: any = {};

    if (!grossIncome) e.grossIncome = 'Gross income is required';
    if (includeRent && !rent)
      e.rent = 'Rent amount is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ===================== CALCULATION ===================== */
  const calculation = useMemo(() => {
    return calculateNigeriaPAYE(parseCurrency(grossIncome), {
      includePension,
      includeNHF,
      includeNHIS,
      rentPaid: includeRent ? parseCurrency(rent) : 0,
      otherDeductions: parseCurrency(otherDeductions),
      is2026: true,
    });
  }, [
    grossIncome,
    rent,
    otherDeductions,
    includePension,
    includeNHF,
    includeNHIS,
    includeRent,
  ]);

  /* ===================== ACTIONS ===================== */
  const handleProceed = async () => {
  if (!validate()) return;

  const record = {
    id: Date.now().toString(),
    type: 'PAYE',
    title: 'PAYE / Personal Income Tax',
    userName: 'Salaried Employee',
    income: calculation.annualGross.toString(),
    tax: calculation.annualTax.toString(),
    net: calculation.annualNet.toString(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    year: '2026',

    // 👇 Optional extended payload (safe to store)
    meta: {
      CRA: calculation.CRA,
      taxableIncome: calculation.taxableIncome,
      monthlyTax: calculation.monthlyTax,
      deductions: calculation.deductions,
      breakdown: calculation.breakdown,
    },
  };

  await saveTaxRecord(record);

  LayoutAnimation.configureNext(
    LayoutAnimation.Presets.easeInEaseOut
  );
  setStep('result');
};



  const resetCalculator = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setGrossIncome('');
    setRent('');
    setOtherDeductions('');
    setIncludePension(true);
    setIncludeNHF(true);
    setIncludeNHIS(true);
    setIncludeRent(false);
    setErrors({});
    setShowBreakdown(false);
    setStep('form');
  };

  /* ===================== RENDER ===================== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {step === 'form' ? (
          <>
            <Text style={styles.header}>
              PAYE / PIT Calculator
            </Text>

            <Text style={styles.label}>
              Annual Gross Income
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.grossIncome && styles.errorInput,
              ]}
              keyboardType="numeric"
              placeholder="₦ 0"
              value={grossIncome}
              onChangeText={t =>
                setGrossIncome(formatWithCommas(t))
              }
            />
            {errors.grossIncome && (
              <Text style={styles.errorText}>
                {errors.grossIncome}
              </Text>
            )}

            

            {renderCheck(
              'Pension (8%)',
              includePension,
              setIncludePension
            )}
            {renderCheck(
              'NHF (2.5%)',
              includeNHF,
              setIncludeNHF
            )}
            {renderCheck(
              'NHIS (5%)',
              includeNHIS,
              setIncludeNHIS
            )}
            {renderCheck(
              'Rent Relief (20%)',
              includeRent,
              setIncludeRent
            )}

            {includeRent && (
              <>
                <TextInput
                  style={[
                    styles.input,
                    errors.rent && styles.errorInput,
                  ]}
                  keyboardType="numeric"
                  placeholder="Annual Rent Paid"
                  value={rent}
                  onChangeText={t =>
                    setRent(formatWithCommas(t))
                  }
                />
                {errors.rent && (
                  <Text style={styles.errorText}>
                    {errors.rent}
                  </Text>
                )}
              </>
            )}

            <Text style={styles.label}>
              Other Deductions
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="₦ 0"
              value={otherDeductions}
              onChangeText={t =>
                setOtherDeductions(formatWithCommas(t))
              }
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleProceed}
            >
              <Text style={styles.primaryButtonText}>
                Proceed
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* ================= RESULT ================= */}
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>
                Salaried (PAYE / PIT) Result
              </Text>
              <Text style={styles.resultValue}>
                {formatCurrency(calculation.annualTax)}
              </Text>
              <Text style={styles.subText}>
                Total Tax Due
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <SummaryBox
                label="Gross Income"
                value={formatCurrency(
                  calculation.annualGross
                )}
              />
              <SummaryBox
                label="Net Income"
                value={formatCurrency(
                  calculation.annualNet
                )}
              />
            </View>

            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() =>
                setShowBreakdown(v => !v)
              }
            >
              <Text style={{ fontWeight: '700' }}>
                View Tax Breakdown
              </Text>
              <Ionicons
                name={
                  showBreakdown
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={20}
              />
            </TouchableOpacity>

            {showBreakdown && (
              <View style={styles.breakdownCard}>
                <Section title="Tax Calculation Breakdown" />

                <Row
                  label="Consolidated Relief Allowance (CRA)"
                  value={`-${formatCurrency(calculation.CRA)}`}
                />

                <Row
                  label="• 20% of Gross Income"
                  value={`-${formatCurrency(calculation.annualGross * 0.2)}`}
                />

                <Row
                  label="• Statutory Relief (₦200,000)"
                  value={`-${formatCurrency(
                    Math.max(200_000, calculation.annualGross * 0.01)
                  )}`}
                />

                <Divider />

                <Row
                  label="Pension Deduction (8%)"
                  value={`-${formatCurrency(calculation.deductions.pension)}`}
                />
                <Row
                  label="NHF Deduction (2.5%)"
                  value={`-${formatCurrency(calculation.deductions.nhf)}`}
                />
                <Row
                  label="NHIS Deduction (5%)"
                  value={`-${formatCurrency(calculation.deductions.nhis)}`}
                />

                <Row
                  label="NHF Deduction (2.5%)"
                  value={`-${formatCurrency(
                    calculation.deductions.nhf
                  )}`}
                />
                <Row
                  label="Other Deductions"
                  value={`-${formatCurrency(
                    calculation.deductions.otherDeductions
                  )}`}
                />

                <Divider />

                <BoldRow
                  label="Total Deductions"
                  value={formatCurrency(calculation.deductions.total)}
                />
                <BoldRow
                  label="Annual Taxable Income"
                  value={formatCurrency(
                    calculation.taxableIncome
                  )}
                />

                <Section title="Break Down Your Tax" />

                {calculation.breakdown.map((b, i) => (
                  <Row
                    key={i}
                    label={`${b.range} @ ${b.rate}`}
                    value={formatCurrency(b.tax)}
                  />
                ))}

                <Divider />

                <BoldRow
                  label="Total Annual Tax"
                  value={formatCurrency(
                    calculation.annualTax
                  )}
                  color={Colors.error}
                />
                <BoldRow
                  label="Monthly Tax"
                  value={formatCurrency(
                    calculation.monthlyTax
                  )}
                />
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { marginTop: 30 },
              ]}
              onPress={resetCalculator}
            >
              <Text style={styles.primaryButtonText}>
                Calculate Another Tax
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===================== UI HELPERS ===================== */
const renderCheck = (
  label: string,
  value: boolean,
  setValue: (v: boolean) => void
) => (
  <TouchableOpacity
    onPress={() => setValue(!value)}
    style={styles.checkRow}
  >
    <Text>{label}</Text>
    <Ionicons
      name={value ? 'checkbox' : 'square-outline'}
      size={22}
      color={Colors.primary}
    />
  </TouchableOpacity>
);

const Section = ({ title }: any) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.subtleText}>{label}</Text>
    <Text style={styles.subtleText}>{value}</Text>
  </View>
);

const BoldRow = ({ label, value, color }: any) => (
  <View style={styles.row}>
    <Text style={styles.boldText}>{label}</Text>
    <Text
      style={[
        styles.boldText,
        color && { color },
      ]}
    >
      {value}
    </Text>
  </View>
);

const Divider = () => (
  <View style={styles.divider} />
);

const SummaryBox = ({ label, value }: any) => (
  <View style={styles.summaryBox}>
    <Text style={styles.subtleText}>{label}</Text>
    <Text style={styles.boldText}>{value}</Text>
  </View>
);

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 20,
  },
  label: { fontWeight: '700', marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
  },
  errorInput: { borderColor: Colors.error },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultCard: {
    alignItems: 'center',
    marginVertical: 25,
  },
  resultLabel: {
    color: Colors.secondaryText,
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
  },
  subText: { color: Colors.secondaryText },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
  },
  breakdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#e2e8f0',
  },
  breakdownCard: {
    backgroundColor: '#f8fafc',
    padding: 18,
    borderRadius: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  sectionTitle: {
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  subtleText: {
    color: Colors.secondaryText,
  },
  boldText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
});
