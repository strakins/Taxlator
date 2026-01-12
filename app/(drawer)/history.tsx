import React, { useState, useMemo, useCallback } from 'react';
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
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// --- Shared Assets ---
import { formatCurrency } from '@/utils/formatter';
import { Colors } from '@/constants/calculatorstyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PAYE' | 'FREELANCE' | 'CIT' | 'VAT'>('ALL');

  // --- LOAD EXIXTING DATA ---
  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('tax_history');
      if (data) {
        const parsed = JSON.parse(data);
        setHistory(parsed.map((item: any) => ({ ...item, type: item.type || 'PAYE' })));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  // -- PDF GENERATION ASPECT --
  const generatePDF = async (item: any) => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid ${Colors.primary}; padding-bottom: 20px; }
            .title { color: ${Colors.primary}; font-size: 28px; margin: 0; }
            .details { margin-top: 30px; line-height: 1.6; }
            .table { width: 100%; margin-top: 30px; border-collapse: collapse; }
            .table th { background: #f1f5f9; padding: 12px; text-align: left; border: 1px solid #e2e8f0; }
            .table td { padding: 12px; border: 1px solid #e2e8f0; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; }
            .total { font-weight: bold; color: ${Colors.error}; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">TAX ASSESSMENT RECEIPT</h1>
            <p>Generated via Taxlator Nigeria</p>
          </div>
          <div class="details">
            <p><strong>Reference ID:</strong> ${item.id}</p>
            <p><strong>Taxpayer Name:</strong> ${item.title || item.userName || 'N/A'}</p>
            <p><strong>Date of Assessment:</strong> ${item.date}</p>
            <p><strong>Tax Type:</strong> ${item.type}</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base Income / Turnover</td>
                <td>${formatCurrency(item.income || item.turnover || 0)}</td>
              </tr>
              <tr>
                <td class="total">Total Tax Payable</td>
                <td class="total">${formatCurrency(item.amount || item.tax || 0)}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p>This is a computer-generated document based on the 2026 Fiscal Reform Laws.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Error", "Could not generate or share the tax document.");
    }
  };

  // --- DELETE LOGIC ---
  const deleteRecord = (id: string) => {
    Alert.alert("Delete Record", "Are you sure you want to remove this calculation?", [
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

  // --- STATS & FILTERS ---
  const stats = useMemo(() => {
    const totalTax = history.reduce((sum, item) => sum + (parseFloat(item.amount || item.tax || 0)), 0);
    return { totalTax, count: history.length };
  }, [history]);

  const filteredHistory = useMemo(() => {
    let base = history;
    if (activeFilter !== 'ALL') base = base.filter(item => item.type === activeFilter);
    if (!searchQuery.trim()) return base;
    const query = searchQuery.toLowerCase();
    return base.filter(item =>
      (item.title || item.userName || "").toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.date.includes(query)
    );
  }, [searchQuery, history, activeFilter]);

  const renderHistoryItem = ({ item }: any) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.userNameText}>{item.title || item.userName || 'Calculation'}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
          </View>
          <Text style={styles.preciseTime}>
            <Ionicons name="calendar-outline" size={10} color="#94a3b8" /> {item.date}
          </Text>
        </View>
        <View style={styles.actionGroup}>
          <TouchableOpacity onPress={() => generatePDF(item)} style={styles.actionButton}>
            <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteRecord(item.id)} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={22} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Tax Amount</Text>
        <Text style={[styles.value, { color: Colors.error }]}>
            {formatCurrency(item.amount || item.tax || 0)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}> <Ionicons name='chevron-back-outline' /> Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tax Records</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Saved</Text>
            <Text style={styles.statValue}>{stats.count}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Tax Sum</Text>
            <Text style={[styles.statValue, { color: Colors.error }]}>
              {formatCurrency(stats.totalTax)}
            </Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {['ALL', 'PAYE', 'CIT', 'FREELANCE', 'VAT'].map((f: any) => (
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
    </SafeAreaView>
  );
}

const getTypeColor = (type: string) => {
  if (type === 'CIT') return '#16a34a';
  if (type === 'VAT') return '#ea580c';
  return Colors.primary;
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc', 
    paddingHorizontal: 16, 
    paddingTop: 30 
  },
  header: { 
    marginBottom: 15, 
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  backText: { 
    color: Colors.card, 
    fontWeight: '700',
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
    width: 60
  },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#0f172a', 
    marginTop: 10 
  },
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
  actionGroup: { flexDirection: 'row', gap: 15 },
  actionButton: { padding: 4 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#64748b', fontSize: 12 },
  value: { fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#94a3b8', marginTop: 10 }
});