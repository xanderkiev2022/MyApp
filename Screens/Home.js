import { NavigationContainer } from '@react-navigation/native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/auth/authSelectors';
import RegistrationScreen from './RegistrationScreen';
import LoginScreen from './LoginScreen';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth/react-native';
import { refreshUser } from '../redux/auth/authSlice';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const MainTab = createBottomTabNavigator();
const MainStack = createStackNavigator();

export default function Home() {
  const authCheck = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const needToLogin = () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        const userData = {
          userId: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        };
        dispatch(refreshUser(userData));
      }
    });
  };

  // Логінемося
  // const needToLogin = async () => {
  //   if (!user) {
  //     const docRef = doc(db, 'users', userId);
  //     const docSnap = await getDoc(docRef);
  //     const docData = docSnap.data();
  //     dispatch(login({ email: docData.email, password: docData.password }));
  //   }
  // };

  useEffect(() => {
    needToLogin();
  }, [auth]);

  const opacityAnimation = useRef(new Animated.Value(1)).current;
  const bottomAnimation = useRef(new Animated.Value(0)).current;

  const animateTabBar = show => {
    Animated.parallel([
      Animated.timing(opacityAnimation, {
        toValue: show ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnimation, {
        toValue: show ? 0 : 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getTabBarVisible = route => {
    const params = route.params;
    // const routeName = getFocusedRouteNameFromRoute(route);
    // console.log('params :>> ', params);
    // console.log('route :>> ', route);
    // console.log('routeName :>> ', routeName);

    if (params) {
      if (params.tabBarVisible === false) {
        animateTabBar(false);
        return {
          position: 'absolute',
          transform: [{ translateY: bottomAnimation }],
          opacity: opacityAnimation,
        };
      }
    }
    animateTabBar(true);
    return {
      position: 'absolute',
      transform: [{ translateY: bottomAnimation }],
      opacity: opacityAnimation,
    };
  };

  return (
    <NavigationContainer>
      {authCheck ? (
        <MainTab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Profile') {
                return <Feather name="user" size={focused ? size + 2 : size} color={color} />;
              } else if (route.name === 'Create Posts') {
                return <Feather name="plus" size={focused ? size + 2 : size} color="#fff" style={styles.addPost} />;
              } else if (route.name === 'PostsScreen') {
                return <SimpleLineIcons name="grid" size={focused ? size + 2 : size} color={color} />;
              }
            },
            tabBarActiveTintColor: '#FF6C00',
            tabBarInactiveTintColor: 'rgba(33, 33, 33, 0.8)',
            tabBarShowLabel: false,
            initialRouteName: 'PostsScreen',
            tabBarStyle: getTabBarVisible(route),
          })}
        >
          <MainTab.Screen
            name="PostsScreen"
            component={PostsScreen}
            options={({ route }) => ({
              headerShown: false,
              tabBarStyle: { display: 'flex' },
            })}
          />
          <MainTab.Screen
            name="Create Posts"
            component={CreatePostsScreen}
            options={({ route }) => ({
              headerShown: true,
              headerTitleAlign: 'center',
              headerStyle: styles.bottomBorder,
              tabBarStyle: { display: 'none' },
            })}
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
