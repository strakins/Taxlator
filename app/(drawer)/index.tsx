import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const [loading, setLoading] = useState(true);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO ================= */}
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

            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Calculate Tax</Text>
            </TouchableOpacity>
        </Animated.View>

        {/* ================= HOW IT WORKS ================= */}
        <Section
          title="How It Works?"
          subtitle="Just three steps to calculate your tax"
        >
          {loading ? (
            <>
              <Skeleton height={90} />
              <Skeleton height={90} />
              <Skeleton height={90} />
            </>
          ) : (
            <>
              <StepCard
                step="1"
                title="Choose Your Tax Type"
                description="Select from PAYE, Annual PIT, Freelancer, VAT or Company Income Tax."
                // icon="file-document-outline"
              />
              <StepCard
                step="2"
                title="Enter Income & Deductions"
                description="Input your gross income and any eligible deductions."
              />
              <StepCard
                step="3"
                title="See Tax Breakdown Instantly"
                description="Get detailed results showing exactly how your tax was calculated."
              />
            </>
          )}
        </Section>

        {/* ================= LATEST TIPS ================= */}
        <Section
          title="Latest Tax Tips & Updates"
          subtitle="Stay informed with helpful tax guides and insights"
        >
          <InfoCard
            tag="PAYE"
            title="Understanding PAYE Tax Bands in Nigeria"
            description="Learn how progressive tax rates from 7% to 24% apply to your income."
          />

          <InfoCard
            tag="Freelancer"
            title="Tax Tips for Freelancers & Self-Employed"
            description="Discover allowable expenses and ways to optimize tax payments."
          />

          <InfoCard
            tag="CIT"
            title="Company Income Tax Explained"
            description="Rates, allowable deductions, and compliance requirements for businesses."
          />
        </Section>

        {/* ================= ABOUT ================= */}
        <Section
          title="About"
          subtitle="Essential facts every Nigerian taxpayer should know"
        >
          <FeatureCard
            icon="timer-outline"
            title="Accurate Calculations"
            description="Powered by the latest Nigerian tax rules to ensure dependable results."
          />

          <FeatureCard
            icon="bar-chart-outline"
            title="Instant Salary Breakdown"
            description="See how deductions affect your take-home pay instantly."
          />

          <FeatureCard
            icon="people-outline"
            title="Perfect for workers, students, freelancers & businesses"
            description="Ideal for workers, students, freelancers, and businesses."
          />

          <FeatureCard
            icon="sparkles"
            title="Simple, Beautiful & Easy"
            description="Designed to remove confusion and make tax calculations effortless."
          />
        </Section>

        {/* ================= CTA ================= */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaText}>
            Start calculating your taxes now. No signup required.
            Save calculations with a free account (optional).
          </Text>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Calculate Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -----------------------------
   REUSABLE COMPONENTS
-------------------------------- */
const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    <View style={{ marginTop: 12 }}>{children}</View>
  </View>
);

const StepCard = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => (
  <View style={styles.stepCard}>
    <View style={styles.stepCircle}>
      <Text style={styles.stepText}>{step}</Text>
    </View>


    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{description}</Text>
  </View>
);

const InfoCard = ({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoTag}>{tag}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{description}</Text>
    <Text style={styles.readMore}>Read more →</Text>
  </View>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <View style={styles.featureCard}>
    <Ionicons name={icon} size={22} color={Colors.secondary} />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
    </View>
  </View>
);
