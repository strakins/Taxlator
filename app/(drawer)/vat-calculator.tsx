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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Shared utilities
import { saveTaxRecord } from '@/utils/storage';
import { Colors, styles as globalStyles } from '@/constants/calculatorstyles';
import { formatCurrency } from '@/utils/formatter';


/*---- VAT TRANSACTION TYPES (RADIO LOGIC) ----*/
const VAT_TYPES = [
  {
    id: 'domestic',
    label: 'Domestic Sales / Purchases (7.5%)',
    rate: 0.075,
  },
  {
    id: 'digital',
    label: 'Digital Services (7.5%)',
    rate: 0.075,
  },
  {
    id: 'export',
    label: 'Export / International (0%)',
    rate: 0,
  },
  {
    id: 'exempt',
    label: 'Exempt Items (No VAT)',
    rate: 0,
  },
];

export default function VATCalculator() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [isAddingVAT, setIsAddingVAT] = useState(true);
  const [selectedType, setSelectedType] = useState(VAT_TYPES[0]);
  const [showBreakdown, setShowBreakdown] = useState(false);

  /* ------------------ */
  /* Helpers            */
  /* ------------------ */
  const formatInput = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    return numeric ? Number(numeric).toLocaleString() : '';
  };

  const parseAmount = (value: string) =>
    parseFloat(value.replace(/,/g, '')) || 0;

  /* ------------------ */
  /* VAT CALCULATION    */
  /* ------------------ */
  const calculation = useMemo(() => {
    const baseAmount = parseAmount(amount);
    const rate = selectedType.rate;

    let vatAmount = 0;
    let netAmount = 0;

    if (rate === 0) {
      vatAmount = 0;
      netAmount = baseAmount;
    } else if (isAddingVAT) {
      vatAmount = baseAmount * rate;
      netAmount = baseAmount + vatAmount;
    } else {
      vatAmount = baseAmount - baseAmount / (1 + rate);
      netAmount = baseAmount - vatAmount;
    }

    return {
      baseAmount,
      vatAmount,
      netAmount,
      rateText: `${rate * 100}%`,
    };
  }, [amount, selectedType, isAddingVAT]);

  /* ------------------ */
  /* SAVE & PROCEED     */
  /* ------------------ */
  const handleCalculate = async () => {
    if (!amount) {
      Alert.alert('Missing Amount', 'Please enter a transaction amount.');
      return;
    }

    const record = {
      id: Date.now().toString(),
      type: 'VAT',
      title: 'Value Added Tax',
      userName: selectedType.label,
      income: calculation.baseAmount.toString(),
      tax: calculation.vatAmount.toString(),
      net: calculation.netAmount.toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      year: '2026',
    };

    await saveTaxRecord(record);
    setStep(2);
  };

  /* ------------------ */
  /* UI                 */
  /* ------------------ */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={globalStyles.scroll}>
          {/* Header */}
          <View style={{ padding: 20, paddingTop: 30 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>
                <Ionicons name="chevron-back-outline" /> Back
              </Text>
            </TouchableOpacity>

            <Text style={styles.title}>Value Added Tax (VAT)</Text>
            <Text style={styles.subtitle}>Nigeria VAT Rules (2026)</Text>
          </View>

          <View style={{ padding: 20 }}>
            {step === 1 ? (
              <View style={globalStyles.stepCard}>
                {/* Amount */}
                <Text style={globalStyles.cardTitle}>Transaction Amount (₦)</Text>
                <TextInput
                  style={globalStyles.input}
                  value={amount}
                  onChangeText={(t) => setAmount(formatInput(t))}
                  keyboardType="numeric"
                  placeholder="0"
                />

                {/* Add or Extract VAT */}
                <View style={styles.toggleRow}>
                  <ToggleButton
                    active={isAddingVAT}
                    label="Add VAT"
                    onPress={() => setIsAddingVAT(true)}
                  />
                  <ToggleButton
                    active={!isAddingVAT}
                    label="Extract VAT"
                    onPress={() => setIsAddingVAT(false)}
                  />
                </View>

                {/* Transaction Type */}
                <Text style={[globalStyles.cardTitle, { marginTop: 20 }]}>
                  Transaction Type
                </Text>

                {VAT_TYPES.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.rateRow,
                      selectedType.id === item.id && styles.rateRowActive,
                    ]}
                    onPress={() => setSelectedType(item)}
                  >
                    <Text style={{ fontWeight: '600', flex: 1 }}>
                      {item.label}
                    </Text>
                    <Ionicons
                      name={
                        selectedType.id === item.id
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[globalStyles.primaryButton, { marginTop: 30 }]}
                  onPress={handleCalculate}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Calculate VAT
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* Result */}
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>VAT Amount</Text>
                  <Text style={styles.resultValue}>
                    {formatCurrency(calculation.vatAmount)}
                  </Text>
                  <Text style={styles.smallText}>
                    {selectedType.label}
                  </Text>
                </View>

                {/* Breakdown */}
                <TouchableOpacity
                  onPress={() => setShowBreakdown(!showBreakdown)}
                  style={styles.breakdownToggle}
                >
                  <Text style={{ fontWeight: '700' }}>
                    Detailed Breakdown
                  </Text>
                  <Ionicons
                    name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                  />
                </TouchableOpacity>

                {showBreakdown && (
                  <View style={styles.breakdownCard}>
                    <DetailRow
                      label="Base Amount"
                      value={formatCurrency(calculation.baseAmount)}
                    />
                    <DetailRow
                      label={`VAT (${calculation.rateText})`}
                      value={formatCurrency(calculation.vatAmount)}
                    />
                    <DetailRow
                      label="Net Amount"
                      value={formatCurrency(calculation.netAmount)}
                      bold
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={() => setStep(1)}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    New Calculation
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------ */
/* Reusable Components */
/* ------------------ */
function ToggleButton({ active, label, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.toggleButton,
        active && { backgroundColor: Colors.primary },
      ]}
    >
      <Text style={{ color: active ? '#fff' : Colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function DetailRow({ label, value, bold }: any) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, bold && { fontWeight: '800' }]}>
        {value}
      </Text>
    </View>
  );
}


/*----Styles-----*/

const styles = StyleSheet.create({
  backText: { 
    color: Colors.card, 
    fontWeight: '700',
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
    width: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 10,
  },
  rateRowActive: {
    borderColor: Colors.primary,
    backgroundColor: '#eff6ff',
  },
  resultCard: {
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  resultLabel: {
    color: Colors.secondaryText,
  },
  resultValue: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.primary,
    marginVertical: 10,
  },
  smallText: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  breakdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  breakdownCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: Colors.secondaryText,
  },
  detailValue: {
    fontWeight: '600',
  },
});
