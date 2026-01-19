import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🔹 Replace with your actual theme
import { Colors } from '@/constants/landingpagestyles';

// 🔹 Replace with your auth store / context
import { useAuth } from '@/store/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout(); // 🔹 your API + storage clear
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
    <SafeAreaView style={styles.container}>
      {/* 🔙 BACK BUTTON */}

      {/* ================= GUEST VIEW ================= */}
      {!user && (
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Taxlator</Text>
          <Text style={styles.subtitle}>
            Log in to save your calculation history and customize your preferences
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.primaryBtnText}>Login / Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/')}
          >
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= LOGGED-IN VIEW ================= */}
      {user && (
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.fullName?.charAt(0)?.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.title}>{user.fullName}</Text>
          <Text style={styles.subtitle}>{user.email}</Text>

          <View style={styles.divider} />

          <ProfileItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => router.push('/profile/edit')}
          />

          <ProfileItem
            icon="receipt-outline"
            label="Calculation History"
            onPress={() => router.push('/history')}
          />

          <ProfileItem
            icon="settings-outline"
            label="Settings"
            onPress={() => router.push('/settings')}
          />

          <ProfileItem
            icon="log-out-outline"
            label="Logout"
            danger
            onPress={handleLogout}
          />
        </View>
      )}
    </SafeAreaView>
    </>
  );
}

/* ================= SUB COMPONENT ================= */

function ProfileItem({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? '#dc2626' : Colors.primary}
      />
      <Text
        style={[
          styles.itemText,
          danger && { color: '#dc2626' },
        ]}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color="#94a3b8"
        style={{ marginLeft: 'auto' }}
      />
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center'
  },
  backBtn: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginVertical: 10,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  guestText: {
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.text,
    fontWeight: '600',
  },
});
