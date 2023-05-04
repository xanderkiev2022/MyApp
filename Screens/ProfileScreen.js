import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function ProfileScreen() {
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
      <ImageBackground style={styles.imgBg} source={require('../assets/img/bg-photo.jpg')}>
        <View style={styles.regScr}>
          <View style={styles.avatarBox}>
            <Image style={styles.avatarImg} source={require('../assets/img/avatar.png')} />
            <AntDesign name="closecircleo" style={styles.addRemovePhoto} size={25} color="#E8E8E8" />
          </View>
          <Text style={styles.avatarName}>Natali Romanova</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily: 'RobotoRegular',
  },
  imgBg: {
    flex: 1,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  regScr: {
    paddingHorizontal: 16,
    width: '100%',
    height: '85%',

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    position: 'relative',
  },
  avatarBox: {
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    marginTop: -60,
    alignSelf: 'center',
    marginBottom: 32,
    alignItems: 'flex-end',
  },
  avatarImg: {
    height: '100%',
    width: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },

  addRemovePhoto: {
    backgroundColor: '#fff',
    position: 'absolute',
    left: 108,
    top: 80,
    borderRadius: 25,
  },
  avatarName: {
    fontFamily: 'RobotoMedium',
    fontSize: 30,
    lineHeight: 35,
    color: '#212121',
    marginBottom: 32,
    alignSelf: 'center',
  },
});