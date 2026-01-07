import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface UserProfile {
  name: string;
  email: string;
  currency: string;
  notifications: boolean;
  darkMode: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    currency: "INR (₹)",
    notifications: true,
    darkMode: false,
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => setIsLoggedIn(false),
      },
    ]);
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>Welcome to Taxlator</Text>
          <Text style={styles.authSubtitle}>
            Log in to save your calculation history and customize your
            preferences
          </Text>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login / Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => setIsLoggedIn(true)}
          >
            <Text style={styles.skipButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.preferenceRow}>
            <View>
              <Text style={styles.preferenceLabel}>Currency</Text>
              <Text style={styles.preferenceDescription}>
                Default currency for calculations
              </Text>
            </View>
            <Text style={styles.preferenceValue}>{profile.currency}</Text>
          </View>

          <View style={styles.preferenceRow}>
            <View>
              <Text style={styles.preferenceLabel}>Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Receive calculation reminders
              </Text>
            </View>
            <Switch
              value={profile.notifications}
              onValueChange={(value) =>
                setProfile({ ...profile, notifications: value })
              }
              trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
            />
          </View>

          <View style={styles.preferenceRow}>
            <View>
              <Text style={styles.preferenceLabel}>Dark Mode</Text>
              <Text style={styles.preferenceDescription}>
                Switch to dark theme
              </Text>
            </View>
            <Switch
              value={profile.darkMode}
              onValueChange={(value) =>
                setProfile({ ...profile, darkMode: value })
              }
              trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>About Taxlator</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Taxlator v1.0.0</Text>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  skipButton: {
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  skipButtonText: {
    color: "#64748b",
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "white",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#64748b",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1e293b",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  preferenceValue: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "500",
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuText: {
    fontSize: 16,
    color: "#475569",
  },
  logoutButton: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
    marginVertical: 20,
  },
});
