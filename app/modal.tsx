import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

export type Entry = {
  id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  date: string;
};

export default function AddEntryModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; title?: string; description?: string; image?: string; location?: string }>();

  const [title, setTitle] = useState(params.title ?? "");
  const [desc, setDesc] = useState(params.description ?? "");
  const [image, setImage] = useState<string | null>(params.image ?? null);
  const [location, setLocation] = useState<string | null>(params.location ?? null);
  const [entryId, setEntryId] = useState<string | null>(params.id ?? null);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return Alert.alert("Permission Denied", "Allow gallery access.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Get device location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission Denied", "Allow location access.");
    const loc = await Location.getCurrentPositionAsync({});
    const coords = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
    setLocation(coords);
    Toast.show({ type: "success", text1: "📍 Location Added", text2: coords, visibilityTime: 1000 });
  };

  const saveEntry = async () => {
    if (!title || !desc) return Alert.alert("Please fill in all fields!");
    const data = await AsyncStorage.getItem("entries");
    const entries: Entry[] = data ? JSON.parse(data) : [];

    if (entryId) {
      // Edit existing entry
      const updated = entries.map(e =>
        e.id === entryId ? { ...e, title, description: desc, image: image ?? undefined, location: location ?? undefined } : e
      );
      await AsyncStorage.setItem("entries", JSON.stringify(updated));
      Toast.show({ type: "success", text1: "✏️ Entry Updated!" });
    } else {
      // Add new entry
      const newEntry: Entry = {
        id: Date.now().toString(),
        title,
        description: desc,
        image: image ?? undefined,
        location: location ?? undefined,
        date: new Date().toLocaleString(),
      };
      await AsyncStorage.setItem("entries", JSON.stringify([...entries, newEntry]));
      Toast.show({ type: "success", text1: "🌟 New Entry Added!" });
    }

    router.back(); // go back to Explore tab
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{entryId ? "Edit Entry ✏️" : "Add New Entry ✨"}</Text>

      <TextInput
        placeholder="Enter Title"
        placeholderTextColor="#999"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Enter Description"
        placeholderTextColor="#999"
        style={[styles.input, { height: 80 }]}
        multiline
        value={desc}
        onChangeText={setDesc}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 Pick Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>📍 Add Location</Text>
      </TouchableOpacity>
      {location && <Text style={styles.location}>Location: {location}</Text>}

      <TouchableOpacity style={[styles.button, styles.save]} onPress={saveEntry}>
        <Text style={styles.buttonText}>{entryId ? "💾 Update Entry" : "💾 Save Entry"}</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, marginVertical: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  save: { backgroundColor: "#28a745" },
  image: { width: "100%", height: 150, borderRadius: 10, marginVertical: 10 },
  location: { fontSize: 14, marginTop: 5, color: "#333" },
});
