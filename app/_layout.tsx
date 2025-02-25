import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "../context/AuthContext";
import MiniPlayer from "@/components/miniplayer";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Tabs
        screenOptions={{
          tabBarStyle: { display: "none" }, // Cache la navbar
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ headerShown: false }} />
      </Tabs>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navigation */}
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#86CDFA",
          tabBarInactiveTintColor: "#fff",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="homepage"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Your Library",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="library-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="album" options={{ href: null }} />
        <Tabs.Screen name="addsongs" options={{ href: null }} />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>

      {/* MiniPlayer placé de façon ABSOLUE au-dessus de la barre de navigation */}
      <View style={styles.miniPlayer}><MiniPlayer /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#000",
  },
  miniPlayer: {
    position: "absolute",
    bottom: 50, // Ajuste en fonction de la hauteur de la barre de navigation
    left: 0,
    right: 0,
    zIndex: 10, // Pour être sûr qu'il est au-dessus
  },
});

