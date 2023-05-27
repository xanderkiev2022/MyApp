import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

// Firebase
import { login } from '../redux/auth/authOperations';
import { useDispatch, useSelector } from 'react-redux';
import { selectError } from '../redux/auth/authSelectors';
import { removeError } from '../redux/auth/authSlice';
import { BgImage } from '../Components/BgImage';
import { listOfEmails } from '../Utils/listOfEmails';
import { InputEmail, InputPassword } from '../Components/Inputs';

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
              paddingBottom: isActive ? 160 : 144,
            }}
          >
            <Text style={styles.title}>Log In</Text>

            <View style={styles.regForm}>
              <InputEmail
                isFocused={isFocused}
                placeholder="E-mail"
                autoComplete="email"
                onFocus={() => {handleFocus('email');}}
                onBlur={() => {handleBlur('email');}}
                value={state.email}
                onChangeText={value => {
                  const trimmedValue = value.trim().toLowerCase();
                  setState(prevState => ({ ...prevState, email: value.trim() }));
                  listOfEmails.some(email => trimmedValue.includes(email)) ? inputPass.focus() : null;
                }}
              />

              <InputPassword
                isFocused={isFocused}
                placeholder="Password"
                autoComplete="password"
                onFocus={() => {handleFocus('password');}}
                onBlur={() => {handleBlur('password');}}
                value={state.password}
                onChangeText={value => setState(prevState => ({ ...prevState, password: value }))}
                isPasswordShown={isPasswordShown}
                onTogglePassword={() => setIsPasswordShown(prev => !prev)}
                ref={ref => {inputPass = ref;}}
              />

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
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  regScr: {
    paddingTop: 32,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: 'RobotoMedium',
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
  },
  regForm: {
    marginTop: 33,
    gap: 16,
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
