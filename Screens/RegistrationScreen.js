import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';

// Firebase
import { register } from '../redux/auth/authOperations';
import { useDispatch, useSelector } from 'react-redux';
import { selectError } from '../redux/auth/authSelectors';
import { removeError } from '../redux/auth/authSlice';
import { BgImage } from '../Components/BgImage';
import Avatar from '../Components/Avatar';

const initialFocus = {
  login: false,
  email: false,
  password: false,
};

const initialState = {
  login: '',
  email: '',
  password: '',
  photo: null,
};

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();
  const error = useSelector(selectError);

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

  // Submit
  const handleSubmit = () => {
    setState(initialState);
    dispatch(register(state));
    
  };

    // WrongPass
  useEffect(() => {
    if (error) {alert(error); dispatch(removeError());}
  }, [error]);

  // Login
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <BgImage>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ ...styles.regScr, height: isFocused.login || isFocused.email || isFocused.password ? '85%' : '69%' }}>
            <View style={styles.avatarBox}>
              <Avatar setState={setState} />
              {/* <Image style={styles.avatarImg} source={require('../assets/img/avatar.png')} /> */}
              {/* <AntDesign name="pluscircleo" style={styles.addRemovePhoto} size={25} color="#FF6C00" backgroundColor="white" /> */}
              {/* <AntDesign name="closecircleo" style={styles.addRemovePhoto} size={25} color="#E8E8E8" backgroundColor="white" /> */}
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
                    <Text style={styles.showPass} onPress={() => setIsPasswordShown(prev => !prev)}>
                      {' '}
                      Hide{' '}
                    </Text>
                  ) : (
                    <Text style={styles.showPass} onPress={() => setIsPasswordShown(prev => !prev)}>
                      {' '}
                      Show{' '}
                    </Text>
                  )}
                </View>
              </KeyboardAvoidingView>

              <View>
                <TouchableOpacity style={styles.btn} title="Register" onPress={handleSubmit}>
                  <Text style={styles.btnText}> Register </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn2} title="Login" onPress={handleLogin}>
                  <Text style={styles.haveAccount}>Already have an account? Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </BgImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily: 'RobotoRegular',
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
    borderRadius: 16,
    resizeMode: 'contain',
  },

  addRemovePhoto: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 108,
    top: 80,
    borderRadius: 25,
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
