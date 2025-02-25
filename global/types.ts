export type Track = {
    id: number;
    title: string;
    duration: number;
    cover?: string;
    artist?: Artist;
    trackPlayUrl: string;
};

export type Artist = {
    id: number;
    name: string;
    coverImage: string;
    bio: string;
};

export type AlbumDetailled = {
    id: number;
    name: string;
    cover: string;
    saves?: string;
    tracks: Track[];
};

export type User = {
    id: string;
    username: string;
    email: string;
    profilePic: string;
    followers: number;
    following: number;
};


export type Playlist = {
  id: number;
  name: string;
  playlistCover: string;
  userId:string
  albumCover:string;
  artistName:string;
};

export type Album = {
  id: number;
  name: string;
  albumCover: string;
  artistName:string;
  playlistCover:string;
  userId:string
};