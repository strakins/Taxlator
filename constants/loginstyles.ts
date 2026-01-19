import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%'
  },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#64748b', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 13, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: '#143f8f',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  link: { marginTop: 16, textAlign: 'center' },
  linkBold: { color: '#2563eb', fontWeight: '700' },

});

export default styles;
