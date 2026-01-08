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

// Using your custom styles and color system
import { styles, Colors } from '../../constants/landingpagestyles';

/* -----------------------------
   SKELETON PLACEHOLDER
-------------------------------- */
const Skeleton = ({ height = 16 }: { height?: number }) => (
  <View
    style={{
      height,
      backgroundColor: Colors.border,
      borderRadius: 6,
      marginVertical: 6,
    }}
  />
);

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2026'); // Default to 2026

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCalculatePage = () => {
    // Navigates to the calculator and passes the selected year state
    router.push({
      pathname: '/calculator',
      params: { year: selectedYear }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* === HERO SECTION === */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.hero}>
            <Image
              source={require('../../assets/images/tax-hero.jpg')}
              style={styles.heroImage}
            />
          </View>

          {/* YEAR SELECTION TOGGLE */}
          <View style={localStyles.toggleContainer}>
            <Text style={localStyles.toggleLabel}>Select Tax Year:</Text>
            <View style={localStyles.segmentedControl}>
              <TouchableOpacity
                style={[localStyles.segment, selectedYear === '2025' && localStyles.activeSegment]}
                onPress={() => setSelectedYear('2025')}
              >
                <Text style={[localStyles.segmentText, selectedYear === '2025' && localStyles.activeText]}>2025 (PITA)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[localStyles.segment, selectedYear === '2026' && localStyles.activeSegment]}
                onPress={() => setSelectedYear('2026')}
              >
                <Text style={[localStyles.segmentText, selectedYear === '2026' && localStyles.activeText]}>2026 (NTA)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleCalculatePage} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Start {selectedYear} Calculation</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ================= HOW IT WORKS ================= */}
        <Section
          title="How It Works?"
          subtitle="Simple steps to master your taxes"
        >
          {loading ? (
            <>
              <Skeleton height={90} />
              <Skeleton height={90} />
            </>
          ) : (
            <>
              <StepCard
                step="1"
                title="Enter Your Gross Income"
                description="Input your total yearly salary. We'll handle the math."
              />
              <StepCard
                step="2"
                title="Apply 2026 Reliefs"
                description={selectedYear === '2026'
                  ? "Input your rent to claim the 20% tax-free deduction!"
                  : "Automatic CRA and Pension deductions applied for 2025."}
              />
              <StepCard
                step="3"
                title="Instant Breakdown"
                description="See exactly what goes to tax, pension, and your pocket."
              />
            </>
          )}
        </Section>

        {/* ================= LATEST TIPS ================= */}
        <Section
          title="Latest Tax Tips & Updates"
          subtitle="Stay informed with Nigerian tax insights"
        >
          <InfoCard
            tag="2026 Reform"
            title="The New Rent Relief Explained"
            description="How the 2026 law helps you keep more money if you pay rent."
          />
          <InfoCard
            tag="PAYE"
            title="Understanding Tax Bands"
            description="Learn how progressive tax rates from 7% to 24% apply to you."
          />
        </Section>

        {/* ================= ABOUT ================= */}
        <Section
          title="About Taxlator"
          subtitle="Built for the Nigerian Taxpayer"
        >
          <FeatureCard
            icon="shield-checkmark-outline"
            title="Accurate Calculations"
            description="Powered by the latest gazetted Nigerian tax rules."
          />
          <FeatureCard
            icon="flash-outline"
            title="Instant Results"
            description="See your take-home pay immediately after input."
          />
        </Section>

        {/* ================= CTA ================= */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Ready to Calculate?</Text>
          <Text style={styles.ctaText}>
            Join thousands of Nigerians planning their finances with Taxlator.
          </Text>

          <TouchableOpacity onPress={handleCalculatePage} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -----------------------------
   REUSABLE COMPONENTS
-------------------------------- */
const Section = ({ title, subtitle, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    <View style={{ marginTop: 12 }}>{children}</View>
  </View>
);

const StepCard = ({ step, title, description }: any) => (
  <View style={styles.stepCard}>
    <View style={styles.stepCircle}>
      <Text style={styles.stepText}>{step}</Text>
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{description}</Text>
  </View>
);

const InfoCard = ({ tag, title, description }: any) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoTag}>{tag}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{description}</Text>
    <Text style={styles.readMore}>Read more →</Text>
  </View>
);

const FeatureCard = ({ icon, title, description }: any) => (
  <View style={styles.featureCard}>
    <Ionicons name={icon} size={22} color={Colors.secondary} />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
    </View>
  </View>
);

/* -----------------------------
   LOCAL STYLES FOR TOGGLE
-------------------------------- */
const localStyles = StyleSheet.create({
  toggleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 8,
    fontWeight: '600',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeSegment: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeText: {
    color: Colors.primary,
  },
});