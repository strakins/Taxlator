import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatter';
import { Colors } from '../../constants/calculatorstyles';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('tax_history');
      if (data) setHistory(JSON.parse(data));
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // --- CLEAR ALL FUNCTION ---
  const clearAllHistory = () => {
    Alert.alert(
      "Clear All History?",
      "This will permanently delete all saved calculations. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Clear All",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('tax_history');
            setHistory([]);
            Alert.alert("Success", "All records have been cleared.");
          }
        }
      ]
    );
  };

  const handleShare = async (item: any) => {
    try {
      const message = `
🇳🇬 *Taxlator Official Breakdown*
--------------------------
👤 *Name:* ${item.userName || 'Guest User'}
📅 *Date:* ${item.date}
🕒 *Time:* ${item.time}
⚖️ *Law:* ${item.year} Reform
---
💰 *Gross Annual:* ${formatCurrency(parseFloat(item.income))}
📉 *Total Tax:* ${formatCurrency(item.tax)}
✅ *Net Monthly:* ${formatCurrency(item.net / 12)}
${item.savings > 0 ? `\n🎉 *2026 Savings:* ${formatCurrency(item.savings)}` : ''}
--------------------------
_Calculated on Taxlator 2026_
_Receipt ID: ${item.id}_`;

      await Share.share({ message, title: 'Tax Calculation Receipt' });
    } catch (error) {
      Alert.alert("Error", "Could not share calculation.");
    }
  };

  const deleteRecord = (id: string) => {
    Alert.alert("Delete Record?", "Remove this specific calculation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const newHistory = history.filter(item => item.id !== id);
          setHistory(newHistory);
          await AsyncStorage.setItem('tax_history', JSON.stringify(newHistory));
        }
      }
    ]);
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter(item =>
      item.date.toLowerCase().includes(query) ||
      (item.userName && item.userName.toLowerCase().includes(query)) ||
      item.income.toString().includes(query)
    );
  }, [searchQuery, history]);

  const renderHistoryItem = ({ item }: any) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.userNameText}>{item.userName || 'Guest User'}</Text>
          <Text style={styles.preciseTime}>
            <Ionicons name="calendar-outline" size={10} color="#94a3b8" /> {item.date}  |  <Ionicons name="time-outline" size={10} color="#94a3b8" /> {item.time}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteRecord(item.id)} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={22} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Annual Gross</Text>
        <Text style={styles.value}>{formatCurrency(parseFloat(item.income))}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Est. Monthly Take-Home</Text>
        <Text style={[styles.value, styles.netText]}>{formatCurrency(item.net / 12)}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.tagContainer}>
          <Text style={styles.yearTag}>{item.year} LAW</Text>
        </View>
        {item.savings > 0 && (
          <View style={styles.savingsBadge}>
             <Text style={styles.savingsText}>Saved {formatCurrency(item.savings)}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>

          {history.length > 0 && (
            <TouchableOpacity onPress={clearAllHistory} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>CALCULATION HISTORY</Text>
        <Text style={styles.subtitle}>Track your tax records over time</Text>
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search names, amounts or dates..."
        style={styles.searchInput}
        placeholderTextColor="#94a3b8"
        clearButtonMode="while-editing"
      />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={80} color="#e2e8f0" />
              <Text style={styles.emptyText}>No records found</Text>
              <TouchableOpacity onPress={() => router.push('/')} style={styles.emptyBtn}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start Calculating</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16 },
  header: { marginTop: 20, marginBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backButton: { paddingVertical: 5 },
  backText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
  clearAllBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  clearAllText: { color: Colors.error, fontWeight: '700', fontSize: 12 },
  title: { fontSize: 22, fontWeight: '900', color: '#0f172a', textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 4 },
  searchInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    color: '#0f172a',
    fontSize: 15,
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    alignItems: 'center'
  },
  userNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'capitalize'
  },
  preciseTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 5,
    fontWeight: '600'
  },
  actionButton: { marginLeft: 12, padding: 4 },
  tagContainer: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  yearTag: { fontSize: 9, fontWeight: '800', color: '#64748b' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#64748b', fontSize: 13 },
  value: { fontWeight: '700', color: '#1e293b', fontSize: 15 },
  netText: { color: '#059669', fontWeight: '800' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center'
  },
  savingsBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  savingsText: { fontSize: 10, color: '#059669', fontWeight: '800' },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#94a3b8', marginTop: 15, fontSize: 16, marginBottom: 25 },
  emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 }
});