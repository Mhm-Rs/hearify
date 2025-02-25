import React, {useState, useEffect} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/global/constants";

const AccountScreen = () => {
  const router = useRouter();
  const { user, mustUpdate, setMustUpdate } = useAuth();

  const [displayedUser, setDisplayedUser] = useState({
    id: user?.id,
    username: user?.username,
    followers: user?.followers,
    following: user?.following,
    profilePicture: user?.profilePic, // Image par défaut
    playlists: [
      {
        id:"1",
        name:"Loading...",
        cover:"https://media.tenor.com/G7LfW0O5qb8AAAAj/loading-gif.gif"
      }
    ]
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/1/playlists`);
        const data = await response.json();

        // Mettre à jour l'état avec les données récupérées
        setDisplayedUser((prevUser) => ({
          ...prevUser,
          playlists: data.map((playlist: { name: string, id: number, playlistCover: string }) => ({
            id: playlist.id,
            name: playlist.name,
            cover: playlist.playlistCover
          })),
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchUserData();
  }, [mustUpdate]);


  return (
    <View style={styles.container}>
      {/* Section Profil */}
      <View style={styles.profileSection}>
        <Image source={{ uri: displayedUser.profilePicture }} style={styles.profileImage} />
        <Text style={styles.username}>{displayedUser.username}</Text>
        <Text style={styles.followInfo}>
          {displayedUser.followers} followers • {displayedUser.following} following
        </Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Section Playlists */}
      <View style={styles.playlistSection}>
        <Text style={styles.sectionTitle}>Playlists</Text>
        <FlatList
          data={displayedUser.playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.playlistItem}>
              <Image source={{ uri: item.cover }} style={styles.playlistCover} />
              <Text style={styles.playlistName}>{item.name}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.seeAllButton} onPress={() => setTimeout(() => router.replace("/library"), 100)}>
          <Text style={styles.seeAllText}>See all playlists</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#333",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  followInfo: {
    color: "gray",
    fontSize: 14,
    marginBottom: 10,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#86CDFA",
  },
  editText: {
    color: "#86CDFA",
  },
  playlistSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  playlistCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  playlistName: {
    fontSize: 16,
    color: "white",
  },
  seeAllButton: {
    marginTop: 50,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#86CDFA",
  },
  seeAllText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default AccountScreen;
