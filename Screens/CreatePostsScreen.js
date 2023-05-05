import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { AntDesign, Feather, EvilIcons, Ionicons, Image } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const initialState = {
  name: '',
  location: '',
  photo: null,
  coordinate: null,
};

export default function CreatePostsScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [cameraOn, setCameraOn] = useState(true);
  const [state, setState] = useState(initialState);
  const [photoUri, setPhotoUri] = useState(null);

    function toggleCameraType() {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  
  //     async function getLastPhoto() {
  // let { uri } = await Camera.takePictureAsync();
  // let asset = await MediaLibrary.createAssetAsync(uri);
  // let album = await MediaLibrary.getAlbumAsync('MyAlbum');
  // if (album === null) {
  //   album = await MediaLibrary.createAlbumAsync('MyAlbum', asset);
  // } else {
  //   await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
  // }
  // let assets = await MediaLibrary.getAssetsAsync({ first: 1, sortBy: MediaLibrary.SortBy.creationTime });
  // if (assets.length > 0) {
  //   let latestAsset = assets[0];
  //   let { uri } = await MediaLibrary.getAssetInfoAsync(latestAsset);
  // }
  //     }
  
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        await MediaLibrary.requestPermissionsAsync();

        setHasPermission(status === 'granted');
      })();
    }, []);

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }


  // Fonts
  // const [fontsLoaded] = useFonts({
  //   RobotoBold: require('../assets/fonts/RobotoBold.ttf'),
  //   RobotoMedium: require('../assets/fonts/RobotoMedium.ttf'),
  //   RobotoRegular: require('../assets/fonts/RobotoRegular.ttf'),
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }

    return (
      <View style={styles.container}>
        {!cameraOn && (
          <View style={styles.wrapper}>
            <View style={styles.fotoContainer}>
              {/* {state.photo ? (
              <Image source={{ uri: state.photo }} style={styles.photo} />
               ) : ( */}
              <Camera style={styles.camera2} type={type} ref={setCameraRef}>
              <TouchableOpacity
               
                onPress={async () => {
                  if (cameraRef) {
                    //   const { uri } = await cameraRef.takePictureAsync();
                    //   setState(prevState => ({ ...prevState, photo: uri }));
                    //   await MediaLibrary.createAssetAsync(uri);
                    //   await getLastPhoto()

                    // console.log('state.photo :>> ', state.photo);

                    setCameraOn(true);
                  }
                }}
              >
                <View style={styles.svgConatiner}>
                  <Feather name="camera" size={20} color="#BDBDBD" />
                </View>
              </TouchableOpacity>
              </Camera>
              {/* )}  */}
            </View>
            <Text style={styles.mainText}>Upload photo</Text>

            <View style={styles.form}>
              <TextInput placeholder="Name..." style={styles.inputName} />
              <View>
                <EvilIcons style={styles.iconLocation} name="location" size={24} color="#BDBDBD" />
                <TextInput placeholder="Location..." style={styles.inputLocation} />
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.uploadBtnActive}>
                <Text style={styles.uploadBtnTitleActive}>Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.deleteBtn}>
                <AntDesign style={styles.deleteSvg} name="delete" size={25} color="#DADADA" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {cameraOn && (
          <Camera
            style={styles.camera1}
            type={type}
            ref={ref => {
              setCameraRef(ref);
            }}
          >
            <View style={styles.cameraContainer}>
              <TouchableOpacity
                onPress={async () => {
                  if (cameraRef) {
                    setCameraOn(false);
                  }
                }}
              >
                <View style={styles.changeCam}>
                  <Ionicons name="close" size={24} color="#BDBDBD" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (cameraRef) {
                    const { uri } = await cameraRef.takePictureAsync();
                    setState(prevState => ({ ...prevState, photo: uri }));
                    await MediaLibrary.createAssetAsync(uri);
                  }
                }}
              >
                <View style={styles.makePhoto} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleCameraType}>
                <View style={styles.changeCam}>
                  <Ionicons name="ios-camera-reverse-outline" size={24} color="#BDBDBD" />
                </View>
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 60,
  },
  wrapper: {
    width: 343,
    height: '100%',
  },
  fotoContainer: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 8,
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
    border: 5,
    borderColor: 'black',
  },
  svgConatiner: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
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

  // Photo
  camera1: {
    flex: 1,
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  camera2: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: '50%'
  },

  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: -250,
    margin: 80,
  },
  makePhoto: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  changeCam: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    height: 40,
    width: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
  },
});
