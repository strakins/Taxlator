import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/calculatorstyles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: true }} />
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={80} color={Colors.primary} />

        <Text style={styles.title}>Screen Not Found</Text>
        <Text style={styles.message}>
          The page you are looking for doesn't exist or has been moved.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Go to Home Screen</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  link: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});