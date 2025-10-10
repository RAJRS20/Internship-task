import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Entry {
  id: string;
  title: string;
  description?: string;
  image?: string;
  location?: string;
  date: string;
}

interface EntryListProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  reload?: () => void;
}

export default function EntryList({ entries, setEntries, reload }: EntryListProps) {
  const deleteEntry = async (id: string) => {
    const newEntries = entries.filter((e) => e.id !== id);
    setEntries(newEntries);
    await AsyncStorage.setItem("entries", JSON.stringify(newEntries));
  };

  return (
    <SwipeListView
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.rowFront}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            {item.location ? <Text style={styles.location}>📍 {item.location}</Text> : null}
          </View>
          {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
        </View>
      )}
      renderHiddenItem={({ item }) => (
        <TouchableOpacity
          style={styles.rowBack}
          onPress={() => deleteEntry(item.id)}
        >
          <Text style={styles.backText}>Delete</Text>
        </TouchableOpacity>
      )}
      rightOpenValue={-75}
      disableRightSwipe
      previewRowKey={entries[0]?.id}
      previewOpenValue={-40}
      previewOpenDelay={3000}
    />
  );
}

const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  textContainer: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 16 },
  description: { color: "#555" },
  location: { color: "#555", marginTop: 2 },
  image: { width: 50, height: 50, borderRadius: 6, marginLeft: 10 },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#ff3b30",
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 8,
    paddingRight: 20,
    marginVertical: 5,
  },
  backText: { color: "#fff", fontWeight: "bold" },
});
