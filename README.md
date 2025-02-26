# Hearify Frontend 🎧

Hearify Frontend is a React Native application built with Expo, designed to provide an intuitive and seamless user experience for the Hearify platform. 

It connects to the Hearify Backend, enabling users to interact with the app's core features effortlessly, such as **finding songs**, **creating and managing playlists**, and **listening to music** from the albums of their favorite artists.

## 🚀 Features

✅ Modern UI with React Native & Expo

✅ API integration with a Spring Boot backend

✅ Optimized for Android

✅ Dockerized for easy development and deployment

✅ Environment-based API configuration

## 📦 Tech Stack

✨ React Native (Expo)

✨ TypeScript

✨ Context API (State Management)

✨ React Navigation (Routing)

✨ Axios (API Calls)

✨ Docker (Containerization)

## 🔧 Setup & Installation

### Prerequisites

First, you will need to clone the [hearify backend](https://github.com/Mhm-Rs/hearify-backend) project and launch the app locally or via Docker.

Once the backend project is launched at ```localhost:5000``` (if started locally) or ```localhost:5001``` (if started with Docker), go on to the next section.

### Launch the app with Docker

To use the containerized version of the frontend, follow these steps :
- Navigate to the root of the project
- Add execution rights to the **start.sh** file with ```chmod +x ./start.sh```
- Run the file with ```./start.sh```
> This script exports a variable with your public IP for the app and then launches the hearify_frontend container.
- The web interface of the app will start at the URL ```http://localhost:8081```, which can be used for the android emulator as well.
  
**If you want to run the app on a physical Android device :**

- Download the build apk for the app at [this link](https://expo.dev/artifacts/eas/whEYHAKMdYjTC6am39YAZX.apk) and install the app on your device.
- Run ```docker logs -f hearify_frontend```
- You will find in the logs the URL a QR code. Scan the QR code with your device to start the app.
> Both your Android device and the computer hosting the container should be on the same Wifi in order to connect to the app.

### Launch the app locally

**If you want to run the app on the web interface or using an Android emulator** : 
- Install all required dependencies with ```npm install```
- Launch the app at the root of your project with ```npx expo start --clear ```
> You will need node.js with a version greater or equal than 18, as well as the [expo-cli](https://github.com/expo/expo-cli) package


**If you want to run the app on a physical Android device :**
- In the ```.env.example``` file, replace the {LOCAL_IP} variable with the local IP address of your computer.
> Both your Android device and the computer hosting the container should be on the same Wifi in order to connect to the app.
- Rename the ```.env.example``` to ```.env```
- Install all required dependencies with ```npm install```
- Launch the app at the root of your project with ```npx expo start --clear ```

 ## 📝 Documentation

 You can use the following user to authenticate to the app:
 - username : **user1**
 - password : **administrator**

On the homescreen, you can navigate to the following tabs :
- **Library** : Allows you to find your downloaded albums and playlists. Clicking on a playlist brings you to the album details page, where you can add or remove songs.
- **Create** : Allows you to create a new playlist, with a name of your choice.
- **Account** Allows you to find the parameters of your account, including the followers count and recent playlists.

  See [this demo](https://youtube.com/shorts/-yF_j81tZys?feature=share) for a quick presentation of the app. 