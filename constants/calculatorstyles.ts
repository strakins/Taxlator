import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const Colors = {
  // Brand Colors
  primary: '#1e40af',       // Deep Blue (Hero)
  primaryLight: '#3b82f6',  // Lighter Blue (Highlights)
  secondary: '#64748b',     // Slate (Secondary text/icons)
  accent: '#059669',        // Green (Success/Money)

  // UI Colors
  background: '#f8fafc',    // Very light cool gray (Screen bg)
  card: '#ffffff',          // Pure white (Card bg)
  text: '#0f172a',          // Very dark slate (Main text)
  secondaryText: '#64748b', // Muted text
  border: '#e2e8f0',        // Light border
  inputBorder: '#cbd5e1',   // Input specific border
  placeholder: '#94a3b8',   // Placeholder text

  // Status Colors
  error: '#ef4444',
  success: '#10b981',
  nairaGreen: '#10b981',    // Distinct green for currency
  nairaLightGreen: '#d1fae5',
};

export const styles = StyleSheet.create({
  // --- LAYOUT ---
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // --- CARDS & CONTAINERS ---
  stepCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    // Modern soft shadow
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // --- TYPOGRAPHY ---
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 12,
    lineHeight: 20,
  },

  // --- INPUTS ---
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 0, // Spacing handled by containers
  },

  // --- BUTTONS ---
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    // Button Shadow
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // --- UTILITIES ---
  infoCard: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTag: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // --- LIST ITEMS (Summary Rows) ---
  featureCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
});