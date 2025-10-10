import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EntryList, { Entry } from "../../components/EntryList";
import { useFocusEffect } from "@react-navigation/native";

export default function Explore() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const loadEntries = async () => {
    const data = await AsyncStorage.getItem("entries");
    if (data) setEntries(JSON.parse(data));
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  return (
    <View style={styles.container}>
      <EntryList entries={entries} setEntries={setEntries} reload={loadEntries} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
});
