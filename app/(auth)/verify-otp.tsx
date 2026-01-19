import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';

export default function OtpVerifyScreen() {
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <View>
      <TextInput placeholder="Phone Number" onChangeText={setPhone} />
      <TextInput placeholder="OTP Code" keyboardType="numeric" onChangeText={setOtp} />

      <TouchableOpacity onPress={() => verifyOtp({ phone, otp })}>
        <Text>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
