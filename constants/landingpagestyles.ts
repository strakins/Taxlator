import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const Colors = {
  primary: '#1e40af',       // Deep Blue
  secondary: '#64748b',     // Slate
  background: '#f8fafc',    // Off-white
  card: '#ffffff',
  text: '#0f172a',
  secondaryText: '#64748b',
  border: '#e2e8f0',
  accent: '#059669',        // Green
};

export const styles = StyleSheet.create({
  heroCard: {
    height: 220,
    margin: 0,
    borderRadius: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  heroContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroWelcome: { color: '#fff', fontSize: 12, opacity: 0.8 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginVertical: 6 },
  heroSub: { color: '#e2e8f0', fontSize: 13 },

  primaryCTA: {
    backgroundColor: Colors.primary,
    marginHorizontal: 4,
    borderRadius: 0,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryCTAText: { color: '#fff', fontWeight: '800' },

  tipCard: {
    width: width * 0.75,
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  tipImage: {
    width: '100%',
    height: 120,
  },

  tipContent: {
    padding: 14,
  },

  tipTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },

  tipTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  tipTitle: {
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 6,
  },

  tipDescription: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 10,
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    textAlign: "center", 
    color: Colors.primary 
  },
  sectionSubtitle: { 
    color: Colors.secondaryText, 
    textAlign: "center" 
  },

  howCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  howCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12,
  },
  howNumber: { color: Colors.card, fontWeight: '800' },
  howTitle: { fontWeight: '700' },
  howText: { color: Colors.secondaryText },

  readMore: { color: Colors.primary },

  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  aboutTitle: { fontWeight: '700' },
  aboutText: { color: Colors.secondaryText },

  ctaBox: {
    backgroundColor: Colors.primary,
    margin: 8,
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  ctaText: { color: '#bfdbfe', textAlign: 'center', marginVertical: 10 },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaButtonText: { color: Colors.primary, fontWeight: '700' },

  

});