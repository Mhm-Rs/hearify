import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { Audio } from "expo-av";

const MiniPlayer = () => {
  const { currentTrack } = useAuth();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effet pour stopper la musique quand la piste change
  useEffect(() => {
    const stopAndUnloadSound = async () => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
    };

    stopAndUnloadSound();
  }, [currentTrack]); // Se déclenche à chaque changement de `currentTrack`

  if (!currentTrack) return null;

  const handlePlayPause = async () => {
    try {
      if (sound) {
        // Met en pause ou reprend la lecture
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Charger et jouer la nouvelle musique
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: currentTrack.trackPlayUrl },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture :", error);
    }
  };

  return (
    <View style={styles.miniPlayer}>
      <Image source={{ uri: currentTrack.cover }} style={styles.miniCover} />
      <View style={styles.miniInfo}>
        <Text style={styles.miniTitle}>{currentTrack.title}</Text>
        <Text style={styles.miniArtist}>{currentTrack.artist?.name}</Text>
      </View>
      <View style={styles.miniActions}>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#86CDFA" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#86CDFA" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  miniPlayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#222",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  miniCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  miniInfo: {
    flex: 1,
    marginLeft: 10,
  },
  miniTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  miniArtist: {
    color: "#aaa",
    fontSize: 14,
  },
  miniActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});

export default MiniPlayer;
