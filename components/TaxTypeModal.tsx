import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/landingpagestyles';

const { width } = Dimensions.get('window');

export default function TaxTypeModal({ visible, onClose }) {
  const router = useRouter();

  const go = (route: string) => {
    onClose();
    setTimeout(() => router.push(route), 200);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Calculate Your Tax</Text>
            <Text style={styles.subtitle}>
              Select the type of tax you want to calculate
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.close}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            <TaxCard
              icon="person"
              title="PAYE / PIT"
              desc="Pay As You Earn (Monthly) / Personal Income Tax"
              onPress={() => go('/calculator')}
            />

            <TaxCard
              icon="pricetag"
              title="VAT"
              desc="Value Added Tax calculator"
              onPress={() => go('/vat-calculator')}
            />

            <TaxCard
              icon="briefcase"
              title="Freelancer / Self-Employed"
              desc="Tax for freelancers & self-employed"
              onPress={() => go('/freelancer-calculator')}
            />

            <TaxCard
              icon="business"
              title="Company Income Tax"
              desc="Corporate tax calculator"
              onPress={() => go('/cit-calculator')}
            />
          </View>

        </View>
      </View>
    </Modal>
  );
}

const TaxCard = ({ icon, title, desc, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={28} color={Colors.primary} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{desc}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 4,
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  grid: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 12,
    color: '#64748b',
  },
});
