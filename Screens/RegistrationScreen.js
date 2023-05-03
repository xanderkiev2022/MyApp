import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';

const initialFocus = {
  login: false,
  email: false,
  password: false,
};

const initialState = {
  login: '',
  email: '',
  password: '',
};

export default function RegistrationScreen() {

// OnFocus
  const [state, setState] = useState(initialState);
  const [isFocused, setIsFocused] = useState(initialFocus);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

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

// Submit
  const handleSubmit = () => {
  
  console.log('login:', state.login);
  console.log('email:', state.email);
  console.log('password:', state.password);
  setState(initialState);
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imgBg} source={require('../assets/img/bg-photo.jpg')}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                value={state.login}
                onChangeText={value => setState(prevState => ({ ...prevState, login: value }))}
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
                value={state.email}
                onChangeText={value => setState(prevState => ({ ...prevState, email: value.trim() }))}
                autoComplete="email"
              />
              
              <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <View style={styles.inputPass}>
                  <TextInput
                    style={{
                      ...styles.input,
                      borderColor: isFocused.password ? '#FF6C00' : '#E8E8E8',
                      backgroundColor: isFocused.password ? 'white' : '#F6F6F6',
                    }}
                    placeholder="Password"
                    onFocus={() => {
                      handleFocus('password');
                    }}
                    onBlur={() => {
                      handleBlur('password');
                    }}
                    value={state.password}
                    onChangeText={value => setState(prevState => ({ ...prevState, password: value }))}
                    autoComplete="password"
                    secureTextEntry={!isPasswordShown}
                  />
                  
                  {isPasswordShown === true ? (
                    <Text style={styles.showPass} onPress={() => setIsPasswordShown(prev => !prev)}> Hide </Text>
                  ) : (
                    <Text style={styles.showPass} onPress={() => setIsPasswordShown(prev => !prev)}> Show </Text>
                  )}   
                </View>
              </KeyboardAvoidingView>

              <View>
                <TouchableOpacity style={styles.btn} title="Register" onPress={handleSubmit}>
                  <Text style={styles.btnText}> Register </Text>
                </TouchableOpacity>

                <Text style={{ ...styles.haveAccount, marginBottom: isFocused.login || isFocused.email || isFocused.password ? 32 : 72 }}>
                  
                  Already have an account? Log in
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    // marginBottom: 78,
  },
});
