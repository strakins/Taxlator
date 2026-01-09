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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// --- ADDED STORAGE IMPORT ---
import { saveTaxRecord } from '../../utils/storage';
import { Colors, styles as globalStyles } from '../../constants/calculatorstyles';
import { formatCurrency } from '../../utils/formatter';

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

  // --- TRIGGER STORAGE ON CALCULATION ---
  const handleCalculate = async () => {
    if (!profitBeforeTax || !turnover) {
      Alert.alert("Missing Info", "Please enter turnover and profit figures.");
      return;
    }

    // Save to History automatically
    const record = {
      id: Date.now().toString(),
      type: 'CIT',
      userName: companyName || 'Unnamed Business', // Using userName for history consistency
      income: calculation.turnover.toString(),      // Store turnover as base income
      tax: calculation.totalTax,
      net: calculation.netProfit,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      year: '2026',
      savings: calculation.isSmall ? (calculation.profit * 0.30) : 0 // Show how much CIT was saved
    };

    await saveTaxRecord(record);
    setStep(2);
  };

  const generatePDF = async () => {
    const html = `
      <html>
        <body style="font-family: 'Helvetica'; padding: 40px; color: #1e293b;">
          <h1 style="color: #1e40af; text-align: center; margin-bottom: 5px;">CORPORATE TAX RECEIPT</h1>
          <p style="text-align: center; color: #64748b; margin-top: 0;">2026 Nigerian Tax Act (NTA)</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          <p><strong>Company:</strong> ${companyName || 'Valued Business'}</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
             <p style="margin: 5px 0;">Annual Turnover: <strong>${formatCurrency(calculation.turnover)}</strong></p>
             <p style="margin: 5px 0;">Profit Before Tax: <strong>${formatCurrency(calculation.profit)}</strong></p>
             <p style="margin: 15px 0; font-size: 18px; color: #dc2626;">Total Tax Payable: <strong>${formatCurrency(calculation.totalTax)}</strong></p>
          </div>
          <h3 style="color: #1e40af; margin-top: 30px;">Breakdown</h3>
          <p>CIT Rate Applied: ${calculation.citRateText}</p>
          <p>Development Levy (4%): ${formatCurrency(calculation.levyAmount)}</p>
          <p style="margin-top: 20px; font-weight: bold; color: #16a34a;">Net Profit After Tax: ${formatCurrency(calculation.netProfit)}</p>
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={globalStyles.scroll}>

        <View style={{padding: 20, paddingTop: 60}}>
          <TouchableOpacity onPress={() => router.back()} style={{marginBottom: 10}}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
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
                <Text style={{color: Colors.text, fontSize: 13}}>Professional Service Provider? (No exemption)</Text>
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