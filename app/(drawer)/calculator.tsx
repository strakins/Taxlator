import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';

interface TaxResult {
  income: number;
  tax: number;
  netIncome: number;
  breakdown: {
    basic: number;
    surcharge: number;
    cess: number;
  };
  timestamp: Date;
}

export default function CalculatorScreen() {
  const router = useRouter();
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);

  const calculateTax = () => {
    const incomeValue = parseFloat(income) || 0;
    const deductionsValue = parseFloat(deductions) || 0;
    const taxableIncome = incomeValue - deductionsValue;

    if (taxableIncome <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid income amount');
      return;
    }

    let tax = 0;
    
    // Simplified tax calculation (Indian tax slabs)
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
    }

    // Add cess (4% of tax)
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    const taxResult: TaxResult = {
      income: incomeValue,
      tax: totalTax,
      netIncome: incomeValue - totalTax,
      breakdown: {
        basic: tax,
        surcharge: 0,
        cess: cess
      },
      timestamp: new Date()
    };

    setResult(taxResult);
    // Save to history
    saveToHistory(taxResult);
  };

  const saveToHistory = (taxResult: TaxResult) => {
    // TODO: Implement AsyncStorage or secure storage
    console.log('Saving to history:', taxResult);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Tax Calculator</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Annual Income (₹)</Text>
          <TextInput
            style={styles.input}
            value={income}
            onChangeText={setIncome}
            placeholder="Enter your annual income"
            keyboardType="numeric"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deductions (₹)</Text>
          <TextInput
            style={styles.input}
            value={deductions}
            onChangeText={setDeductions}
            placeholder="Enter total deductions"
            keyboardType="numeric"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateTax}>
          <Text style={styles.calculateButtonText}>Calculate Tax</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Tax Calculation Result</Text>
            
            <View style={styles.resultCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Annual Income:</Text>
                <Text style={styles.resultValue}>₹{result.income.toLocaleString()}</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Tax:</Text>
                <Text style={[styles.resultValue, styles.taxValue]}>
                  ₹{result.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Net Income:</Text>
                <Text style={[styles.resultValue, styles.netValue]}>
                  ₹{result.netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>

            <Text style={styles.breakdownTitle}>Tax Breakdown</Text>
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Basic Tax:</Text>
                <Text style={styles.breakdownValue}>
                  ₹{result.breakdown.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Cess (4%):</Text>
                <Text style={styles.breakdownValue}>
                  ₹{result.breakdown.cess.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => router.push('/history')}
        >
          <Text style={styles.historyButtonText}>View Calculation History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  calculateButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  taxValue: {
    color: '#ef4444',
  },
  netValue: {
    color: '#10b981',
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#64748b',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  historyButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  historyButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
});