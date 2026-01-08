import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Imports from shared constants and logic
import { Colors, styles as globalStyles } from '../../constants/calculatorstyles';
import { calculateNigeriaTax } from '../../utils/taxEngine';
import { validateIncome } from '../../utils/validation';
import { formatCurrency } from '../../utils/formatter';

export default function TaxlatorCalculator() {
  const router = useRouter();
  const { year } = useLocalSearchParams();

  // Navigation State
  const [step, setStep] = useState(1);
  const is2026 = year === '2026';

  // Input States
  const [userName, setUserName] = useState('');
  const [income, setIncome] = useState('');
  const [rent, setRent] = useState('');

  // Helper to format numbers with commas for display
  const formatInput = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return Number(numericValue).toLocaleString();
  };

  // 1. Storage Logic with Millisecond Precision
  const saveCalculation = async () => {
    try {
      const now = new Date();
      const preciseTime =
        now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0') + ":" +
        now.getSeconds().toString().padStart(2, '0') + ":" +
        now.getMilliseconds().toString().padStart(3, '0');

      const rawIncome = income.replace(/,/g, '');

      const newRecord = {
        id: now.getTime().toString(),
        userName: userName || 'Guest User',
        date: now.toLocaleDateString('en-NG'),
        time: preciseTime,
        income: rawIncome,
        tax: results.annualTax,
        net: results.netIncome,
        year: year || '2026',
        savings: results.savings || 0
      };

      const existingData = await AsyncStorage.getItem('tax_history');
      const history = existingData ? JSON.parse(existingData) : [];

      history.unshift(newRecord);
      await AsyncStorage.setItem('tax_history', JSON.stringify(history.slice(0, 10)));

      Alert.alert("Saved ✅", `Record for ${newRecord.userName} saved successfully.`);
    } catch (e) {
      Alert.alert("Error", "Failed to save calculation.");
    }
  };

  // 2. Validation & Navigation
  const handleNext = () => {
    if (step === 1) {
      if (!userName.trim()) {
        Alert.alert("Missing Info", "Please enter your name to proceed.");
        return;
      }
      const check = validateIncome(income.replace(/,/g, ''));
      if (!check.isValid) {
        Alert.alert("Invalid Amount", check.error);
        return;
      }
    }
    setStep(s => s + 1);
  };

  // 3. Calculation Logic
  const results = useMemo(() => {
    const rawIncome = parseFloat(income.replace(/,/g, '')) || 0;
    const rawRent = parseFloat(rent.replace(/,/g, '')) || 0;

    const current = calculateNigeriaTax(rawIncome, is2026, rawRent);
    const oldTax = is2026 ? calculateNigeriaTax(rawIncome, false, 0).annualTax : 0;
    const savings = is2026 ? Math.max(0, oldTax - current.annualTax) : 0;

    return { ...current, savings };
  }, [income, rent, is2026]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.safeArea}
    >
      <ScrollView contentContainerStyle={globalStyles.scroll} keyboardShouldPersistTaps="handled">

        {/* HERO SECTION */}
        <View style={globalStyles.hero}>
          <TouchableOpacity
            onPress={() => router.replace('/')}
            style={{ position: 'absolute', left: 20, top: 45 }}
          >
             <Ionicons name="close-circle" size={28} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          <View style={{ paddingVertical: 10, alignItems: 'center' }}>
            <Text style={globalStyles.heroTitle}>Step {step} of 3</Text>
            <Text style={globalStyles.heroSubtitle}>
              {step === 1 ? "Personal Info" : step === 2 ? "Rent & Deductions" : "Result Breakdown"}
            </Text>
          </View>
        </View>

        <View style={{ padding: 20 }}>

          {/* STEP 1: NAME & INCOME ENTRY */}
          {step === 1 && (
            <View style={globalStyles.stepCard}>
              <View style={globalStyles.stepCircle}><Text style={globalStyles.stepText}>1</Text></View>

              <Text style={globalStyles.cardTitle}>Full Name</Text>
              <TextInput
                style={[globalStyles.input, { marginBottom: 20 }]}
                placeholder="Enter your name"
                value={userName}
                onChangeText={setUserName}
                placeholderTextColor={Colors.placeholder}
              />

              <Text style={globalStyles.cardTitle}>Total Gross Income</Text>
              <Text style={globalStyles.cardText}>Annual pay before any tax or pension deductions.</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="₦ 0,000,000"
                keyboardType="numeric"
                value={income}
                onChangeText={(text) => setIncome(formatInput(text))}
                placeholderTextColor={Colors.placeholder}
              />
              <Text style={{fontSize: 12, color: Colors.secondary, marginTop: 10, fontWeight: '600'}}>
                💡 Monthly: {formatCurrency((parseFloat(income.replace(/,/g, '')) || 0) / 12)}
              </Text>
            </View>
          )}

          {/* STEP 2: RENT RELIEF */}
          {step === 2 && (
            <View style={globalStyles.stepCard}>
              <View style={globalStyles.stepCircle}><Text style={globalStyles.stepText}>2</Text></View>
              <Text style={globalStyles.cardTitle}>Deductions & Reliefs</Text>

              {is2026 ? (
                <View style={globalStyles.infoCard}>
                  <Text style={globalStyles.infoTag}>NEW LAW: RENT RELIEF</Text>
                  <Text style={globalStyles.cardText}>Enter annual rent to deduct 20% (Max ₦500k).</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Annual Rent Paid"
                    keyboardType="numeric"
                    value={rent}
                    onChangeText={(text) => setRent(formatInput(text))}
                    placeholderTextColor={Colors.placeholder}
                  />
                </View>
              ) : (
                <View style={globalStyles.infoCard}>
                  <Text style={globalStyles.cardText}>Standard CRA and 8% Pension are applied for 2025.</Text>
                </View>
              )}
            </View>
          )}

          {/* STEP 3: FINAL SUMMARY */}
          {step === 3 && (
            <View>
              <View style={[globalStyles.infoCard, { backgroundColor: Colors.nairaLightGreen, borderLeftWidth: 5, borderLeftColor: Colors.nairaGreen }]}>
                <Text style={globalStyles.infoTag}>SUMMARY FOR {userName.toUpperCase()}</Text>
                <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.text }}>
                  {formatCurrency(results.netIncome / 12)}
                </Text>

                {is2026 && results.savings > 0 && (
                  <View style={{marginTop: 8, backgroundColor: Colors.nairaGreen, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start'}}>
                    <Text style={{color: '#fff', fontSize: 11, fontWeight: 'bold'}}>
                      🎉 SAVING {formatCurrency(results.savings)} VS 2025
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[globalStyles.cardTitle, {marginTop: 20}]}>Annual Breakdown</Text>

              <SummaryRow label="Gross Salary" value={income.startsWith('₦') ? income : `₦${income}`} />
              <SummaryRow label="Pension (8%)" value={`-${formatCurrency((parseFloat(income.replace(/,/g, '')) || 0) * 0.08)}`} isError />
              <SummaryRow label="Total Tax" value={`-${formatCurrency(results.annualTax)}`} isError />
              <SummaryRow label="Total Reliefs" value={formatCurrency(results.reliefAmount)} isSuccess />

              <View style={{
                backgroundColor: Colors.primary,
                padding: 20,
                borderRadius: 12,
                marginTop: 25,
                alignItems: 'center'
              }}>
                <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>Keep this record?</Text>
                <TouchableOpacity
                  onPress={saveCalculation}
                  style={{backgroundColor: '#fff', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 8, marginTop: 12}}
                >
                  <Text style={{color: Colors.primary, fontWeight: '800'}}>SAVE TO HISTORY</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* NAVIGATION */}
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={step === 3 ? () => setStep(1) : handleNext}
            >
              <Text style={globalStyles.primaryButtonText}>
                {step === 3 ? "Recalculate" : "Continue"}
              </Text>
            </TouchableOpacity>

            {/* BACK HOME BUTTON - ONLY STEP 3 */}
            {step === 3 && (
                <TouchableOpacity
                    style={[globalStyles.primaryButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary, marginTop: 12 }]}
                    onPress={() => router.replace('/')}
                >
                    <Text style={[globalStyles.primaryButtonText, { color: Colors.primary }]}>Go Back Home</Text>
                </TouchableOpacity>
            )}

            {step > 1 && (
              <TouchableOpacity onPress={() => setStep(s => s - 1)} style={{ alignSelf: 'center', marginTop: 15 }}>
                <Text style={{ color: Colors.secondaryText, fontWeight: '600' }}>Back</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SummaryRow({ label, value, isError, isSuccess }: any) {
  return (
    <View style={globalStyles.featureCard}>
      <Text style={{ flex: 1, color: Colors.secondaryText, fontSize: 14 }}>{label}</Text>
      <Text style={{
        fontWeight: '700',
        fontSize: 15,
        color: isError ? Colors.error : isSuccess ? Colors.success : Colors.text
      }}>
        {value}
      </Text>
    </View>
  );
}