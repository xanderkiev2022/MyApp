import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { useFonts } from 'expo-font';

export default function RegistrationScreen() {
  //Fonts
  const [fontsLoaded] = useFonts({
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imgBg} source={require('../assets/img/bg-photo.jpg')}>
        <View style={{ ...styles.regScr, paddingBottom: 78 /*32*/ }}>
          <View style={styles.avatarBox}>
            <Image style={styles.avatarImg} source={require('../assets/img/avatar.png')} />
            <Image style={styles.addPhoto} source={require('../assets/svg/add.svg')} />
          </View>

          <Text style={styles.title}>Registration</Text>

          <View style={styles.regForm}>
            <TextInput style={{ ...styles.input, borderColor: '#E8E8E8' /*'#FF6C00'*/ }} placeholder="Login" />
            <TextInput style={{ ...styles.input, borderColor: '#E8E8E8' /*'#FF6C00'*/ }} placeholder="E-mail" />
            <View style={styles.inputPass}>
              <TextInput style={{ ...styles.input, borderColor: '#E8E8E8' /*'#FF6C00'*/ }} placeholder="Password" />
              <Text style={styles.showPass}> Show / Hide </Text>
            </View>

            <View>
              <TouchableOpacity style={styles.btn} title="Registerr">
                <Text style={styles.btnText}> Register </Text>
              </TouchableOpacity>

              <Text style={styles.haveAccount}> Already have an account? Log in </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    height: '69%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    position: 'relative',
  },

  avatarBox: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    top: -60,
  },
  avatarImg: {
    height: '100%',
    width: '100%',
    borderRadius: 8,
    resizeMode: 'contain',
  },

  addPhoto: {
    width: 25,
    height: 25,
    position: 'absolute',
    right: -14,
    bottom: 14,
  },

  title: {
    marginTop: 92,
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
  },
  regForm: {
    marginTop: 33,
    gap: 16,
  },
  input: {
    height: 50,
    width: 343,
    marginHorizontal: 16,
    paddingHorizontal: 16,

    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8E8E8',
    backgroundColor: '#F6F6F6',

    color: '#212121',
    placeholderTextColor: '#BDBDBD',
    fontSize: 16,
  },

  inputPass: {
    position: 'relative',
  },

  showPass: {
    position: 'absolute',
    right: 32,
    top: 16,
    color: '#1B4371',
    fontSize: 16,
  },
  btn: {
    marginTop: 43,
    backgroundColor: '#FF6C00',
    marginHorizontal: 16,
    padding: 16,
    alignItems: 'center',
    borderRadius: 100,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 19,
  },
  haveAccount: {
    color: '#1B4371',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 16,
  },
});
