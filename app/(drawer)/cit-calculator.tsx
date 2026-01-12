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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// --- Shared Assets ---
import { saveTaxRecord } from '../../utils/storage';
import { Colors, styles as globalStyles } from '../../constants/calculatorstyles';
import { formatCurrency } from '../../utils/formatter';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CITCalculator() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [turnover, setTurnover] = useState('');
  const [profitBeforeTax, setProfitBeforeTax] = useState('');
  const [fixedAssets, setFixedAssets] = useState('');
  const [isProfessionalService, setIsProfessionalService] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const formatInput = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    return numericValue ? Number(numericValue).toLocaleString() : '';
  };

  const parseCurrency = (value: string) => parseFloat(value.replace(/,/g, '')) || 0;

  const calculation = useMemo(() => {
    const rawTurnover = parseCurrency(turnover);
    const rawProfit = parseCurrency(profitBeforeTax);
    const rawAssets = parseCurrency(fixedAssets);

    // 2026 Rules: Small companies (under 50M turnover & 250M assets) are CIT exempt
    const isSmallCompany = rawTurnover <= 50000000 && rawAssets <= 250000000 && !isProfessionalService;
    const isLevyExempt = rawTurnover <= 100000000 && rawAssets <= 250000000;

    const citRate = isSmallCompany ? 0 : 0.30;
    const levyRate = isLevyExempt ? 0 : 0.04;

    const citAmount = rawProfit * citRate;
    const levyAmount = rawProfit * levyRate;
    const totalTax = citAmount + levyAmount;

    return {
      turnover: rawTurnover,
      profit: rawProfit,
      citAmount,
      levyAmount,
      totalTax,
      netProfit: rawProfit - totalTax,
      citRateText: `${(citRate * 100).toFixed(0)}%`,
      levyRateText: `${(levyRate * 100).toFixed(0)}%`,
      isSmall: isSmallCompany
    };
  }, [turnover, profitBeforeTax, fixedAssets, isProfessionalService]);

  // --- SAVE & CALCULATE ---
  const handleCalculate = async () => {
    if (!profitBeforeTax || !turnover) {
      Alert.alert("Missing Info", "Please enter turnover and profit figures.");
      return;
    }

    // Standardized record for History consistency
    const record = {
      id: Date.now().toString(),
      type: 'CIT',
      title: companyName || 'Corporate Assessment',
      userName: companyName || 'Unnamed Business',
      income: calculation.turnover.toString(), // Mapped to "Base Amount" in History
      tax: calculation.totalTax.toString(),     // Mapped to "Tax Due" in History
      net: calculation.netProfit.toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      year: '2026',
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
            .total-row { background-color: #f8fafc; color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">CORPORATE TAX RECEIPT</h1>
            <p>Generated via Taxlator Nigeria (2026 Reform)</p>
          </div>
          <p><strong>Company:</strong> ${companyName || 'Business Entity'}</p>
          <table class="table">
            <tr><td class="label">Annual Turnover</td><td class="value">${formatCurrency(calculation.turnover)}</td></tr>
            <tr><td class="label">Profit Before Tax</td><td class="value">${formatCurrency(calculation.profit)}</td></tr>
            <tr><td class="label">CIT Rate Applied</td><td class="value">${calculation.citRateText}</td></tr>
            <tr><td class="label">Dev. Levy (4%)</td><td class="value">${formatCurrency(calculation.levyAmount)}</td></tr>
            <tr class="total-row">
              <td class="label" style="font-weight:bold">Total Tax Payable</td>
              <td class="value">${formatCurrency(calculation.totalTax)}</td>
            </tr>
            <tr><td class="label">Net Profit After Tax</td><td class="value" style="color:#16a34a">${formatCurrency(calculation.netProfit)}</td></tr>
          </table>
          <p style="text-align:center; font-size:10px; margin-top:50px; color:#94a3b8;">Official Assessment - 2026 Tax Act</p>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Error", "Could not generate PDF");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={globalStyles.safeArea}>
        <ScrollView contentContainerStyle={globalStyles.scroll}>
          <View style={{padding: 20, paddingTop: 30}}>
            <TouchableOpacity onPress={() => router.back()} style={{marginBottom: 10}}>
              <Text style={styles.backText}> <Ionicons name='chevron-back-outline' /> Back</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 24, fontWeight: '800', color: Colors.primary}}>Corporate Tax (CIT)</Text>
            <Text style={{color: Colors.secondaryText, fontSize: 13}}>2026 Fiscal Reform Rules</Text>
          </View>

          <View style={{ padding: 20 }}>
            {step === 1 ? (
              <View style={globalStyles.stepCard}>
                <Text style={globalStyles.cardTitle}>Company Name</Text>
                <TextInput style={globalStyles.input} value={companyName} onChangeText={setCompanyName} placeholder="Innovate Ltd" />

                <Text style={[globalStyles.cardTitle, {marginTop: 15}]}>Annual Turnover (₦)</Text>
                <TextInput style={globalStyles.input} value={turnover} onChangeText={t => setTurnover(formatInput(t))} keyboardType="numeric" placeholder="0" />

                <Text style={[globalStyles.cardTitle, {marginTop: 15}]}>Profit Before Tax (PBT)</Text>
                <TextInput style={globalStyles.input} value={profitBeforeTax} onChangeText={t => setProfitBeforeTax(formatInput(t))} keyboardType="numeric" placeholder="0" />

                <Text style={[globalStyles.cardTitle, {marginTop: 15}]}>Total Fixed Assets (₦)</Text>
                <TextInput style={globalStyles.input} value={fixedAssets} onChangeText={t => setFixedAssets(formatInput(t))} keyboardType="numeric" placeholder="0" />

                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 10}}
                  onPress={() => setIsProfessionalService(!isProfessionalService)}
                >
                  <View style={{width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: Colors.primary, backgroundColor: isProfessionalService ? Colors.primary : 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                    {isProfessionalService && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text style={{color: Colors.text, fontSize: 13, flexShrink: 1}}>Professional Service Provider? (No exemption)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.primaryButton, {marginTop: 30}]} onPress={handleCalculate}>
                  <Text style={globalStyles.primaryButtonText}>Calculate & Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={{alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0'}}>
                  <Text style={{fontSize: 14, color: Colors.secondaryText}}>Total Corporate Tax Due</Text>
                  <Text style={{fontSize: 36, fontWeight: '900', color: Colors.primary, marginVertical: 10}}>
                      {formatCurrency(calculation.totalTax)}
                  </Text>
                  {calculation.isSmall && (
                      <View style={{backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20}}>
                          <Text style={{color: '#166534', fontSize: 12, fontWeight: '700'}}>Small Company Exemption Applied</Text>
                      </View>
                  )}
                </View>

                <View style={{flexDirection: 'row', gap: 10, marginBottom: 15}}>
                  <View style={{flex: 1, backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0'}}>
                    <Text style={{fontSize: 11, color: Colors.secondaryText, marginBottom: 4}}>Profit (PBT)</Text>
                    <Text style={{fontSize: 15, fontWeight: '700'}}>{formatCurrency(calculation.profit)}</Text>
                  </View>
                  <View style={{flex: 1, backgroundColor: '#eff6ff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0'}}>
                    <Text style={{fontSize: 11, color: Colors.secondaryText, marginBottom: 4}}>Net Profit</Text>
                    <Text style={{fontSize: 15, fontWeight: '700', color: '#1e40af'}}>{formatCurrency(calculation.netProfit)}</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => setShowBreakdown(!showBreakdown)} style={{backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0'}}>
                  <Text style={{fontWeight: '700'}}>Detailed Breakdown</Text>
                  <Ionicons name={showBreakdown ? "chevron-up" : "chevron-down"} size={20} />
                </TouchableOpacity>

                {showBreakdown && (
                  <View style={{padding: 20, backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0'}}>
                    <DetailRow label="CIT Rate" value={calculation.citRateText} />
                    <DetailRow label="CIT Amount" value={formatCurrency(calculation.citAmount)} />
                    <DetailRow label="Dev. Levy (4%)" value={formatCurrency(calculation.levyAmount)} />
                    <View style={{height: 1, backgroundColor: '#f1f5f9', marginVertical: 10}} />
                    <DetailRow label="Total Tax Payable" value={formatCurrency(calculation.totalTax)} bold color={Colors.error} />
                  </View>
                )}

                <TouchableOpacity style={globalStyles.primaryButton} onPress={() => setStep(1)}>
                  <Text style={globalStyles.primaryButtonText}>New Calculation</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.primaryButton, {backgroundColor: Colors.accent, marginTop: 10}]} onPress={generatePDF}>
                  <Ionicons name="cloud-download-outline" size={20} color="white" style={{marginRight: 8}} />
                  <Text style={globalStyles.primaryButtonText}>Download Tax Receipt</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/history')} style={{alignItems: 'center', marginTop: 30}}>
                  <Text style={{color: Colors.primary, fontWeight: '700'}}>View Saved History →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, bold, color }: any) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
      <Text style={{fontSize: 13, color: Colors.secondaryText}}>{label}</Text>
      <Text style={{fontSize: 13, fontWeight: bold ? '800' : '600', color: color || Colors.text}}>{value}</Text>
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