import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';

const initialFocus = {
  email: false,
  password: false,
  login: false,
};

export default function RegistrationScreen() {

// OnFocus
  const [isFocused, setIsFocused] = useState(initialFocus);

  const handleFocus = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: true }));
  };
  const handleBlur = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: false }));
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

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imgBg} source={require('../assets/img/bg-photo.jpg')}>
        <View style={styles.regScr}>
          <View style={styles.avatarBox}>
            <Image style={styles.avatarImg} source={require('../assets/img/avatar.png')} />
            {/* <AntDesign name="pluscircleo" style={styles.addRemovePhoto} size={25} color="#FF6C00" backgroundColor="white" /> */}
            <AntDesign name="closecircleo" style={styles.addRemovePhoto} size={25} color="#E8E8E8" backgroundColor="white" />
          </View>

          <Text style={styles.title}>Registration</Text>

          <View style={styles.regForm}>
            <TextInput
              style={{ ...styles.input, borderColor: isFocused.login ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.login ? 'white' : '#F6F6F6' }}
              placeholder="Login"
              onFocus={() => {
                handleFocus('login');
              }}
              onBlur={() => {
                handleBlur('login');
              }}
            />
            <TextInput
              style={{ ...styles.input, borderColor: isFocused.email ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.email ? 'white' : '#F6F6F6' }}
              placeholder="E-mail"
              onFocus={() => {
                handleFocus('email');
              }}
              onBlur={() => {
                handleBlur('email');
              }}
            />
            <View style={styles.inputPass}>
              <TextInput
                style={{ ...styles.input, borderColor: isFocused.password ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.password ? 'white' : '#F6F6F6' }}
                placeholder="Password"
                onFocus={() => {
                  handleFocus('password');
                }}
                onBlur={() => {
                  handleBlur('password');
                }}
              />
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

  addRemovePhoto: {
    position: 'absolute',
    left: 108,
    top: 80,
    borderRadius: 12.5,
  },

  title: {
    marginTop: 92,
    fontFamily: 'RobotoMedium',
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
    // placeholderTextColor: '#BDBDBD',
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
    marginTop: 27,
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
