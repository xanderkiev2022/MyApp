import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { AntDesign, Feather, EvilIcons, Ionicons,} from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { CameraComponent } from '../Components/Camera';

// Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { selectName, selectUserId } from '../redux/auth/authSelectors';
import { useSelector } from 'react-redux';

const initialState = {
  name: '',
  location: '',
  photo: null,
  coordinate: null,
};

const initialFocus = {
  name: false,
  location: false,
};

export default function CreatePostsScreen({ navigation }) {
  const [cameraRef, setCameraRef] = useState(null);
  const [state, setState] = useState(initialState);
  const [isFocused, setIsFocused] = useState(initialFocus);
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  

  const userId = useSelector(selectUserId);
  const userName = useSelector(selectName);

  // makePhoto
  const makePhoto = async () => {
    const photo = await cameraRef.takePictureAsync();
    const location = await Location.getCurrentPositionAsync({});
     const coords = {
       latitude: location.coords.latitude,
       longitude: location.coords.longitude,
     };
    setState(prevState => ({ ...prevState, photo: photo.uri, coordinate: coords }));
    await MediaLibrary.createAssetAsync(photo.uri); //фото збережеться в пам'ять телефону.
  };

  // OnFocus
  const handleFocus = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: true }));
  };
  const handleBlur = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: false }));
  };

  const openCamera = async () => {
    setState(prevState => ({ ...prevState, photo: null}));
    setCameraRef(cameraRef);
    setIsKeyboardShown(false);
  };

  // upload photo
  const uploadPhoto = async () => {
    try {
      const response = await fetch(state.photo); // дістаємо фото зі стейту
      const file = await response.blob(); // перетворюємо отриману фотографію на об'єкт Blob
      const uniquePostId = Date.now().toString(); // генеруємо унікальне ім"я для фото
      const linkToFile = ref(storage, `imgPost/${uniquePostId}`); // створюємо посилання на місце збереження фото в Firebase
      await uploadBytes(linkToFile, file); // завантажуємо фото
      const photoUrl = await getDownloadURL(ref(storage, `imgPost/${uniquePostId}`)); // отримуємо URL-адресу завантаженого фото
      const uploadedInfo = {
        displayName: userName,
        photo: photoUrl,
        name: state.name,
        location: state.location,
        coordinate: state.coordinate,
        userId,
        likes: [],
        comments: 0,
      };
      await addDoc(collection(db, 'posts'), uploadedInfo); // додаємо інформацію про пост до бази даних
      Keyboard.dismiss();
      setState(initialState);
      setIsKeyboardShown(false);
      navigation.navigate('Posts');
    } catch (error) {
    console.log(error);
    }
    }

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss();  setIsKeyboardShown(false)}}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {state.photo ? (
            <View style={styles.fotoContainer}>
              <Image source={{ uri: state.photo }} style={styles.photo} />
              <TouchableOpacity style={styles.svgConatiner} onPress={openCamera}>
                <Feather name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fotoContainer}>
              <CameraComponent makePhoto={makePhoto} location={state.location} photo={state.photo} setCameraRef={setCameraRef} />
            </View>
          )}

          <Text style={styles.mainText}>Upload photo</Text>

          <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>
            <View style={{ ...styles.form, marginBottom: isKeyboardShown ? -40 : 0 }}>
              <TextInput
                style={{
                  ...styles.inputName,
                  borderColor: isFocused.name ? '#FF6C00' : '#E8E8E8',
                }}
                placeholder="Name..."
                onFocus={() => {
                  handleFocus('name');
                  setIsKeyboardShown(true);
                }}
                onBlur={() => {
                  handleBlur('name');
                }}
                onChangeText={value => setState(prevState => ({ ...prevState, name: value }))}
                value={state.name}
              />

              <View
                style={{
                  ...styles.locationContainer,
                }}
              >
                <EvilIcons style={styles.iconLocation} name="location" size={24} color="#BDBDBD" />
                <TextInput
                  style={{
                    ...styles.inputLocation,
                    borderColor: isFocused.location ? '#FF6C00' : '#E8E8E8',
                  }}
                  placeholder="Location..."
                  onFocus={() => {
                    handleFocus('location');
                    setIsKeyboardShown(true);
                  }}
                  onBlur={() => {
                    handleBlur('location');
                  }}
                  value={state.location}
                  onChangeText={value => setState(prevState => ({ ...prevState, location: value }))}
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
    </TouchableWithoutFeedback>
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
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    // marginBottom: 32,
  },
  inputLocation: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
    height: 40,
    paddingLeft: 34,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    width: "100%",
    position: 'relative'
  },
  iconLocation: {
    position: 'absolute',
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 32,
    marginBottom: 32,
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
