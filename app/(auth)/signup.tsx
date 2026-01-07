import Button from "@/components/button";
import InputSet from "@/components/inputSet";
import PasswordInputSet from "@/components/passwordInputSet";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const Signin = function () {
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
        label="Full Name"
        inputSetDescription="Enter your Full as it is in government ID"
        onChangeText={(text: string) => setEmail(text)}
      />
      <InputSet
        label="Your Email/Phone Number"
        inputSetDescription="Enter your Email/Phone Number"
        onChangeText={(text: string) => setEmail(text)}
      />
      <PasswordInputSet
        label="Password"
        inputSetDescription="Combination of lowercase, numbers and characters"
        onChangeText={(text: string) => setPassword(text)}
        hasCheck={false}
      />
      <PasswordInputSet
        label="Confirm Password"
        inputSetDescription="Enter your Email/Phone Number"
        onChangeText={(text: string) => setPassword(text)}
        hasCheck={true}
        checkboxText="Agreed to our terms, policy and conditions"
      />

      <Button onPress={submitDetails} title="Sign Up" />
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  subScreen: {
    width: "100%",
    alignItems: "center",
    gap: 15,
  },
});
