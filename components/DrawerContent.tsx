import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons/Ionicons';


export function DrawerContent(props: any) {
  // Force drawer to LIGHT mode
  const colors = Colors.light;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1 }}
      style={{ backgroundColor: colors.background }}
    >
      
      {/* MAIN NAV ITEMS */}
      <DrawerItemList {...props} />

      <View style={styles.divider} />

      {/* EXTRA ITEMS */}
      <DrawerItem
        label="Privacy Policy"
        icon={({ size }) => (
          <Ionicons
            name="shield-checkmark-outline"
            size={size}
            color={colors.text}
          />
        )}
        labelStyle={styles.drawerLabel}
        onPress={() => {}}
      />

      <DrawerItem
        label="About"
        icon={({ size }) => (
          <Ionicons
            name="person-outline"
            size={size}
            color={colors.text}
          />
        )}
        labelStyle={styles.drawerLabel}
        onPress={() => {}}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  appTagline: {
    fontSize: 13,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  drawerLabel: {
    fontSize: 15,
    marginLeft: -16,
  },
});
