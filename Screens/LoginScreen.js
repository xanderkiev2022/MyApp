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
import { selectError } from '../redux/auth/authSelectors';
import { removeError } from '../redux/auth/authSlice';
import { BgImage } from '../Components/BgImage';
import { LayoutAnimation } from 'react-native';
import { listOfEmails } from '../Utils/listOfEmails';

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
  const handleSubmit = () => {
    dispatch(login(state));
    setState(initialState);
  };

  // WrongPass
  useEffect(() => {
    if (error) alert(error); dispatch(removeError());
}, [error]);

  // Registration
  const handleRegistration = () => {
    navigation.navigate('Registration');
  };

  const hideKayboard = () => {
    Keyboard.dismiss();
    setIsFocused(initialFocus);
    setIsActive(false);
  };

  return (
    <TouchableWithoutFeedback onPress={hideKayboard}>
      <View style={styles.container}>
        <BgImage>
          <View
            style={{
              ...styles.regScr,
              // height: isActive ? '76%' : '69%'
              // height: isActive ? 500 : 500,
              paddingBottom: isActive ? 160 : 144,
            }}
          >
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
                // onChangeText={value => setState(prevState => ({ ...prevState, email: value.trim() }))}
                onChangeText={value => {
                  const trimmedValue = value.trim().toLowerCase();
                  setState(prevState => ({ ...prevState, email: value.trim() }));
                  if (listOfEmails.some(email => trimmedValue.includes(email))) {
                    hideKayboard();
                  }
                }}
                autoComplete="email"
              />

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
              <View>
                <TouchableOpacity style={styles.btn} title="LogIn" onPress={handleSubmit}>
                  <Text style={styles.btnText}> Log in </Text>
                </TouchableOpacity>

                <TouchableOpacity title="Registration" onPress={handleRegistration}>
                  <Text style={styles.haveAccount}> Don't have an account? Registration </Text>
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
    backgroundColor: '#fff',
    fontFamily: 'RobotoRegular',
    backgroundColor: 'green',
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  regScr: {
    paddingTop: 32,
    // paddingBottom: 144,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    // maxHeight: '75%',
    // marginTop: 'auto',
    // paddingTop: 32,
    // position: 'relative',
    // height: '100%',
    justifyContent: 'flex-end',
    // position: 'absolute',
    // position: 'relative'
    // bottom: 0,
  },

  title: {
    // marginTop: 32,
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
    // marginBottom: 144,
    // marginBottom: 66,
  },
});
