import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useMemo, useState } from 'react';
import { router } from 'expo-router';

const mockHistory = [
  {
    id: '1',
    income: 750000,
    tax: 68250,
    netIncome: 681750,
    date: 'Jan 15, 2024',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    income: 1200000,
    tax: 175500,
    netIncome: 1024500,
    date: 'Feb 14, 2024',
    timestamp: '02:45 PM',
  },
  {
    id: '3',
    income: 500000,
    tax: 13000,
    netIncome: 487000,
    date: 'Jun 13, 2024',
    timestamp: '09:15 AM',
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleReturnHome = () => {
      router.push('/')
    }

  
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return mockHistory;

    const query = searchQuery.toLowerCase();

    return mockHistory.filter((item) => {
      return (
        item.date.toLowerCase().includes(query) ||
        item.timestamp.toLowerCase().includes(query) ||
        item.income.toString().includes(query) ||
        item.tax.toString().includes(query) ||
        item.netIncome.toString().includes(query)
      );
    });
  }, [searchQuery]);

  const renderHistoryItem = ({ item }: any) => (
    <TouchableOpacity style={styles.historyCard} activeOpacity={0.85}>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Income</Text>
        <Text style={styles.value}>₦{item.income.toLocaleString()}</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Tax</Text>
        <Text style={[styles.value, styles.tax]}>
          ₦{item.tax.toLocaleString()}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Net Income</Text>
        <Text style={[styles.value, styles.net]}>
          ₦{item.netIncome.toLocaleString()}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReturnHome} style={styles.backButton}>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.title}>TAX CALCULATIONS HISTORY</Text>
        <Text style={styles.subtitle}>
          Track and compare your past tax calculations
        </Text>
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="search for your recent calculations"
        placeholderTextColor="#9ca3af"
        style={styles.searchInput}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {filteredHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No matching results</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },

  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },

  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  backText: {
    fontSize: 14,
    color: '#374151',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },

  searchInput: {
    backgroundColor: '#e6e6e6',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#111827',
    marginBottom: 20,
  },

  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: '#6b7280',
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  tax: {
    color: '#dc2626',
  },

  net: {
    color: '#16a34a',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  date: {
    fontSize: 12,
    color: '#6b7280',
  },

  time: {
    fontSize: 12,
    color: '#6b7280',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
