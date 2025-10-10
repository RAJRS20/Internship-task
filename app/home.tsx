import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Pick image
  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert("Permission Denied", "Allow gallery access.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Get location
  const getLocation = async () => {
    setLoadingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoadingLocation(false);
      return Alert.alert("Permission Denied", "Allow location access.");
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
    setLoadingLocation(false);
  };

  const saveEntry = async () => {
    if (!title.trim()) return Alert.alert("Enter title");
    const newEntry = { id: uuidv4(), title, description, image: image || undefined, location: location || undefined, date: new Date().toISOString() };
    const stored = await AsyncStorage.getItem("entries");
    const entries = stored ? JSON.parse(stored) : [];
    await AsyncStorage.setItem("entries", JSON.stringify([newEntry, ...entries]));
    Alert.alert("Entry added!", "Your travel memory has been saved.");

    // Clear inputs
    setTitle("");
    setDescription("");
    setImage(null);
    setLocation(null);

    // Navigate back if you are using a separate Add Entry page
    // router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Back button at top */}
      {router.canGoBack() && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={[styles.input, { height: 80 }]} multiline />
      <Button title="Add Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={{ height: 10 }} />
      <Button title={loadingLocation ? "Getting Location..." : "Add Location"} onPress={getLocation} />
      {location && <Text style={styles.location}>📍 {location}</Text>}
      <View style={{ height: 20 }} />
      <Button title="Save Entry" onPress={saveEntry} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  backButton: { marginBottom: 15 },
  backText: { color: "#007AFF", fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  image: { width: 100, height: 100, marginVertical: 10, borderRadius: 8 },
  location: { marginVertical: 8, color: "#555" },
});
