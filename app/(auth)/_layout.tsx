import { BlurView } from "expo-blur";
import { router, Slot, usePathname } from "expo-router";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthLayout() {
  const pathName = usePathname();

  const headText = pathName.includes("login") ? "Welcome Back!" : "Sign up";
  const subText = pathName.includes("login")
    ? "Sign in your account"
    : "Create your free Taxlator account";

  const footText = pathName.includes("login")
    ? "Don't have an account? Create one"
    : "Already have an account? Sign up";

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <BlurView
        style={[StyleSheet.absoluteFill, styles.centeredContent]} // style={styles.card}
        intensity={20}
        experimentalBlurMethod="dimezisBlurView"
      >
        <View style={styles.card}>
          <Slot />
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    width: "100%",
    height: "100%",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center", // Vertically center the card
    alignItems: "center", // Horizontally center the card
  },
  card: {
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderColor: "#A9A9A9",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 37,
    boxShadow: "0 4 4 0 rgba(0, 0, 0, 0.25)",
    // For iOS Support
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    //  For Android support
    elevation: 4,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headText: {
    fontSize: 35,
    fontWeight: "medium",
  },
  subText: {
    fontSize: 20,
    color: "#747373",
  },
  footText: { marginTop: 20 },
});
