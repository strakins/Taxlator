import styles from "@/constants/loginstyles";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const PasswordInputSet = function (props: any) {
  const [hidePassword, setHidePassword] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={styles.inputSet}>
      <Text style={styles.inputSetLabel}>{props.label}</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder=""
          onChangeText={props.onChangeText}
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity
          style={styles.eyecon}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Image source={require("../assets/images/eyecon.png")} />
        </TouchableOpacity>
      </View>

      {!props.hasCheck ? (
        <Text style={styles.inputSetDescription}>
          {props.inputSetDescription}
        </Text>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.checkBoxContainer}>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? "#000000" : undefined}
            />
            <Text style={styles.checkBoxText}>{props.checkboxText}</Text>
          </View>
          {props.isForLogin ? (
            <Text style={styles.checkBoxText}>Forgot password</Text>
          ) : (
            ""
          )}
        </View>
      )}
    </View>
  );
};

export default PasswordInputSet;
