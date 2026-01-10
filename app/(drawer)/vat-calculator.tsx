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

  // --- SAVE TO HISTORY ---
  const handleSave = async () => {
    const record = {
      id: Date.now().toString(),
      type: 'VAT',
      userName: calcType === 'add' ? 'VAT Exclusive Sale' : 'VAT Inclusive Purchase',
      income: calculation.baseAmount.toString(), // The pre-tax price
      tax: calculation.vatAmount,
      net: calculation.totalAmount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      year: '2026',
      savings: 0 // No relief for VAT
    };

    await saveTaxRecord(record);
    Alert.alert("Success", "VAT record saved to history.");
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

              {/* SAVE ACTION */}
              <TouchableOpacity
                style={[globalStyles.primaryButton, {marginTop: 15, backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.primary}]}
                onPress={handleSave}
              >
                <Ionicons name="save-outline" size={20} color={Colors.primary} style={{marginRight: 8}} />
                <Text style={[globalStyles.primaryButtonText, {color: Colors.primary}]}>Save to History</Text>
              </TouchableOpacity>
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