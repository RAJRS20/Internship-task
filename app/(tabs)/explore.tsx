// explore.tsx

import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // <-- NEW: Import for delete icon

// Entry is defined in modal.tsx, but replicated here for clarity
export type Entry = { 
  id: string; 
  title: string; 
  description: string; 
  image?: string; 
  location?: string; 
  date: string; // Stored as ISO string
};

export default function Explore() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const router = useRouter();

  const loadEntries = async () => {
    const data = await AsyncStorage.getItem("entries");
    // Ensure data is parsed correctly or defaults to empty array
    if (data) setEntries(JSON.parse(data));
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  // NEW: Function to delete an entry
  const handleDelete = async (entryId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const data = await AsyncStorage.getItem("entries");
            const existingEntries: Entry[] = data ? JSON.parse(data) : [];
            const updatedEntries = existingEntries.filter(e => e.id !== entryId);
            await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
            setEntries(updatedEntries); // Update local state immediately
          },
        },
      ]
    );
  };

  // Function to navigate to the modal for editing
  const handleEdit = (entry: Entry) => {
      router.push({
          pathname: "/modal",
          params: { 
              id: entry.id,
              title: entry.title,
              description: entry.description,
              image: entry.image,
              location: entry.location
          }
      });
  };

  // NEW: Simple component to render each entry with a delete button
  const renderEntry = ({ item }: { item: Entry }) => (
    <View style={listStyles.itemContainer}>
      {/* Touchable area for Edit */}
      <TouchableOpacity onPress={() => handleEdit(item)} style={listStyles.itemContent}>
          <View>
              <Text style={listStyles.title}>{item.title}</Text>
              <Text style={listStyles.description}>{item.description.substring(0, 50)}{item.description.length > 50 ? '...' : ''}</Text>
          </View>
          {/* Use new Date(item.date) and toLocaleString() to display the date/time correctly */}
          <Text style={listStyles.date}>{new Date(item.date).toLocaleString()}</Text>
      </TouchableOpacity>
      
      {/* Touchable area for Delete */}
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={listStyles.deleteButton}>
          <Ionicons name="trash-bin-outline" size={24} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={entries.length === 0 ? listStyles.listEmpty : null}
        ListEmptyComponent={<Text style={listStyles.emptyText}>No entries yet. Tap 'Home' to add one!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
});

const listStyles = StyleSheet.create({
    listEmpty: { flex: 1, justifyContent: 'center' },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1, 
        borderBottomColor: '#eee',
        paddingRight: 10,
    },
    itemContent: {
        flex: 1, // Takes up remaining space
        paddingVertical: 15, 
        paddingLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
    description: { fontSize: 12, color: '#555', maxWidth: '60%' },
    date: { fontSize: 12, color: '#888', textAlign: 'right' },
    deleteButton: {
        padding: 10,
        marginLeft: 10,
    },
    emptyText: { textAlign: 'center', color: '#888' },
});