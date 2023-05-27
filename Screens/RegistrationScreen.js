import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';

// Firebase
import { register } from '../redux/auth/authOperations';
import { useDispatch, useSelector } from 'react-redux';
import { selectError, selectPhoto } from '../redux/auth/authSelectors';
import { removeError } from '../redux/auth/authSlice';
import { BgImage } from '../Components/BgImage';
import Avatar from '../Components/Avatar';
import { listOfEmails } from '../Utils/listOfEmails';

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
  const avatar = useSelector(selectPhoto);
  const error = useSelector(selectError);

  // OnFocus
  const [state, setState] = useState(initialState);
  const [isFocused, setIsFocused] = useState(initialFocus);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleFocus = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: true }));
    setIsActive(true);
  };
  const handleBlur = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: false }));
    if (state.password && input === 'password') {
      handleSubmit();
    }
  };

  // Submit
  useEffect(() => {
    setState(prevState => ({ ...prevState, photo: avatar }));
  }, [avatar]);

  const handleSubmit = () => {
    dispatch(register(state));
    setState(initialState);
  };

  // WrongPass
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(removeError());
    }
  }, [error]);

  // Login
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const hideKayboard = () => {
    Keyboard.dismiss();
    setIsFocused(initialFocus);
    setIsActive(false);
    setKeyboardHeight(0);
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ({ endCoordinates }) => {
      setKeyboardHeight(endCoordinates.height);
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const nextInputRef = useRef(null);

  return (
    <TouchableWithoutFeedback onPress={hideKayboard}>
      <View style={styles.container}>
        <BgImage>
          <View
            style={{
              ...styles.regScr,
              // height: isActive ? '76%' : '69%'
              // height: isActive ? 549+keyboardHeight-150 : '69%',
              paddingBottom: isActive ? 160 : 78,
            }}
          >
            <View style={styles.avatarBox}>
              <Avatar />
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
                onChangeText={value => {
                  const trimmedValue = value.trim().toLowerCase();
                  setState(prevState => ({ ...prevState, email: value.trim() }));
                  if (listOfEmails.some(email => trimmedValue.includes(email))) {
                    inputPass.focus();
                    // hideKayboard();
                  }
                }}
                autoComplete="email"
              />

              <View style={styles.inputPass}>
                <TextInput
                  ref={ref => {
                    inputPass = ref; // Зберігаємо посилання на елемент inputPass
                  }}
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

              <View>
                <TouchableOpacity style={styles.btn} title="Register" onPress={handleSubmit}>
                  <Text style={styles.btnText}> Register </Text>
                </TouchableOpacity>
                <TouchableOpacity title="Login" onPress={handleLogin}>
                  <Text style={styles.haveAccount}>Already have an account? Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BgImage>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily: 'RobotoRegular',
  },
  regScr: {
    paddingTop: 92,
    // paddingBottom: 30,
    paddingHorizontal: 16,
    width: '100%',
    // height: '69%',

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
  title: {
    // marginTop: 92,
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
