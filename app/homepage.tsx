import MiniPlayer from "@/components/miniplayer";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from "react-native";

import { Album, Artist, Track } from "@/global/types"; 
import { BASE_URL } from "@/global/constants";

export default function HomeScreen() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  // Effectuer les appels API au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistsResponse = await fetch(`${BASE_URL}/artists/random`);
        const albumsResponse = await fetch(`${BASE_URL}/albums/random`);
        const tracksResponse = await fetch(`${BASE_URL}/tracks/random`);

        const artistsData = await artistsResponse.json();
        const albumsData = await albumsResponse.json();
        const tracksData = await tracksResponse.json();

        setArtists(artistsData);
        setAlbums(albumsData);
        setTracks(tracksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Popular Artists Section */}
        <View style={styles.firstSection}>
          <Text style={styles.sectionTitle}>Popular Artists</Text>
          <FlatList
            data={artists}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()} // Assure-toi que l'id est un string
            renderItem={({ item }) => (
              <View style={styles.artistContainer}>
                <Image source={{ uri: item.coverImage }} style={styles.artistImage} />
                <Text style={styles.artistName}>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* Popular Albums This Week Section */}
        <View style={styles.firstSection}>
          <Text style={styles.sectionTitle}>Popular Albums This Week</Text>
          <FlatList
            data={albums}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()} // Assure-toi que l'id est un string
            renderItem={({ item }) => (
              <View style={styles.albumContainer}>
                <Image source={{ uri: item.albumCover }} style={styles.albumImage} />
                <Text style={styles.albumTitle}>{item.name}</Text>
                <Text style={styles.artistName}>{item.artistName}</Text> {/* Nom de l'artiste sous le nom de l'album */}
              </View>
            )}
          />
        </View>

        {/* Find Your Next Favorite Song Section (nécessite un scroll) */}
        <View style={styles.lastSection}>
          <Text style={styles.sectionTitle}>Find Your Next Favorite Song</Text>
          <FlatList
            data={tracks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()} // Assure-toi que l'id est un string
            renderItem={({ item }) => (
              <View style={styles.songContainer}>
                <Image source={{ uri: item.cover }} style={styles.songImage} />
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.artistName}>{item.artist?.name}</Text> {/* Nom de l'artiste sous le titre de la chanson */}
              </View>
            )}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    padding: 16,
  },
  firstSection: {
    minHeight: 200, 
    marginBottom: 20,
  },
  lastSection: {
    minHeight: 300, 
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  artistContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#86CDFA",
  },
  artistName: {
    color: "#ccc", // Moins lumineux pour ne pas voler la vedette
    marginTop: 5,
    fontSize: 12, // Plus petit pour plus de discrétion
  },
  albumContainer: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
  },
  albumImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  albumTitle: {
    color: "#fff",
    marginTop: 5,
  },
  songContainer: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
  },
  songImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  songTitle: {
    color: "#fff",
    marginTop: 5,
  },
});
