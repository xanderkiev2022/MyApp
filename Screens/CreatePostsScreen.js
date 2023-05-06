import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Keyboard } from 'react-native';
import { AntDesign, Feather, EvilIcons, Ionicons,} from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { CameraComponent } from '../Components/Camera';

const initialState = {
  name: '',
  place: '',
};

const initialFocus = {
  name: false,
  place: false,
};

export default function CreatePostsScreen({ navigation }) {
  const [cameraRef, setCameraRef] = useState(null);
  const [state, setState] = useState(initialState);
  const [photo, setPhoto] = useState('');
  const [location, setLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(initialFocus);

  // makePhoto
  const makePhoto = async () => {
    const photo = await cameraRef.takePictureAsync();
    const location = await Location.getCurrentPositionAsync({});
    setPhoto(photo.uri);
    setLocation(location.coords);
    await MediaLibrary.createAssetAsync(photo.uri); //фото збережеться в пам'ять телефону.
  };

  // OnFocus
  const handleFocus = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: true }));
    console.log('state :>> ', state);
  };
  const handleBlur = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: false }));
  };

  const openCamera = async () => {
    setPhoto(null);
    setLocation(null);
    setCameraRef(cameraRef);
  };

  // Fonts
  const [fontsLoaded] = useFonts({
    RobotoBold: require('../assets/fonts/RobotoBold.ttf'),
    RobotoMedium: require('../assets/fonts/RobotoMedium.ttf'),
    RobotoRegular: require('../assets/fonts/RobotoRegular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // upload photo
  const uploadPhoto = () => {
      // uploadToServer();
      navigation.navigate('Posts', {
        photo,
        location,
        state,
      });
      Keyboard.dismiss(); 
      setState(initialState);
      setPhoto('');
    }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {photo ? (
          <View style={styles.fotoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity style={styles.svgConatiner} onPress={openCamera}>
              <Feather name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.fotoContainer}>
            <CameraComponent makePhoto={makePhoto} location={location} photo={photo} setCameraRef={setCameraRef} />
          </View>
        )}

        <Text style={styles.mainText}>Upload photo</Text>

        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View style={styles.form}>
            <TextInput
              style={{ ...styles.inputName, borderColor: isFocused.name ? '#FF6C00' : '#E8E8E8' }}
              placeholder="Name..."
              onFocus={() => {
                handleFocus('name');
              }}
              onBlur={() => {
                handleBlur('name');
              }}
              onChangeText={value => setState(prevState => ({ ...prevState, name: value }))}
              value={state.name}
            />

            <View>
              <EvilIcons style={styles.iconLocation} name="location" size={24} color="#BDBDBD" />
              <TextInput
                style={{ ...styles.inputLocation, borderColor: isFocused.place ? '#FF6C00' : '#E8E8E8' }}
                placeholder="Location..."
                onFocus={() => {
                  handleFocus('place');
                }}
                onBlur={() => {
                  handleBlur('place');
                }}
                value={state.place}
                onChangeText={value => setState(prevState => ({ ...prevState, place: value }))}
              />
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.uploadBtnActive} onPress={uploadPhoto}>
              <Text style={styles.uploadBtnTitleActive}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.deleteBtn}>
              <AntDesign style={styles.deleteSvg} name="delete" size={25} color="#DADADA" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  wrapper: {
    width: 343,
    height: '100%',
    position: 'relative',
  },
  fotoContainer: {
    width: 343,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 8,
    backgroundColor: '#F6F6F6',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  svgConatiner: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  mainText: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    color: '#BDBDBD',
    marginBottom: 48,
  },
  form: {
    justifyContent: 'center',
  },
  inputName: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 32,
  },
  inputLocation: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
    height: 50,
    paddingLeft: 34,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 32,
  },
  iconLocation: {
    justifyContent: 'center',
    marginBottom: -38,
  },
  uploadBtn: {
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
    width: 343,
    height: 51,
  },
  uploadBtnActive: {
    backgroundColor: '#FF6C00',
    borderRadius: 100,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
    width: 343,
    height: 51,
  },
  uploadBtnTitle: {
    color: '#BDBDBD',
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
  },
  uploadBtnTitleActive: {
    color: '#FFFFFF',
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
  },
  deleteBtn: {
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  deleteSvg: {
    alignSelf: 'center',
  },
});
