import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import styles from '@/constants/loginstyles';

export default function SignupScreen() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const update = (k: string, v: string) =>
    setForm({ ...form, [k]: v });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create your free Taxlator account</Text>

      {[
        ['Full Name', 'fullName'],
        ['Phone Number', 'phone'],
        ['Your Email Address', 'email'],
        ['Password', 'password'],
        ['Confirm Password', 'confirmPassword'],
      ].map(([label, key]) => (
        <View key={key}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={key.includes('password')}
            onChangeText={(v) => update(key, v)}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={async () => {
          if (form.password !== form.confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return;
        }
          await signup(form);
          router.push('/(auth)/verify-otp');
        }}
      >
        <Text style={styles.primaryText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkBold}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
