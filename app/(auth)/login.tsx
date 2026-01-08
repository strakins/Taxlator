import Button from "@/components/button";
import InputSet from "@/components/inputSet";
import PasswordInputSet from "@/components/passwordInputSet";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const Login = function () {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");

  const submitDetails = () => {
    if (!email) {
      setEmailError(true);
      return;
    }
    if (!password) {
      setPasswordError(true);
      return;
    }

    const loginData = { email, password };
    // send loginData to backend ere
  };
  return (
    <View style={styles.subScreen}>
      <InputSet
        label="Your Email/Phone Number"
        inputSetDescription="Enter your Email/Phone Number"
        onChangeText={(text: string) => setEmail(text)}
      />
      <PasswordInputSet
        label="Password"
        inputSetDescription="Enter your Email/Phone Number"
        onChangeText={(text: string) => setPassword(text)}
        hasCheck={true}
        checkboxText="Remember me"
        isForLogin={true}
      />
      <Button onPress={submitDetails} title="Sign In" />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  subScreen: {
    width: "100%",
    alignItems: "center",
    gap: 15,
  },
});
