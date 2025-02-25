import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Track } from "@/global/types";
import { BASE_URL } from "@/global/constants";
import { useAuth } from "@/context/AuthContext";

const AddSongScreen = () => {
  const { albumId } = useLocalSearchParams();
  const { user, mustUpdate, setMustUpdate } = useAuth()
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fonction de recherche
  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/tracks/search?query=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("An error occured while searching for song. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter une chanson
  const handleAddSong = async (trackId: number) => {
    try {
      await fetch(`${BASE_URL}/playlists/${albumId}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });
      setMustUpdate(!mustUpdate);
      alert("Track added !");
    } catch (err) {
      alert("An error occured while adding track. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a track..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#86CDFA" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Liste des résultats */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Image source={{ uri: item.cover }} style={styles.cover} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.songArtist}>{item.artist?.name}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddSong(item.id)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => setTimeout(() => router.replace("/library"), 10)}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#86CDFA",
    borderRadius: 8,
  },
  error: { color: "red", textAlign: "center", marginTop: 10 },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  cover: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  songInfo: { flex: 1 },
  songTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  songArtist: { color: "#aaa", fontSize: 14 },
  addButton: { backgroundColor: "#86CDFA", padding: 8, borderRadius: 6 },
  addButtonText: { color: "#000", fontWeight: "bold" },
  backButton: { marginTop: 20, alignItems: "center" },
  backText: { color: "#86CDFA", fontSize: 16 },
});

export default AddSongScreen;
