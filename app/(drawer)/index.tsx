import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#1e293b', '#334155'] : ['#1e40af', '#3b82f6']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Taxlator</Text>
            <Text style={styles.heroSubtitle}>
              Naira Tax Calculator
            </Text>
            <Text style={styles.heroDescription}>
              Calculate your Nigerian personal income tax accurately and effortlessly
            </Text>
            
            <TouchableOpacity
              style={[styles.getStartedButton, { backgroundColor: colors.background }]}
              onPress={() => router.push('/calculator')}
            >
              <Text style={[styles.getStartedText, { color: colors.primary }]}>
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={[styles.featuresSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Key Features
          </Text>
          
          <View style={styles.featureGrid}>
            {[
              {
                emoji: '🧮',
                title: 'Nigeria Tax System',
                description: 'Calculations based on Nigeria Personal Income Tax Act'
              },
              {
                emoji: '₦',
                title: 'Naira Currency',
                description: 'All calculations in Nigerian Naira (₦)'
              },
              {
                emoji: '📊',
                title: 'Detailed Breakdown',
                description: 'See exactly how your tax is calculated'
              },
              {
                emoji: '📱',
                title: 'Save History',
                description: 'Track all your previous calculations'
              },
            ].map((feature, index) => (
              <View 
                key={index} 
                style={[styles.featureCard, { backgroundColor: colors.card }]}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.tint + '20' }]}>
                  <Text style={styles.featureIconText}>{feature.emoji}</Text>
                </View>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/calculator')}
            >
              <Text style={styles.actionButtonText}>Calculate Tax Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}
              onPress={() => router.push('/history')}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                View History
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.aboutSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About Taxlator
          </Text>
          <Text style={[styles.aboutText, { color: colors.secondaryText }]}>
            Taxlator is designed specifically for Nigerian taxpayers. Whether you're 
            a salary earner, freelancer, or business owner, our app provides accurate 
            tax estimates based on Nigeria's progressive tax system.
          </Text>
          <Text style={[styles.aboutText, { color: colors.secondaryText }]}>
            All calculations are performed locally on your device - your financial 
            data never leaves your phone.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#dbeafe',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: '#93c5fd',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  getStartedButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  quickActions: {
    padding: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutSection: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});