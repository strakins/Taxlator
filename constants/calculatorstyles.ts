import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const Colors = {
  primary: '#1e40af', // Hero Blue
  secondary: '#059669', // Success Green
  nairaGreen: '#059669',
  nairaLightGreen: '#d1fae5',
  text: '#1e293b',
  secondaryText: '#64748b',
  background: '#f8fafc', // Slightly off-white for better contrast
  card: '#ffffff',
  border: '#e2e8f0',
  placeholder: '#94a3b8',
  error: '#dc2626',
  success: '#059669',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
  },
  // --- HEADER & HERO ---
  hero: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 5,
  },

  // --- STEP CARDS ---
  stepCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // --- INPUTS ---
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: Colors.text,
    marginTop: 10,
  },

  // --- HISTORY SPECIFIC STYLES ---
  userNameLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  preciseTime: {
    fontSize: 11,
    color: Colors.secondaryText,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
  },
  clearAllBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  clearAllText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 12,
  },

  // --- RESULTS & SUMMARY ---
  infoCard: {
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
  },
  infoTag: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 6,
    letterSpacing: 1,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  featureCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
});