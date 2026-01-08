import styles from "@/constants/loginstyles";
import { Text, TouchableOpacity } from "react-native";

const Button = function (props: any) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.button}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
