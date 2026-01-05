import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const mockHistory = [
  {
    id: '1',
    income: 750000,
    tax: 68250,
    netIncome: 681750,
    date: '2024-01-15',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    income: 1200000,
    tax: 175500,
    netIncome: 1024500,
    date: '2024-01-14',
    timestamp: '02:45 PM',
  },
  {
    id: '3',
    income: 500000,
    tax: 13000,
    netIncome: 487000,
    date: '2024-01-13',
    timestamp: '09:15 AM',
  },
];

export default function HistoryScreen() {
  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyTime}>{item.timestamp}</Text>
      </View>
      
      <View style={styles.historyDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Income:</Text>
          <Text style={styles.detailValue}>₹{item.income.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tax:</Text>
          <Text style={[styles.detailValue, styles.taxValue]}>
            ₹{item.tax.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Net Income:</Text>
          <Text style={[styles.detailValue, styles.netValue]}>
            ₹{item.netIncome.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculation History</Text>
      
      {mockHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No calculations yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Your tax calculations will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={mockHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  historyTime: {
    fontSize: 14,
    color: '#64748b',
  },
  historyDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  taxValue: {
    color: '#ef4444',
  },
  netValue: {
    color: '#10b981',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});