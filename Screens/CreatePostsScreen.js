import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { AntDesign, Feather, EvilIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function CreatePostsScreen() {
  // Fonts
  const [fontsLoaded] = useFonts({
    RobotoBold: require('../assets/fonts/RobotoBold.ttf'),
    RobotoMedium: require('../assets/fonts/RobotoMedium.ttf'),
    RobotoRegular: require('../assets/fonts/RobotoRegular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

    return (
    <View style={styles.container}>

      <View style={styles.wrapper}>
        <View style={styles.fotoContainer}>
          <TouchableOpacity>
            <View style={styles.svgConatiner}>
              <Feather name="camera" size={20} color="#BDBDBD" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.mainText}>Upload photo</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Name..."
            style={styles.inputName}
          />
          <View>
            <EvilIcons style={styles.iconLocation} name="location" size={24} color="#BDBDBD" />
            <TextInput
              placeholder="Location..."
              style={styles.inputLocation}
            />
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.uploadBtnActive}>
            <Text style={styles.uploadBtnTitleActive}>Upload</Text>
          </TouchableOpacity>
        
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.deleteBtn}>
            <AntDesign style={styles.deleteSvg} name="delete" size={25} color="#DADADA" />
          </TouchableOpacity>
        </View>
      </View>
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
});
