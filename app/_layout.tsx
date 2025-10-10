import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { useRouter, useSegments } from "expo-router";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const showBackButton = segments.length > 1;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        {router.canGoBack && router.canGoBack() && showBackButton && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerText}>Travel Journal</Text>
      </View>

      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
  },
  backButton: { marginRight: 10 },
  backText: { fontSize: 20, color: "#007AFF" },
  headerText: { fontSize: 20, fontWeight: "bold" },
});
