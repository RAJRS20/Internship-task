import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Journal 🌍</Text>
      <Text style={styles.subtitle}>Add your travel memories</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/modal")}>
        <Text style={styles.addText}>➕ Add New Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 20, color: "#555" },
  addButton: { backgroundColor: "#007bff", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10 },
  addText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
