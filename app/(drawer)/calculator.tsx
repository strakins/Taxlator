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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Imports from shared constants and logic
import { Colors, styles as globalStyles } from '../../constants/calculatorstyles';
import { calculateNigeriaTax } from '../../utils/taxEngine';
import { formatCurrency } from '../../utils/formatter';
import { saveTaxRecord } from '../../utils/storage';

export default function TaxlatorCalculator() {
  const router = useRouter();
  const { year } = useLocalSearchParams();
  const is2026 = year === '2026';

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [userName, setUserName] = useState('');
  const [grossIncome, setGrossIncome] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');
  const [rentAmount, setRentAmount] = useState('');

  const [includePension, setIncludePension] = useState(true);
  const [includeRent, setIncludeRent] = useState(false);
  const [includeNHIS, setIncludeNHIS] = useState(false);
  const [includeNHF, setIncludeNHF] = useState(false);

  // --- HELPERS ---
  const formatInput = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return Number(numericValue).toLocaleString();
  };

  const parseCurrency = (value: string) => parseFloat(value.replace(/,/g, '')) || 0;

  // --- CALCULATION ENGINE ---
  const calculation = useMemo(() => {
    const rawGross = parseCurrency(grossIncome);
    const annualGross = period === 'monthly' ? rawGross * 12 : rawGross;

    const pension = includePension ? annualGross * 0.08 : 0;
    const nhf = includeNHF ? annualGross * 0.025 : 0;
    const nhis = includeNHIS ? annualGross * 0.05 : 0;

    const other = parseCurrency(otherDeductions);
    const annualOther = period === 'monthly' ? other * 12 : other;

    const rawRent = parseCurrency(rentAmount);
    // Updated engine call
    const taxResult = calculateNigeriaTax(annualGross, is2026, includeRent ? rawRent : 0);

    const annualTax = taxResult.annualTax;
    const annualNet = annualGross - annualTax - (pension + nhf + nhis + annualOther);
    const monthlyNet = annualNet / 12;

    return {
      annualGross,
      monthlyGross: annualGross / 12,
      annualTax,
      monthlyTax: annualTax / 12,
      annualNet,
      monthlyNet,
      deductions: {
        pension,
        nhf,
        nhis,
        other: annualOther,
        rent: includeRent ? (is2026 ? Math.min(rawRent * 0.2, 500000) : 0) : 0,
      },
      effectiveTaxable: taxResult.taxableIncome
    };
  }, [grossIncome, period, includePension, includeNHF, includeNHIS, includeRent, rentAmount, otherDeductions, is2026]);

  // --- SAVE & CALCULATE ---
  const handleCalculate = async () => {
    if (!grossIncome) {
      Alert.alert("Error", "Please enter your income.");
      return;
    }

    // Unified record format for History screen
    const record = {
      id: Date.now().toString(),
      type: 'PAYE',
      title: userName || 'Employee Assessment',
      userName: userName || 'Guest User',
      income: calculation.annualGross.toString(), // Base Income
      tax: calculation.annualTax.toString(),      // Tax Amount
      net: calculation.annualNet.toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      year: is2026 ? '2026' : '2025',
    };

    await saveTaxRecord(record);
    setStep(2);
  };

  // --- PDF GENERATION (Standardized Template) ---
  const generatePDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica'; padding: 40px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid ${Colors.primary}; padding-bottom: 20px; }
            .title { color: ${Colors.primary}; font-size: 24px; font-weight: bold; }
            .table { width: 100%; margin-top: 30px; border-collapse: collapse; }
            .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .label { color: #64748b; font-size: 14px; }
            .value { font-weight: bold; text-align: right; }
            .total-row { background-color: #f8fafc; color: ${Colors.error}; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">PAYE TAX ASSESSMENT</h1>
            <p>Fiscal Year: ${is2026 ? '2026 (New Reform)' : '2025'}</p>
          </div>
          <p><strong>Taxpayer:</strong> ${userName || 'Guest User'}</p>
          <table class="table">
            <tr><td class="label">Annual Gross Income</td><td class="value">${formatCurrency(calculation.annualGross)}</td></tr>
            <tr><td class="label">Pension Contribution</td><td class="value">-${formatCurrency(calculation.deductions.pension)}</td></tr>
            <tr><td class="label">Rent Relief Applied</td><td class="value">${formatCurrency(calculation.deductions.rent)}</td></tr>
            <tr class="total-row">
              <td class="label" style="font-weight:bold">Total Annual Tax</td>
              <td class="value">${formatCurrency(calculation.annualTax)}</td>
            </tr>
            <tr><td class="label">Annual Take-Home (Net)</td><td class="value" style="color:green">${formatCurrency(calculation.annualNet)}</td></tr>
          </table>
          <p style="text-align:center; font-size:10px; margin-top:50px; color:#94a3b8;">Generated by Taxlator Nigeria</p>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Error", "Could not generate PDF.");
    }
  };

  const renderCheckboxRow = (label: string, value: boolean, onChange: (val: boolean) => void, subtext?: string) => (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9'}}
      onPress={() => onChange(!value)}
    >
      <View style={{flex: 1}}>
        <Text style={{fontSize: 14, color: Colors.text, fontWeight: '600'}}>{label}</Text>
        {subtext && <Text style={{fontSize: 10, color: Colors.secondaryText, marginTop: 2}}>{subtext}</Text>}
      </View>
      <View style={{
        width: 24, height: 24, borderRadius: 6,
        borderWidth: 2, borderColor: value ? Colors.primary : '#cbd5e1',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: value ? Colors.primary : 'transparent'
      }}>
        {value && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={globalStyles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={{padding: 20, paddingTop: 60}}>
          <TouchableOpacity onPress={() => router.back()} style={{marginBottom: 10}}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={{fontSize: 24, fontWeight: '800', color: Colors.primary}}>
            {step === 1 ? "Income Details" : "Your Tax Result"}
          </Text>
        </View>

        <View style={{ padding: 20 }}>
          {step === 1 ? (
            <View style={globalStyles.stepCard}>
              {/* Period Selector */}
              <View style={{flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20}}>
                <TouchableOpacity onPress={() => setPeriod('monthly')} style={[{flex: 1, padding: 10, alignItems: 'center', borderRadius: 8}, period === 'monthly' && {backgroundColor: '#fff'}]}>
                  <Text style={{fontWeight: '700', color: period === 'monthly' ? Colors.primary : '#94a3b8'}}>Monthly</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPeriod('annual')} style={[{flex: 1, padding: 10, alignItems: 'center', borderRadius: 8}, period === 'annual' && {backgroundColor: '#fff'}]}>
                  <Text style={{fontWeight: '700', color: period === 'annual' ? Colors.primary : '#94a3b8'}}>Annual</Text>
                </TouchableOpacity>
              </View>

              <Text style={globalStyles.cardTitle}>Name</Text>
              <TextInput style={globalStyles.input} value={userName} onChangeText={setUserName} placeholder="John Doe" />

              <Text style={[globalStyles.cardTitle, {marginTop: 15}]}>Gross Income ({period})</Text>
              <TextInput style={globalStyles.input} value={grossIncome} onChangeText={t => setGrossIncome(formatInput(t))} keyboardType="numeric" placeholder="₦ 0" />

              <Text style={[globalStyles.cardTitle, {marginTop: 15}]}>Other Deductions</Text>
              <TextInput style={globalStyles.input} value={otherDeductions} onChangeText={t => setOtherDeductions(formatInput(t))} keyboardType="numeric" placeholder="₦ 0" />

              <View style={{marginTop: 20}}>
                {renderCheckboxRow("Pension (8%)", includePension, setIncludePension)}
                {renderCheckboxRow("Rent Relief (20%)", includeRent, setIncludeRent, is2026 ? "2026 Law - Max ₦500k" : "Not applicable for 2025")}
                {includeRent && (
                  <TextInput style={[globalStyles.input, {marginTop: 10, borderColor: Colors.primary}]} value={rentAmount} onChangeText={t => setRentAmount(formatInput(t))} keyboardType="numeric" placeholder="Annual Rent Paid" />
                )}
                {renderCheckboxRow("NHIS (5%)", includeNHIS, setIncludeNHIS)}
                {renderCheckboxRow("NHF (2.5%)", includeNHF, setIncludeNHF)}
              </View>

              <TouchableOpacity style={globalStyles.primaryButton} onPress={handleCalculate}>
                <Text style={globalStyles.primaryButtonText}>Calculate & Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Result View */}
              <View style={{alignItems: 'center', padding: 20}}>
                <Text style={{fontSize: 14, color: Colors.secondaryText}}>Monthly Tax (PAYE)</Text>
                <Text style={{fontSize: 42, fontWeight: '900', color: Colors.primary}}>{formatCurrency(calculation.monthlyTax)}</Text>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginBottom: 20}}>
                <View style={{flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0'}}>
                  <Text style={{fontSize: 12, color: Colors.secondaryText}}>Monthly Net</Text>
                  <Text style={{fontSize: 16, fontWeight: '700'}}>{formatCurrency(calculation.monthlyNet)}</Text>
                </View>
                <View style={{flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0'}}>
                  <Text style={{fontSize: 12, color: Colors.secondaryText}}>Annual Net</Text>
                  <Text style={{fontSize: 16, fontWeight: '700'}}>{formatCurrency(calculation.annualNet)}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setShowBreakdown(!showBreakdown)} style={{backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0'}}>
                <Text style={{fontWeight: '700'}}>Tax Breakdown</Text>
                <Ionicons name={showBreakdown ? "chevron-up" : "chevron-down"} size={20} />
              </TouchableOpacity>

              {showBreakdown && (
                <View style={{padding: 15, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 15}}>
                  <BreakdownRow label="Annual Gross" value={formatCurrency(calculation.annualGross)} />
                  <BreakdownRow label="Pension Contribution" value={`-${formatCurrency(calculation.deductions.pension)}`} />
                  {includeRent && <BreakdownRow label="Rent Relief applied" value={formatCurrency(calculation.deductions.rent)} />}
                  <BreakdownRow label="Total Annual Tax" value={formatCurrency(calculation.annualTax)} bold color={Colors.error} />
                </View>
              )}

              <TouchableOpacity style={globalStyles.primaryButton} onPress={() => setStep(1)}>
                <Text style={globalStyles.primaryButtonText}>Recalculate</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[globalStyles.primaryButton, {backgroundColor: Colors.accent, marginTop: 10}]} onPress={generatePDF}>
                  <Ionicons name="download-outline" size={20} color="white" style={{marginRight: 8}} />
                  <Text style={globalStyles.primaryButtonText}>Download Receipt (PDF)</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace('/history')} style={{alignItems: 'center', marginTop: 25}}>
                <Text style={{color: Colors.primary, fontWeight: '700'}}>View All Saved Records →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function BreakdownRow({ label, value, bold, color }: any) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
      <Text style={{fontSize: 13, color: Colors.secondaryText}}>{label}</Text>
      <Text style={{fontSize: 13, fontWeight: bold ? '800' : '600', color: color || Colors.text}}>{value}</Text>
    </View>
  );
}