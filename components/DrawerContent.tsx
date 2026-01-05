import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export function DrawerContent(props: any) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  return (
    <DrawerContentScrollView 
      {...props}
      style={{ backgroundColor: colors.background }}
    >
      <View style={styles.drawerHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>T</Text>
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>Taxlator</Text>
        <Text style={[styles.appTagline, { color: colors.secondaryText }]}>
          Smart Tax Calculator
        </Text>
      </View>
      
      <DrawerItemList {...props} />
      
      <View style={styles.divider} />
      
      <DrawerItem
        label="Privacy Policy"
        onPress={() => console.log('Privacy Policy')}
        labelStyle={{ color: colors.text }}
      />
      <DrawerItem
        label="About"
        onPress={() => console.log('About')}
        labelStyle={{ color: colors.text }}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
    marginHorizontal: 16,
  },
});