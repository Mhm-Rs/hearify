import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '@/global/constants';
import { useAuth } from '@/context/AuthContext';

const CreatePlaylistScreen = () => {
  const [playlistName, setPlaylistName] = useState('My awesome new playlist');
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState("")
  const router = useRouter();
  const { user, mustUpdate, setMustUpdate } = useAuth();

  const handleCreate = async () => {
    try {
      // Effectuer l'appel API pour l'authentification
      const response = await axios.post(`${BASE_URL}/playlists`, {
        name: playlistName,
        userId: user?.id
      });

      if (response.status === 201) {
        setIsCreated(true);
        setMustUpdate(!mustUpdate)
        setTimeout(() => {
          router.replace("/library");
        }, 500);
      }
    } catch (error: any) {
      // Autres erreurs
      setError("An error occurred. Please try again later.");
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Give your playlist a name</Text>
      <TextInput
        style={styles.input}
        value={playlistName}
        onChangeText={setPlaylistName}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setTimeout(() => router.replace("/homepage"), 100)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Afficher l'erreur si elle existe */}
      {isCreated ? <Text style={styles.successText}>Your playlist has been successfully created.</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: 'white',
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#86CDFA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  createText: {
    color: 'white',
    fontSize: 16,
  },
  successText: {
    color: "green",
    marginTop: 10,
  },
});

export default CreatePlaylistScreen;
