import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext"; // Importer le hook pour le contexte
import axios from "axios"; 
import { BASE_URL } from "@/global/constants";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Pour afficher les erreurs
  const { setIsAuthenticated, setUser } = useAuth(); // Utiliser le hook pour mettre à jour l'état d'authentification
  const router = useRouter();

  const handleLogin = async () => {
    setError(""); // Réinitialiser l'erreur à chaque nouvelle tentative de login

    try {
      // Effectuer l'appel API pour l'authentification
      const response = await axios.post(`${BASE_URL}/users/auth`, {
        username,
        passwordHash: password, // Assurez-vous d'envoyer le mot de passe sous forme de hash si nécessaire
      });

      if (response.status === 200) {
        const { id, username, email, profilePic, followers, following } = response.data; // Récupérer l'utilisateur depuis la réponse
        setIsAuthenticated(true); // Mettre l'utilisateur comme authentifié
        setUser({ id, username, email, profilePic, followers, following }); // Stocker l'utilisateur dans le contexte
        setTimeout(() => router.replace("/homepage"), 100); // Rediriger vers la page d'accueil
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Si l'API renvoie un 404, afficher l'erreur retournée
        setError(error.response.data.errorDescription); // Affiche l'erreur
      } else {
        // Autres erreurs
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      <TextInput
        placeholder="Username"
        style={styles.input}
        placeholderTextColor="#fff"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#fff"
        value={password}
        onChangeText={setPassword}
      />

      {/* Afficher l'erreur si elle existe */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
  },
  loginText: {
    color: "#121212",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginScreen;
