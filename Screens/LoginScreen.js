import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useFonts } from 'expo-font';

// Firebase
import { login } from '../redux/auth/authOperations';
import { useDispatch, useSelector } from 'react-redux';

const initialFocus = {
  email: false,
  password: false,
};

const initialState = {
  email: '',
  password: '',
};

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  
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
    setState(initialState);
    dispatch(login(state));
    navigation.navigate('Home');
  };

  // Registration
  const handleRegistration = () => {
    navigation.navigate('Registration');
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imgBg} source={require('../assets/img/bg-photo.jpg')}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ ...styles.regScr, height: isFocused.email || isFocused.password ? '47%' : '61%' }}>
            <Text style={styles.title}>Log In</Text>

            <View style={styles.regForm}>
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
                    <Text style={styles.showPass} onPress={() => setIsPasswordShown(prev => !prev)}>
                      Hide
                    </Text>
                  ) : (
                    <Text style={styles.showPass} onPress={() => setIsPasswordShown(prev => !prev)}>
                      Show{' '}
                    </Text>
                  )}
                </View>
              </KeyboardAvoidingView>

              <View>
                <TouchableOpacity style={styles.btn} title="LogIn" onPress={handleSubmit}>
                  <Text style={styles.btnText}> Log in </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn2} title="Registration" onPress={handleRegistration}>
                  <Text style={styles.haveAccount}> Don't have an account? Registration </Text>
                </TouchableOpacity>
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
    // height: '47%',
    // height: '61%',
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
    // marginBottom: 114,
  },
});
