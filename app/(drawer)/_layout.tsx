import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/calculatorstyles';
import { Ionicons } from '@expo/vector-icons';

// Custom drawer content with Branding and Links
function CustomDrawerContent(props: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['left', 'right', 'bottom']}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        
        {/* ENHANCED HEADER */}
        <View style={styles.drawerHeader}>
            <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>₦</Text>
            </View>
            <View>
                <Text style={styles.appTitle}>Taxlator</Text>
                <Text style={styles.appSubtitle}>2026 Fiscal Reform Edition</Text>
            </View>
        </View>

        {/* DRAWER MENU ITEMS */}
        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>

        {/* HOW IT WORKS / GUIDELINES SECTION */}
        <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Resources</Text>
            
            <TouchableOpacity 
                style={styles.infoLink}
                onPress={() => props.navigation.navigate('how-it-works')}
            >
                <Ionicons name="book-outline" size={20} color={Colors.primary} />
                <Text style={styles.infoLinkText}>Tax Law Guidelines</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.infoLink}
                onPress={() => Linking.openURL('https://firs.gov.ng')}
            >
                <Ionicons name="globe-outline" size={20} color="#64748b" />
                <Text style={styles.infoLinkText}>Visit FIRS Website</Text>
            </TouchableOpacity>
        </View>

        {/* DRAWER FOOTER */}
        <View style={styles.drawerFooter}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>Developed for Nigeria 🇳🇬</Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: '#64748b',
        drawerActiveBackgroundColor: '#eff6ff',
        drawerItemStyle: { borderRadius: 10, marginHorizontal: 8, marginVertical: 4 },
        drawerLabelStyle: { fontSize: 15, fontWeight: '600' },
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home Dashboard',
          title: 'Taxlator',
          drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="calculator" 
        options={{
          drawerLabel: 'Personal Tax (PAYE)',
          title: 'PAYE Calculator',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="freelancer-calculator" 
        options={{
          drawerLabel: 'Freelance Tax',
          title: 'FREELANCE Calculator',
          drawerIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="cit-calculator"
        options={{
          drawerLabel: 'Corporate Tax (CIT)',
          title: 'Corporate Calculator',
          drawerIcon: ({ color, size }) => <Ionicons name="business-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="vat-calculator"
        options={{
          drawerLabel: 'VAT Calculator',
          title: 'VAT Calculator',
          drawerIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="history"
        options={{
          drawerLabel: 'Saved Records',
          title: 'History',
          drawerIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="how-it-works"
        options={{
          drawerLabel: 'How it Works',
          title: 'Taxation Guidelines',
          drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'Profile & Settings',
          drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { 
    padding: 20, 
    paddingTop: 30,
    backgroundColor: Colors.primary, 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10 
  },
  logoCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoIcon: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  appTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  appSubtitle: { fontSize: 11, color: '#bfdbfe' },
  drawerItems: { paddingTop: 5 },
  infoSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 1
  },
  infoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  infoLinkText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500'
  },
  drawerFooter: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    marginTop: 20 
  },
  footerText: { fontSize: 10, textAlign: 'center', color: '#94a3b8', marginBottom: 2 },
});