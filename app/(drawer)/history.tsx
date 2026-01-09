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
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// --- Shared Assets ---
import { formatCurrency } from '../../utils/formatter';
import { Colors } from '../../constants/calculatorstyles';

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PAYE' | 'CIT' | 'VAT'>('ALL');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('tax_history');
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure every item has a 'type' property (default to PAYE if missing)
        setHistory(parsed.map((item: any) => ({ ...item, type: item.type || 'PAYE' })));
      }
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    const totalTax = history.reduce((sum, item) => sum + (parseFloat(item.tax) || 0), 0);
    const count = history.length;
    return { totalTax, count };
  }, [history]);

  // --- FILTER & SEARCH LOGIC ---
  const filteredHistory = useMemo(() => {
    let base = history;
    if (activeFilter !== 'ALL') {
      base = base.filter(item => item.type === activeFilter);
    }
    if (!searchQuery.trim()) return base;
    const query = searchQuery.toLowerCase();
    return base.filter(item =>
      (item.userName && item.userName.toLowerCase().includes(query)) ||
      (item.type && item.type.toLowerCase().includes(query)) ||
      item.date.includes(query)
    );
  }, [searchQuery, history, activeFilter]);

  const clearAllHistory = () => {
    Alert.alert("Clear All Records?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem('tax_history');
          setHistory([]);
        }
      }
    ]);
  };

  const deleteRecord = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    AsyncStorage.setItem('tax_history', JSON.stringify(newHistory));
  };

  const handleShare = async (item: any) => {
    const message = `Taxlator Receipt\nType: ${item.type}\nUser: ${item.userName}\nTax: ${formatCurrency(item.tax)}\nNet: ${formatCurrency(item.net)}`;
    await Share.share({ message });
  };

  const renderHistoryItem = ({ item }: any) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.userNameText}>{item.userName || 'Guest User'}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
          </View>
          <Text style={styles.preciseTime}>
            <Ionicons name="calendar-outline" size={10} color="#94a3b8" /> {item.date} | {item.time || ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteRecord(item.id)} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Base Amount</Text>
        <Text style={styles.value}>{formatCurrency(parseFloat(item.income || item.turnover || 0))}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Total Tax Due</Text>
        <Text style={[styles.value, { color: Colors.error }]}>{formatCurrency(item.tax)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/')}><Text style={styles.backText}>← Dashboard</Text></TouchableOpacity>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearAllHistory} style={styles.clearAllBtn}><Text style={styles.clearAllText}>Clear All</Text></TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>Tax Records</Text>
      </View>

      {/* --- SUMMARY STATS --- */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Calculations</Text>
          <Text style={styles.statValue}>{stats.count}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Accumulated Tax</Text>
          <Text style={[styles.statValue, { color: Colors.error }]}>{formatCurrency(stats.totalTax)}</Text>
        </View>
      </View>

      {/* --- FILTER BAR --- */}
      <View style={styles.filterContainer}>
        {['ALL', 'PAYE', 'CIT', 'VAT'].map((f: any) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterTab, activeFilter === f && styles.activeFilterTab]}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search name, date, or type..."
        style={styles.searchInput}
        placeholderTextColor="#94a3b8"
      />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#e2e8f0" />
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const getTypeColor = (type: string) => {
  if (type === 'CIT') return '#16a34a';
  if (type === 'VAT') return '#ea580c';
  return Colors.primary;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingTop: 50 },
  header: { marginBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backText: { color: Colors.primary, fontWeight: '700' },
  clearAllBtn: { backgroundColor: '#fee2e2', padding: 6, borderRadius: 8 },
  clearAllText: { color: Colors.error, fontWeight: '700', fontSize: 12 },
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 10 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  statLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: '700' },
  statValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  filterContainer: { flexDirection: 'row', gap: 8, marginBottom: 15 },
  filterTab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#e2e8f0' },
  activeFilterTab: { backgroundColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  activeFilterText: { color: '#fff' },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15 },
  historyCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  userNameText: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  preciseTime: { fontSize: 10, color: '#94a3b8', marginTop: 4 },
  actionButton: { marginLeft: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#64748b', fontSize: 12 },
  value: { fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#94a3b8', marginTop: 10 }
});