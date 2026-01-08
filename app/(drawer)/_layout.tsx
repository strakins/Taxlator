import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

// Custom drawer content
function CustomDrawerContent(props: any) {
  const colors = Colors.light; // force light drawer

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
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

// Main Drawer Layout
export default function Layout() {
  const colors = Colors.light; // force light mode

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerActiveBackgroundColor: "#e0e7ff", // visible background for active item
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 8,
          marginVertical: 4,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
          marginLeft: 0,
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
      {/* Home */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Taxlator",
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Calculator */}
      <Drawer.Screen
        name="calculator"
        options={{
          drawerLabel: "Tax Calculator",
          title: "Calculator",
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calculator" : "calculator-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* History */}
      <Drawer.Screen
        name="history"
        options={{
          drawerLabel: "History",
          title: "Calculation History",
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Profile */}
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: "Profile",
          title: "Profile & Settings",
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
