import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { selectUserData, selectUserId } from '../redux/auth/authSelectors';
import { logout, update } from '../redux/auth/authOperations';
import Avatar from '../Components/Avatar';

export default function ProfileScreen({ navigation }) {
  const userId = useSelector(selectUserId);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();

  const [state, setState] = useState(() => {
    let initialState = {};
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        initialState[key] = userData[key];
      }
    }
    return initialState;
  });

  const initialFocus = {
    login: false,
    email: false,
    name: false,
  };
  const [isFocused, setIsFocused] = useState(initialFocus);

  const handleFocus = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: true }));
  };
  const handleBlur = input => {
    setIsFocused(prevState => ({ ...prevState, [input]: false }));
    dispatch(update({ userId, state: { [input]: state[input] } }));
  };

  const hideKayboard = () => {
    Keyboard.dismiss();
    setIsFocused(initialFocus);
  };

  const fields = [
    { name: 'name', placeholder: 'Name', svg: 'user' },
    { name: 'email', placeholder: 'Email', svg: 'mail' },
    { name: 'phone', placeholder: '+ 380', svg: 'phone' },
    { name: 'birth', placeholder: 'Date of birth', svg: 'calendar' },
    { name: 'country', placeholder: 'Country', svg: 'calendar' },
    { name: 'region', placeholder: 'Region', svg: 'calendar' },
    { name: 'city', placeholder: 'City', svg: 'calendar' },
  ];

  const formatPhoneNumber = number => {
    // форматування номера телефону
  const cleaned = number.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  let formattedNumber = '';
  if (match) {
    const [fullMatch, countryCode, areaCode, firstPart, secondPart, thirdPart] = match;
    formattedNumber = '';

    if (countryCode && countryCode.charAt(0) === '0') {
      formattedNumber += '+38' + countryCode;
    } else if (countryCode) {
      formattedNumber += '+' + countryCode;
    }

    if (areaCode) {
      formattedNumber += ' (' + areaCode;
      if (firstPart) {
        formattedNumber += ') ' + firstPart;
        if (secondPart) {
          formattedNumber += '-' + secondPart;
          if (thirdPart) {
            formattedNumber += '-' + thirdPart;
          }
        }
      }
    }
  }
  return formattedNumber;
  };

  const handleChangePhone = value => {
    const formattedNumber = formatPhoneNumber(value);
    setState(prevState => ({
      ...prevState,
      phone: formattedNumber,
    }));
  };

  return (
    // <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
    <KeyboardAvoidingView
      style={{
        ...styles.keyboardContainer,
      }}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          hideKayboard();
        }}
      >
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.avatarBox}>
              <Avatar />
              <TouchableOpacity style={styles.exitSvg} onPress={() => dispatch(logout())}>
                <Ionicons name="exit-outline" size={28} color="#BDBDBD" backgroundColor="transparent" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarName}>{state.name}</Text>
            <View style={styles.personalDataForm}>
              {fields.map(field => (
                <View style={styles.inputContainer} key={field.name}>
                  <AntDesign style={styles.inputSvg} name={field.svg} size={24} />
                  <TextInput
                    key={field.name}
                    isFocused={isFocused[field.name]}
                    placeholder={field.placeholder}
                    onFocus={() => {
                      handleFocus(field.name);
                    }}
                    onBlur={() => {
                      handleBlur(field.name);
                    }}
                    value={state[field.name]}
                    onChangeText={value =>
                      // setState(prevState => ({
                      //   ...prevState,
                      //   [field.name]: value,
                      // }))
                      {
                        if (field.name === 'phone') {
                          handleChangePhone(value);
                        } else {
                          setState(prevState => ({
                            ...prevState,
                            [field.name]: value,
                          }));
                        }
                      }
                    }
                    style={{
                      ...styles.inputData,
                      borderColor: isFocused[field.name] ? '#FF6C00' : '#E8E8E8',
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btnComment}
                // disabled={!comment}
                onPress={() => {
                  // setComment('');
                  Keyboard.dismiss();
                  // addComment();
                  // setTextInputHeight(45);
                }}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
            {/* <Text>{state}</Text> */}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // paddingBottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 60,
    justifyContent: 'flex-end',
    paddingTop: 30,
  },
  avatarBox: {
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    marginTop: 60,
    alignSelf: 'center',
    marginBottom: 32,
  },
  exitSvg: {
    position: 'absolute',
    top: 78,
    right: -120,
  },

  avatarName: {
    fontFamily: 'RobotoMedium',
    fontSize: 30,
    color: '#212121',
    alignSelf: 'center',
  },
  personalDataForm: {
    marginTop: 33,
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSvg: {
    position: 'absolute',
    color: '#FF6C00',
  },
  inputData: {
    width: '50%',
    height: 40,
    paddingLeft: 34,
    position: 'relative',
    fontSize: 16,
    borderBottomWidth: 1,
  },
});
