import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { PanResponder, Animated } from 'react-native';

export const CameraComponent = ({ photo, location, makePhoto, setCameraRef }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [errorMsg, setErrorMsg] = useState(null);
    const [gesturePosition, setGesturePosition] = useState(new Animated.ValueXY());

  // отримуємо дозволи від користувача
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // вибираємо камеру
  function toggleCameraType() {
    setCameraType(cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={setCameraRef} type={cameraType}>
        <TouchableOpacity style={styles.svgConatiner} onPress={makePhoto}>
            <Feather name="camera" size={20} color="#BDBDBD" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.changeCam} onPress={toggleCameraType}>
            <Ionicons name="ios-camera-reverse-outline" size={24} color="#BDBDBD" />
        </TouchableOpacity>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: 343,
    alignItems: 'center',
  },

  svgConatiner: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 90,
    right: 141,
  },
  changeCam: {
    top: 10,
    right: 10,
    height: 40,
    width: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    position: 'absolute',
  },
});
