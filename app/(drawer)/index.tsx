import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// STYLES IMPORT
import { styles, Colors } from '../../constants/landingpagestyles';

/* -----------------------------
   SKELETON PLACEHOLDER
-------------------------------- */
const Skeleton = ({ height = 16 }: { height?: number }) => (
  <View
    style={{
      height,
      backgroundColor: '#e2e8f0',
      borderRadius: 6,
      marginVertical: 6,
      opacity: 0.6
    }}
  />
);

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2026');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
    return () => clearTimeout(timer);
  }, []);

  // Navigation Handlers
  const navToPAYE = () => router.push({ pathname: '/calculator', params: { year: selectedYear } });
  const navToCIT = () => router.push('/cit-calculator');
  const navToVAT = () => router.push('/vat-calculator');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* === HERO SECTION (PAYE FOCUS) === */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.hero}>
            <Image source={require('../../assets/images/tax-hero.jpg')} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Nigerian Tax{'\n'}Made Simple</Text>
                <Text style={styles.heroSubtitle}>PAYE, CIT & VAT calculations updated for {selectedYear}.</Text>
            </View>
          </View>

          {/* YEAR SELECTION */}
          <View style={localStyles.toggleContainer}>
            <Text style={localStyles.toggleLabel}>Tax Reform Year:</Text>
            <View style={localStyles.segmentedControl}>
              {['2025', '2026'].map((yr) => (
                <TouchableOpacity
                  key={yr}
                  style={[localStyles.segment, selectedYear === yr && localStyles.activeSegment]}
                  onPress={() => setSelectedYear(yr)}
                >
                  <Text style={[localStyles.segmentText, selectedYear === yr && localStyles.activeText]}>
                    {yr} {yr === '2026' ? '(NTA)' : '(PITA)'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{paddingHorizontal: 20}}>
            <TouchableOpacity onPress={navToPAYE} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Start PAYE Calculation</Text>
                <Ionicons name="person-outline" size={20} color="#fff" style={{marginLeft: 8}} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ================= CALCULATOR SUITE ================= */}
        <Section title="Business & Trade" subtitle="Specialized tax tools for companies and traders">
           <View style={{paddingHorizontal: 20, flexDirection: 'row', gap: 12}}>
              <TouchableOpacity onPress={navToCIT} style={localStyles.toolCard}>
                <View style={[localStyles.iconCircle, {backgroundColor: '#eff6ff'}]}>
                    <Ionicons name="business" size={24} color={Colors.primary} />
                </View>
                <Text style={localStyles.toolTitle}>CIT</Text>
                <Text style={localStyles.toolSub}>Company Tax</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={navToVAT} style={localStyles.toolCard}>
                <View style={[localStyles.iconCircle, {backgroundColor: '#f0fdf4'}]}>
                    <Ionicons name="receipt" size={24} color="#16a34a" />
                </View>
                <Text style={localStyles.toolTitle}>VAT</Text>
                <Text style={localStyles.toolSub}>Consumption</Text>
              </TouchableOpacity>
           </View>
        </Section>

        {/* ================= HOW IT WORKS ================= */}
        <Section title="How It Works" subtitle="3 simple steps to master your taxes">
          {loading ? (
            <View style={{padding: 20}}><Skeleton height={80} /><Skeleton height={80} /></View>
          ) : (
            <View style={{paddingHorizontal: 20}}>
              <StepCard step="1" title="Select Category" description="Choose between Individual (PAYE), Corporate (CIT), or Sales (VAT)." />
              <StepCard step="2" title="Input Figures" description="Enter your income, profit, or sales amount for instant processing." />
              <StepCard step="3" title="Get Breakdown" description="Download a professional PDF receipt of your tax obligations." />
            </View>
          )}
        </Section>

        {/* ================= LATEST TIPS ================= */}
        <Section title="Tax Updates" subtitle="Stay informed with Nigerian tax laws">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 20}}>
            <InfoCard tag="2026 Reform" title="Rent Relief" description="Claim 20% tax-free deduction on your rent." />
            <InfoCard tag="VAT" title="New 10% Rate" description="Understanding the increase from 7.5% to 10%." />
            <InfoCard tag="Business" title="CIT Exemption" description="Small companies under ₦50m turnover pay 0%." />
          </ScrollView>
        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}

/* -----------------------------
   REUSABLE COMPONENTS
-------------------------------- */
const Section = ({ title, subtitle, children }: any) => (
  <View style={styles.section}>
    <View style={{paddingHorizontal: 20, marginBottom: 15}}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
    {children}
  </View>
);

const StepCard = ({ step, title, description }: any) => (
  <View style={styles.stepCard}>
    <View style={styles.stepCircle}><Text style={styles.stepText}>{step}</Text></View>
    <View style={{flex: 1}}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardText}>{description}</Text></View>
  </View>
);

const InfoCard = ({ tag, title, description }: any) => (
  <View style={styles.infoCard}>
    <View style={styles.tagContainer}><Text style={styles.infoTag}>{tag}</Text></View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText} numberOfLines={2}>{description}</Text>
  </View>
);

/* -----------------------------
   LOCAL STYLES
-------------------------------- */
const localStyles = StyleSheet.create({
  toggleContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 10, alignItems: 'center' },
  toggleLabel: { fontSize: 12, color: Colors.secondaryText, marginBottom: 8, fontWeight: '700', textTransform: 'uppercase' },
  segmentedControl: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, width: '100%' },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeSegment: { backgroundColor: '#ffffff', elevation: 2 },
  segmentText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  activeText: { color: Colors.primary, fontWeight: '700' },

  // Tool Cards for CIT/VAT
  toolCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  toolSub: { fontSize: 12, color: Colors.secondaryText },
});