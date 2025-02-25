import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MiniPlayer from "../../components/miniplayer";
import { AlbumDetailled } from "@/global/types";
import { BASE_URL } from "@/global/constants";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const AlbumDetails = () => {
  const { albumId, type } = useLocalSearchParams();
  const router = useRouter();
  const { mustUpdate, setMustUpdate, currentTrack, setCurrentTrack, setCurrentTrackNullSafe } = useAuth();

  const [album, setAlbum] = useState<AlbumDetailled | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);


  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        if (!albumId || !type) return;

        const response = await fetch(`${BASE_URL}/${type === "album" ? "albums" : "playlists"}/${albumId}`);
        const data = await response.json();
        setAlbum(data);
      } catch (err) {
        setError("Failed to load album details");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId, type, mustUpdate]);

  if (loading) return <ActivityIndicator size="large" color="#86CDFA" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!album) return <Text style={styles.error}>Album introuvable</Text>;

  // Calcul de la durée totale en secondes
  const totalDurationSeconds = album.tracks?.reduce((sum, track) => sum + track.duration, 0) | 0;
  const durationHours = Math.floor(totalDurationSeconds / 3600);
  const durationMinutes = Math.floor((totalDurationSeconds % 3600) / 60);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/playlists/${album.id}`);
      if (response.status === 204) {
        setMustUpdate(!mustUpdate);
        setTimeout(() => router.replace("/library"), 100); // Rediriger vers la page d'accueil
      }
    } catch (error: any) {
      // Autres erreurs
      setError("An error occurred while deleting playlist. Please try again later.");
    }
  }

  const handleRemoveTrack = async (trackId: number) => {
    try {
      await axios.delete(`${BASE_URL}/playlists/${albumId}/tracks/${trackId}`);
      setAlbum((prev) => prev ? { ...prev, tracks: prev.tracks.filter(track => track.id !== trackId) } : null);
      alert("Track deleted !")
    } catch {
      alert("An error occurred while deleting track. Please try again later.");
    }
  };

  const handlePlayTrack = async (trackId: number) => {
      setCurrentTrackNullSafe(album.tracks.filter(track => track.id == trackId)[0])
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: album.cover }} style={styles.cover} />
        <Text style={styles.title}>{album.name}</Text>

        {/* Affichage conditionnel de "saves" */}
        {(album.saves || totalDurationSeconds > 0) && (
          <Text style={styles.info}>
            {album.saves && `${album.saves} saves`}
            {album.saves && totalDurationSeconds > 0 && " • "}
            {totalDurationSeconds > 0 && `${durationHours}h ${durationMinutes}min`}
          </Text>
        )}

        <View style={styles.controlsContainer}>
          {type === "playlist" && (
            <>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push({ pathname: "/addsongs", params: { albumId } })}
              >
                <Text style={styles.addText}>Add Songs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete playlist</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="shuffle" size={24} color="#86CDFA" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="play" size={24} color="#86CDFA" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Liste des tracks */}
        <View style={styles.songList}>
          {album.tracks?.map((track) => {
            const minutes = Math.floor(track.duration / 60);
            const seconds = track.duration % 60;

            return (
              <TouchableOpacity onPress={() => setSelectedTrack(track.id === selectedTrack ? null : track.id)}>
                <View key={track.id} style={styles.trackContainer}>
                  <Image source={{ uri: type === "album" ? album.cover : track.cover }} style={styles.trackCover} />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    {track.artist && <Text style={styles.trackArtist}>{track.artist.name}</Text>}
                  </View>
                  <Text style={styles.trackDuration}>{`${minutes}min ${seconds}s`}</Text>
                  <TouchableOpacity style={styles.iconButton} onPress={() => handlePlayTrack(track.id)}>
                    <Ionicons name="play" size={24} color="#86CDFA" />
                  </TouchableOpacity>
                  {type === "playlist" && selectedTrack === track.id && (
                    <TouchableOpacity style={styles.deleteTrackButton} onPress={() => handleRemoveTrack(track.id)}>
                      <MaterialIcons name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>


        <TouchableOpacity style={styles.backButton} onPress={() => setTimeout(() => router.replace("/library"), 10)}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  cover: { width: "100%", height: 250, borderRadius: 10 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 10 },
  info: { color: "#86CDFA", fontSize: 14, marginBottom: 20 },
  controlsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  addButton: { backgroundColor: "#86CDFA", padding: 10, borderRadius: 8 },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 8 },
  addText: { color: "#000", fontSize: 16, fontWeight: "bold" },
  deleteText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonsContainer: { flexDirection: "row", gap: 10 },
  iconButton: { padding: 10 },

  // Styles pour les tracks
  songList: { marginTop: 20 },
  trackContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  trackCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  trackArtist: {
    color: "#aaa",
    fontSize: 14,
  },

  backButton: { marginTop: 20, alignItems: "center" },
  backText: { color: "#86CDFA", fontSize: 16 },
  trackDuration: {
    color: "#86CDFA",
    fontSize: 14,
    marginRight: 10,
  },
  deleteTrackButton: { padding: 10, marginRight: 10 },

});

export default AlbumDetails;
