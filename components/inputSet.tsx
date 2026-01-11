import styles from "@/constants/loginstyles";
import { Text, TextInput, View } from "react-native";

const InputSet = function (props: any) {
  return (
    <View style={styles.inputSet}>
      <Text style={styles.inputSetLabel}>{props.label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder=""
        onChangeText={props.onChangeText}
      />
      <Text style={styles.inputSetDescription}>
        {props.inputSetDescription}
      </Text>
    </View>
  );
};

export default InputSet;
