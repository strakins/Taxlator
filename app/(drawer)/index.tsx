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
import { Ionicons } from '@expo/vector-icons';


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
        <Section
          title="Latest Tax Tips & Updates"
          subtitle="Stay informed with helpful tax guides and insights"
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16 }}
          >
            <TipCard
              image={require('../../assets/images/taxUpadate1.png')}
              tag="PAYE"
              title="Understanding PAYE Tax Bands in Nigeria"
              description="Learn how progressive tax rates from 7% to 24% apply to your income and what it means for your take-home pay."
            />

            <TipCard
              image={require('../../assets/images/taxUpdate3.png')}
              tag="Freelancer"
              title="Tax Tips for Freelancers and Self-Employed"
              description="Discover legitimate business expenses you can deduct and how to optimize your tax payments as a freelancer."
            />

            <TipCard
              image={require('../../assets/images/taxUpdate2.png')}
              tag="CIT"
              title="Company Income Tax: What Business Owners Should Know"
              description="A comprehensive guide to CIT rates, allowable deductions, and compliance requirements for Nigerian businesses."
            />
          </ScrollView>
        </Section>


        {/* ================= ABOUT ================= */}
        <Section
          title="About"
          subtitle="Essential facts every Nigerian taxpayer should know about us"
        >
          <AboutCard
            icon="checkmark-circle-outline"
            title="Accurate Calculations"
            text="Powered by the latest tax rules, Taxlator ensures your results are correct and dependable."
          />

          <AboutCard
            icon="stats-chart-outline"
            title="Instant Breakdown of Your Salary"
            text="Powered by the latest tax rules, Taxlator ensures your results are correct and dependable."
          />

          <AboutCard
            icon="people-outline"
            title="Perfect for Workers, Students & Businesses"
            text="Whether you're employed or self-employed, Taxlator helps you stay financially informed."
          />

          <AboutCard
            icon="sparkles-outline"
            title="Simple, Beautiful & Easy to Use"
            text="Designed to remove confusion and make tax calculations effortless."
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
  <View style={{ marginTop: 30, borderTopWidth: 0.5, paddingTop: 15 }}>
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


const TipCard = ({ image, tag, title, description }) => (
  <View style={styles.tipCard}>
    <Image source={image} style={styles.tipImage} />

    <View style={styles.tipContent}>
      <View style={styles.tipTag}>
        <Text style={styles.tipTagText}>{tag}</Text>
      </View>

      <Text style={styles.tipTitle}>{title}</Text>
      <Text style={styles.tipDescription}>{description}</Text>

      <Text style={styles.readMore}>Read More <Ionicons name='arrow-forward' /> (Coming Soon)</Text>
    </View>
  </View>
);


const AboutCard = ({ icon, title, text }) => (
  <View style={styles.aboutCard}>
    <Ionicons name={icon} size={26} color={Colors.primary} />
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={styles.aboutTitle}>{title}</Text>
      <Text style={styles.aboutText}>{text}</Text>
    </View>
  </View>
);



