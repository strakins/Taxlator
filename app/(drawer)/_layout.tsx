import Colors from "@/constants/Colors";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Custom drawer content component
function CustomDrawerContent(props: any) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || "light"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* Drawer Header */}
        <View
          style={[styles.drawerHeader, { backgroundColor: colors.primary }]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💰</Text>
            <Text style={styles.appTitle}>Taxlator</Text>
          </View>
        </View>

        {/* Drawer Items */}
        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>

        {/* Drawer Footer */}
        <View style={[styles.drawerFooter, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>
            Version 1.0.0
          </Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || "light"];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
          marginLeft: -16,
        },
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Taxlator",
        }}
      />
      <Drawer.Screen
        name="calculator"
        options={{
          drawerLabel: "Tax Calculator",
          title: "Tax Calculator",
        }}
      />
      <Drawer.Screen
        name="history/index"
        options={{
          drawerLabel: "History",
          title: "Calculation History",
        }}
      />
      <Drawer.Screen
        name="profile/index"
        options={{
          drawerLabel: "Profile",
          title: "Profile & Settings",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoIcon: {
    fontSize: 28,
    marginRight: 12,
    color: "white",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  drawerItems: {
    paddingTop: 10,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});
