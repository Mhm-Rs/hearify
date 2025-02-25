import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Playlist, Album } from "@/global/types";
import { BASE_URL } from "@/global/constants";

const LibraryScreen = () => {
  const [activeFilter, setActiveFilter] = useState("playlist");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const { user, mustUpdate, setMustUpdate } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;

        const [playlistsRes, albumsRes] = await Promise.all([
          fetch(`${BASE_URL}/users/${user.id}/playlists`).then((res) => res.json()),
          fetch(`${BASE_URL}/albums`).then((res) => res.json()),
        ]);

        setPlaylists(playlistsRes);
        setAlbums(albumsRes);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, mustUpdate]);

  if (loading) return <ActivityIndicator size="large" color="#86CDFA" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  const filteredItems = activeFilter === "playlist" ? playlists : albums;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={{ uri: user?.profilePic }} style={styles.profileImage} />
        <Text style={styles.headerText}>Your Library</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={24} color="white" style={styles.icon} />
          <Ionicons name="add-outline" size={28} color="white" />
        </View>
      </View>

      {/* FILTRES */}
      <View style={styles.filterContainer}>
        {["playlist", "album"].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton,
            ]}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
              {filter === "playlist" ? "Playlists" : "Albums"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE DES ÉLÉMENTS FILTRÉS */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemContainer} 
            onPress={() => router.push({pathname:"/album/[albumId]", params: { albumId: item.id, type:item.playlistCover ? "playlist" : "album" }})}
          >
            <Image source={{ uri: item.playlistCover || item.albumCover }} style={styles.itemImage} />
            <View>
              <Text style={styles.itemTitle}>{item.name}</Text>
              {item.artistName && <Text style={styles.itemArtist}>{item.artistName}</Text>}
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 20,
  },
  filterContainer: {
    flexDirection: "row",
    marginVertical: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#222",
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: "#86CDFA",
  },
  filterText: {
    color: "white",
    fontSize: 16,
  },
  activeFilterText: {
    color: "#000",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemArtist: {
    color: "#aaa",
    fontSize: 14,
  },
});

export default LibraryScreen;
