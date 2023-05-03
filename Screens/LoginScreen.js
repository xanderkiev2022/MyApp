import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { useFonts } from 'expo-font';

const initialFocus = {
  email: false,
  password: false,
};

export default function LoginScreen() {
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

          <Text style={styles.title}>Log In</Text>

          <View style={styles.regForm}>
            <TextInput
              style={{ ...styles.input, borderColor: isFocused.email ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.email ? 'white' : '#F6F6F6' }}
              placeholder="E-mail"
              onFocus={() => { handleFocus('email') }}
              onBlur={() => { handleBlur('email') }}
            />
            <View style={styles.inputPass}>
              <TextInput
                style={{ ...styles.input, borderColor: isFocused.password ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.password ? 'white' : '#F6F6F6' }}
                placeholder="Password"
                onFocus={() => { handleFocus('password'); }}
                onBlur={() => { handleBlur('password'); }}
              />
              <Text style={styles.showPass}> Show / Hide </Text>
            </View>

            <View>
              <TouchableOpacity style={styles.btn} title="Registerr">
                <Text style={styles.btnText}> Log in </Text>
              </TouchableOpacity>

              <Text style={styles.haveAccount}> Don't have an account? Registration </Text>
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
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  regScr: {
    paddingHorizontal: 16,
    width: '100%',
    height: '61%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    position: 'relative',
  },

  title: {
    marginTop: 32,
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
