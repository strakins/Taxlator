import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {styles, Colors} from '@/constants/landingpagestyles';
import TaxTypeModal from '@/components/TaxTypeModal';


const { width } = Dimensions.get('window');


export default function Index() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Image
            source={require('../../assets/images/tax-hero.jpg')}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          {/* <View style={styles.heroContent}>
            <Text style={styles.heroWelcome}>Welcome to Taxlator</Text>
            <Text style={styles.heroTitle}>Calculate your taxes easily and accurately</Text>
            <Text style={styles.heroSub}>
              No stress, no confusion. Let Taxlator help you understand what you owe and why.
            </Text>
          </View> */}
        </View>

        <TouchableOpacity 
          style={styles.primaryCTA} 
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.primaryCTAText}>CALCULATE TAX</Text>
        </TouchableOpacity>

        {/* ================= HOW IT WORKS ================= */}
        <Section title="How It Works?" subtitle="Just three steps to calculate your tax">
          <HowCard
            num="1"
            title="Choose Your Tax"
            text="Select PAYE, Company Income Tax or VAT."
          />
          <HowCard
            num="2"
            title="Enter Your Income"
            text="Input your income, profit or sales amount."
          />
          <HowCard
            num="3"
            title="See Your Tax"
            text="Get instant results with full breakdown."
          />
        </Section>

        {/* ================= TAX TIPS ================= */}
        <Section title="Latest Tax Tips & Updates" subtitle="Helpful Nigerian tax guides">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <TipCard title="Understanding PAYE Tax Bands in Nigeria"  />
            <TipCard title="Tax Tips for Freelancers and Self-Employed" />
            <TipCard title="Company Income Tax: What Businesses Should Know" />
          </ScrollView>
        </Section>

        {/* ================= ABOUT ================= */}
        <Section title="About" subtitle="Why Nigerians trust Taxlator">
          <AboutCard
            title="Accurate Calculations"
            text="Built using Nigerian tax laws."
          />
          <AboutCard
            title="Instant Salary Breakdown"
            text="See exactly how your tax is calculated."
          />
          <AboutCard
            title="Perfect for Workers & Businesses"
            text="From PAYE to company tax."
          />
          <AboutCard
            title="Simple & Easy to Use"
            text="No complex forms or stress."
          />
        </Section>

        {/* ================= CTA ================= */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaText}>
            Start calculating your taxes now. No signup required.
          </Text>

          <TouchableOpacity 
            style={styles.ctaButton} 
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.ctaButtonText}>Calculate Now</Text>
          </TouchableOpacity>
        </View>
        <TaxTypeModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

const Section = ({ title, subtitle, children }) => (
  <View style={{ marginTop: 30 }}>
    <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
    <View style={{ paddingHorizontal: 16 }}>{children}</View>
  </View>
);

const HowCard = ({ num, title, text }) => (
  <View style={styles.howCard}>
    <View style={styles.howCircle}>
      <Text style={styles.howNumber}>{num}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.howTitle}>{title}</Text>
      <Text style={styles.howText}>{text}</Text>
    </View>
  </View>
);

const TipCard = ({ title, }) => (
  <View style={styles.tipCard}>
    <Text style={styles.tipTitle}>{title}</Text>
    <Text style={styles.readMore}>Read more →</Text>
  </View>
);

const AboutCard = ({ title, text }) => (
  <View style={styles.aboutCard}>
    <Text style={styles.aboutTitle}>{title}</Text>
    <Text style={styles.aboutText}>{text}</Text>
  </View>
);


