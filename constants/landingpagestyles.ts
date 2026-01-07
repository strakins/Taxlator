import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/* -----------------------------
   LIGHT MODE COLOR SYSTEM
-------------------------------- */
export const Colors = {
  text: '#1e293b',
  background: '#ffffff',
  primary: '#1e40af',
  secondary: '#059669',
  accent: '#10b981',
  card: '#f8fafc',
  border: '#e2e8f0',
  secondaryText: '#64748b',
  placeholder: '#94a3b8',
  nairaGreen: '#059669',
  nairaLightGreen: '#d1fae5',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    // paddingBottom: 40,
  },
  hero: {
    padding: 0,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  heroImage: {
    width: width * 1,
    height: 250,
    resizeMode: 'stretch',
    marginBottom: 0,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 10,
    marginBottom: 10    
},
primaryButtonText: {
    textAlign: 'center',
    color: Colors.background,
    fontWeight: '700',

  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
    borderTopWidth: 1,
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 4,
    marginBottom: 4
  },
  stepCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepText: {
    color: '#fff',
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTag: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '700',
    marginBottom: 6,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  readMore: {
    marginTop: 8,
    color: Colors.primary,
    fontWeight: '600',
  },
  cta: {
    marginTop: 32,
    marginHorizontal: 5,
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  ctaText: {
    color: '#e5e7eb',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
