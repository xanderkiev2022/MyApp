import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser } from '../redux/auth/authSlice';
import { selectUserId } from '../redux/auth/authSelectors';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { TouchableOpacity } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export const GoogleLogin = () => {
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      androidClientId: '750126251136-p8p4ibgra5ur49j93vdsaoj3qf5e20s6.apps.googleusercontent.com',
      iosClientId: '750126251136-kelln54601b7dok4ee6idojqdpoe1lbk.apps.googleusercontent.com',
      expoClientId: '750126251136-6glaaagrp1q3q4ev0k0fqdt0en5ncluq.apps.googleusercontent.com',
    },
    {
      projectNameForProxy: '@xanderkiev/MyApp',
    }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await response.json();

      const userRef = doc(db, 'users', user.id);
      const userSnapshot = await getDoc(userRef);
      let userData;

      if (userSnapshot.exists()) {

        userData = {
          userId: userSnapshot.data().userId || null,
          name: userSnapshot.data().name || '',
          email: userSnapshot.data().email || '',
          photo: userSnapshot.data().photo || null,
        };

      } else {
        userData = {
          userId: user?.id || null,
          name: user?.name || '',
          email: user?.email || '',
          photo: user?.picture || null,
        };
      }
        dispatch(refreshUser(userData));
        setDoc(userRef, userData);






    } catch (error) {
      console.log('errorInGoogleAuth :>> ', error);
    }
  };


  return (
    // <View style={styles.container}>
      <TouchableOpacity
        style={styles.container}
        title="Sign in with Google"
        disabled={!request}
        onPress={() => {
          promptAsync({ projectNameForProxy: '@xanderkiev/MyApp' });
        }}
      >
        <AntDesign name="google" size={20} color={'white'} backgroundColor="transparent" />
      </TouchableOpacity>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'green',
    width: 40,
    height: 40,
    borderRadius: 5,
    // flex: 1,
    // flexDirection: 'row',
  },

  loginBtn: {
    borderRadius: 5,
  },
});
