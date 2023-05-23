import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, VirtualizedList, Dimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import Header from './Header';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmail, selectIsLoggedIn, selectPass, selectRefreshing, selectUserId } from '../redux/auth/authSelectors';
import RegistrationScreen from './RegistrationScreen';
import LoginScreen from './LoginScreen';
import PostsScreenMain from './PostsScreenMain';
import { AntDesign } from '@expo/vector-icons';
import { login, refresh } from '../redux/auth/authOperations';
import { auth, authAsyncStorage, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth/react-native';
import { refreshUser } from '../redux/auth/authSlice';
import { HomeScreen, ScrollTab, WrapperForTabBar } from '../Components/WrapperForTabBar';

// import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';



const MainTab = createBottomTabNavigator();
const MainStack = createStackNavigator();

export default function Home() {
  const authCheck = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const userId = useSelector(selectUserId);
  const user = auth.currentUser;
  console.log('auth.currentUser :>> ', auth.currentUser);
  
  const needToLogin = () => {

onAuthStateChanged(auth, user => {


  if (user) {
    const userData = {
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
    };
    // console.log('authAsyncStorage.currentUser :>> ', authAsyncStorage.currentUser);
    dispatch(refreshUser(userData));
  }
});
  };

  // Saving password
  // const needToLogin = async () => {
  //   if (!user) {
  //     const docRef = doc(db, 'users', userId);
  //     const docSnap = await getDoc(docRef);
  //     const docData = docSnap.data();
  //     console.log('docData :>> ', docData);
  //     console.log('object :>> ', { email: docData.email, password: docData.password });
  //     dispatch(login({ email: docData.email, password: docData.password }));
  //   }
  // };


  useEffect(() => {
    needToLogin();
  }, [auth]);

  const getTabBarVisible = route => {
    const params = route.params;
    console.log('params :>> ', params);
    console.log('route :>> ', route);
    if (params) {
      if (params.tabBarVisible === false) {
        return { display: 'none' };
      }
    }
    return  { display: 'flex'  };
  };


  return (
    <NavigationContainer>
      {authCheck ? (
        <MainTab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Profile') {
                return <Feather name="user" size={size} color={color} />;
              } else if (route.name === 'Create Posts') {
                return <Feather name="plus" size={size} color="#fff" style={styles.addPost} />;
              } else if (route.name === 'PostsScreen') {
                return <SimpleLineIcons name="grid" size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: '#FF6C00',
            tabBarInactiveTintColor: 'rgba(33, 33, 33, 0.8)',
            tabBarShowLabel: false,
            initialRouteName: 'PostsScreen',
            style: { position: 'absolute', bottom: 0 },
            // tabBarStyle: { display: 'none' },

            tabBarStyle: getTabBarVisible(route),
          })}
        >
          <MainTab.Screen
            name="PostsScreen"
            component={PostsScreen}
            options={{
              headerShown: false,
            }}
          />
          <MainTab.Screen
            name="Create Posts"
            component={CreatePostsScreen}
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              headerStyle: styles.bottomBorder,

              tabBarStyle: { display: 'none' },
            }}
          />
          <MainTab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          {() => <ProfileScreen navigation={navigation} />}
        </MainTab.Navigator>
      ) : (
        <MainStack.Navigator initialRouteName="Login">
          <MainStack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
          <MainStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  addPost: {
    textAlign: 'center',
    backgroundColor: '#FF6C00',
    width: 70,
    height: 40,
    borderRadius: 20,
    paddingTop: 9,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#b3b3b3',
  },
});
