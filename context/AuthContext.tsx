import { Track, User } from "@/global/types";
import React, { createContext, useState, useContext, ReactNode } from "react";

// Définition du type de l'état

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  mustUpdate:boolean;
  setMustUpdate: (value: boolean) => void;
  currentTrack: Track | null;
  setCurrentTrack: (value: Track) => void;
  setCurrentTrackNullSafe : (value : Track) => void;
};



// Crée le contexte avec des valeurs par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur de contexte
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mustUpdate, setMustUpdate] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const setCurrentTrackNullSafe = (track: Track | null) => {
    // Only update if track ID actually changes
    if (currentTrack == null) setCurrentTrack(track);
    else if (track?.id !== currentTrack?.id) {
      setCurrentTrack(track);
    }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, mustUpdate, setMustUpdate, currentTrack, setCurrentTrack, setCurrentTrackNullSafe }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser facilement le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
