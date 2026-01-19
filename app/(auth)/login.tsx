import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import styles from '@/constants/loginstyles';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [emailOrPhone, setValue] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>Sign in your account</Text>

      <Text style={styles.label}>Your Email/Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email and phone number"
        value={emailOrPhone}
        onChangeText={setValue}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => login({ emailOrPhone, password })}
      >
        <Text style={styles.primaryText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>
          Don’t have an account yet? <Text style={styles.linkBold}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
