import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inputSet: {
    width: "74%",
    gap: 2,
  },
  inputSetLabel: {
    fontSize: 15,
    color: "#000000",
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    borderColor: "#A2A2A2",
    padding: 7,
  },
  inputSetDescription: {
    fontSize: 12,
    color: "#747373",
  },
  eyecon: {
    position: "absolute",
    left: "90%",
    top: "50%",
    transform: "translate(-50%,-50%)",
  },
  passwordInputContainer: {
    position: "relative",
  },
  checkBoxContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  checkBoxText: {
    fontSize: 12,
  },
  button: {
    width: "74%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    borderColor: "#A2A2A2",
    padding: 7,
    textAlign: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 400,
  },
});

export default styles;
