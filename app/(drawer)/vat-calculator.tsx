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

// --- STORAGE & UTILS ---
import { saveTaxRecord } from '@/utils/storage';
import { Colors, styles as globalStyles } from '@/constants/calculatorstyles';
import { formatCurrency } from '@/utils/formatter';

export default function VATCalculator() {
  const router = useRouter();

  // --- STATE ---
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('10');
  const [calcType, setCalcType] = useState<'add' | 'remove'>('add');
  const [description, setDescription] = useState('');

  // --- LOGIC ---
  const formatInput = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    return numericValue ? Number(numericValue).toLocaleString() : '';
  };

  const parseNumber = (value: string) => parseFloat(value.replace(/,/g, '')) || 0;

  const calculation = useMemo(() => {
    const rawAmount = parseNumber(amount);
    const rate = parseNumber(vatRate) / 100;

    let vatAmount = 0;
    let baseAmount = 0;
    let totalAmount = 0;

    if (calcType === 'add') {
      baseAmount = rawAmount;
      vatAmount = rawAmount * rate;
      totalAmount = rawAmount + vatAmount;
    } else {
      totalAmount = rawAmount;
      baseAmount = rawAmount / (1 + rate);
      vatAmount = rawAmount - baseAmount;
    }

    return { baseAmount, vatAmount, totalAmount };
  }, [amount, vatRate, calcType]);

  // --- SAVE & PDF LOGIC ---
  const handleSaveAndPrint = async (shouldPrint = false) => {
    if (parseNumber(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    const record = {
      id: Date.now().toString(),
      type: 'VAT',
      title: description || (calcType === 'add' ? 'Sales Invoice' : 'Purchase Receipt'),
      userName: description || 'VAT Record',
      income: calculation.baseAmount.toString(), // Base price for history stats
      tax: calculation.vatAmount.toString(),     // VAT amount for history stats
      net: calculation.totalAmount.toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      year: '2026',
    };

    await saveTaxRecord(record);

    if (shouldPrint) {
      generatePDF(record);
    } else {
      Alert.alert("Success", "VAT record saved to history.");
    }
  };

  const generatePDF = async (item: any) => {
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
            .total-row { background-color: #f8fafc; color: ${Colors.primary}; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">VAT ASSESSMENT RECEIPT</h1>
            <p>Fiscal Year 2026</p>
          </div>
          <p style="margin-top: 20px;"><strong>Description:</strong> ${item.title}</p>
          <table class="table">
            <tr><td class="label">Net Amount (Base)</td><td class="value">${formatCurrency(item.income)}</td></tr>
            <tr><td class="label">VAT Rate</td><td class="value">${vatRate}%</td></tr>
            <tr><td class="label">VAT Amount</td><td class="value">+ ${formatCurrency(item.tax)}</td></tr>
            <tr class="total-row">
              <td class="label" style="font-weight:bold">Total Gross Amount</td>
              <td class="value">${formatCurrency(item.net)}</td>
            </tr>
          </table>
          <p style="text-align:center; font-size:10px; margin-top:50px; color:#94a3b8;">Generated via Taxlator Nigeria</p>
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
          <Text style={{fontSize: 24, fontWeight: '800', color: Colors.primary}}>VAT Calculator</Text>
          <Text style={{color: Colors.secondaryText, fontSize: 13}}>2026 Standard Rate: 10%</Text>
        </View>

        <View style={{ padding: 20 }}>
          <View style={globalStyles.stepCard}>
            <View style={{flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20}}>
              <TouchableOpacity
                onPress={() => setCalcType('add')}
                style={[{flex: 1, padding: 12, alignItems: 'center', borderRadius: 8}, calcType === 'add' && {backgroundColor: '#fff', shadowOpacity: 0.1, elevation: 2}]}
              >
                <Text style={{fontWeight: '700', color: calcType === 'add' ? Colors.primary : '#94a3b8'}}>Add VAT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCalcType('remove')}
                style={[{flex: 1, padding: 12, alignItems: 'center', borderRadius: 8}, calcType === 'remove' && {backgroundColor: '#fff', shadowOpacity: 0.1, elevation: 2}]}
              >
                <Text style={{fontWeight: '700', color: calcType === 'remove' ? Colors.primary : '#94a3b8'}}>VAT Inclusive</Text>
              </TouchableOpacity>
            </View>

            <Text style={globalStyles.cardTitle}>Item Description (Optional)</Text>
            <TextInput
              style={[globalStyles.input, {marginBottom: 15}]}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. Office Equipment"
            />

            <Text style={globalStyles.cardTitle}>{calcType === 'add' ? 'Net Amount (Before VAT)' : 'Gross Amount (Total)'}</Text>
            <TextInput
              style={[globalStyles.input, {fontSize: 22, fontWeight: '700'}]}
              value={amount}
              onChangeText={t => setAmount(formatInput(t))}
              keyboardType="numeric"
              placeholder="₦ 0"
            />

            <Text style={[globalStyles.cardTitle, {marginTop: 20}]}>VAT Rate (%)</Text>
            <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
              {['7.5', '10', '15'].map((rate) => (
                <TouchableOpacity
                  key={rate}
                  onPress={() => setVatRate(rate)}
                  style={{
                    flex: 1, padding: 10, borderRadius: 8, borderWidth: 1,
                    borderColor: vatRate === rate ? Colors.primary : Colors.border,
                    backgroundColor: vatRate === rate ? '#eff6ff' : '#fff',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{fontWeight: '700', color: vatRate === rate ? Colors.primary : Colors.secondaryText}}>{rate}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* RESULT BOX */}
          {parseNumber(amount) > 0 && (
            <>
              <View style={{marginTop: 20, backgroundColor: Colors.primary, borderRadius: 20, padding: 24, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5}}>
                <Text style={{color: '#bfdbfe', fontSize: 14, fontWeight: '600'}}>Total Amount</Text>
                <Text style={{color: '#fff', fontSize: 32, fontWeight: '900', marginVertical: 5}}>{formatCurrency(calculation.totalAmount)}</Text>

                <View style={{height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15}} />

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View>
                    <Text style={{color: '#bfdbfe', fontSize: 12}}>Base Price</Text>
                    <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>{formatCurrency(calculation.baseAmount)}</Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={{color: '#bfdbfe', fontSize: 12}}>VAT ({vatRate}%)</Text>
                    <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>+ {formatCurrency(calculation.vatAmount)}</Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginTop: 15}}>
                <TouchableOpacity
                  style={[globalStyles.primaryButton, {flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.primary}]}
                  onPress={() => handleSaveAndPrint(false)}
                >
                  <Ionicons name="save-outline" size={20} color={Colors.primary} />
                  <Text style={{color: Colors.primary, fontWeight: '700', marginLeft: 8}}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[globalStyles.primaryButton, {flex: 1.5}]}
                  onPress={() => handleSaveAndPrint(true)}
                >
                  <Ionicons name="document-text-outline" size={20} color="white" />
                  <Text style={{color: 'white', fontWeight: '700', marginLeft: 8}}>PDF Receipt</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity onPress={() => router.replace('/history')} style={{alignItems: 'center', marginTop: 30}}>
            <Text style={{color: Colors.primary, fontWeight: '700'}}>View Records →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}