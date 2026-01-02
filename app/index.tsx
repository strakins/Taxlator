import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { validateIncome } from '../utils/validation';

export default function LandingPage() {
  const router = useRouter();

  // Form States
  const [income, setIncome] = useState('');
  const [taxYear, setTaxYear] = useState('2026'); // PRD Default: 2026
  const [userType, setUserType] = useState<'paye' | 'freelance'>('paye');
  const [error, setError] = useState('');

  const handleStartCalculation = () => {
    const validation = validateIncome(income);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError('');

    // Navigate to Calculator with Params
    router.push({
      pathname: "/calculator/[type]",
      params: {
        type: userType,
        amount: income,
        year: taxYear
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>TAXLATOR</Text>
      <Text style={styles.tagline}>Understand your Nigerian Tax Obligations</Text>

      <View style={styles.formCard}>
        {/* Tax Year Selection - Section 5.7 of PRD */}
        <Text style={styles.label}>Applicable Tax Year</Text>
        <View style={styles.row}>
          {['2025', '2026'].map((year) => (
            <TouchableOpacity
              key={year}
              style={[styles.chip, taxYear === year && styles.activeChip]}
              onPress={() => setTaxYear(year)}
            >
              <Text style={taxYear === year ? styles.activeChipText : styles.chipText}>
                {year === '2025' ? 'Pre-2026 (PITA)' : '2026 (NTA)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User Type - Section 4 of PRD */}
        <Text style={styles.label}>Employment Status</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.typeBox, userType === 'paye' && styles.activeTypeBox]}
            onPress={() => setUserType('paye')}
          >
            <Text style={styles.typeText}>Salaried (PAYE)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBox, userType === 'freelance' && styles.activeTypeBox]}
            onPress={() => setUserType('freelance')}
          >
            <Text style={styles.typeText}>Self-Employed</Text>
          </TouchableOpacity>
        </View>

        {/* Income Entry - Section 9 of PRD */}
        <Text style={styles.label}>Gross Annual Income (₦)</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="e.g. 1,200,000"
          keyboardType="numeric"
          value={income}
          onChangeText={(val) => {
            setIncome(val);
            if (error) setError(''); // Clear error while typing
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.mainButton} onPress={handleStartCalculation}>
          <Text style={styles.mainButtonText}>CONTINUE TO BREAKDOWN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerNote}>
        MVP Version: Results are estimates based on the Nigeria Tax Act 2025.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#F4F7F6', justifyContent: 'center' },
  header: { fontSize: 32, fontWeight: '900', color: '#006837', textAlign: 'center' },
  tagline: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  formCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  chip: { flex: 0.48, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  activeChip: { backgroundColor: '#006837', borderColor: '#006837' },
  chipText: { color: '#555' },
  activeChipText: { color: '#FFF', fontWeight: 'bold' },
  typeBox: { flex: 0.48, padding: 15, borderRadius: 8, backgroundColor: '#E8F5E9', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9' },
  activeTypeBox: { borderColor: '#006837', borderWidth: 2 },
  typeText: { color: '#006837', fontWeight: '600' },
  input: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', fontSize: 18 },
  inputError: { borderColor: '#D32F2F' },
  errorText: { color: '#D32F2F', fontSize: 12, marginTop: 5 },
  mainButton: { backgroundColor: '#006837', padding: 18, borderRadius: 8, marginTop: 25, alignItems: 'center' },
  mainButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  footerNote: { textAlign: 'center', color: '#999', fontSize: 11, marginTop: 20 }
});

// import { Text, View } from "react-native";
//
// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }
