import { NavigationContainer } from '@react-navigation/native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import { useDispatch, useSelector } from 'react-redux';
import { selectDatabase, selectIsLoggedIn, selectUserData } from '../redux/auth/authSelectors';
import RegistrationScreen from './RegistrationScreen';
import LoginScreen from './LoginScreen';
import { auth, database, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth/react-native';
// import { refreshUser } from '../redux/auth/authSlice';
import { getTabBarVisible } from '../Components/WrapperForTabBar';
import SearchScreen from './SearchScreen';
import EmptyScreen from './EmptyScreen';
import { doc, getDoc } from 'firebase/firestore';
import { refresh, refreshDatabase } from '../redux/auth/authOperations';

const MainTab = createBottomTabNavigator();
const MainStack = createStackNavigator();

export default function Home() {
  const authCheck = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const database = useSelector(selectDatabase);

  const needToLogin = async () => {
    
    // onAuthStateChanged(auth, async user => {
    //   const userRef = doc(db, 'users', user.uid);
    //   const docSnap = await getDoc(userRef);
    //   const existingData = docSnap.data();

    //   let userData = {};
    //   if (user) {
    //     for (const field in existingData) {
    //       userData[field] = existingData[field];
    //     }
    //     dispatch(refreshUser(existingData));
    //   }
    // });
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
    dispatch(refresh()); 
    // console.log('userData!!!!!!!!!!!!!!!!! :>> ', userData);
    // dispatch(refreshDatabase())
  }, []);

  // if (authCheck) {
  //   dispatch(refresh());
  // }

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
                } else if (route.name === 'SearchScreen') {
                  return <SimpleLineIcons name="heart" size={focused ? size + 2 : size} color={color} />;
                } else if (route.name === 'Empty') {
                  return <SimpleLineIcons name="eye" size={focused ? size + 2 : size} color={color} />;
                }
              },
              tabBarActiveTintColor: '#FF6C00',
              tabBarInactiveTintColor: 'rgba(33, 33, 33, 0.8)',
              tabBarShowLabel: false,
              // initialRouteName: 'Profile',
              tabBarStyle: getTabBarVisible(route),
            })}
          >
            <MainTab.Screen
              name="Empty"
              component={EmptyScreen}
              options={{
                headerShown: false,
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
              name="SearchScreen"
              component={SearchScreen}
              options={({ route }) => ({
                headerShown: false,
                tabBarStyle: { display: 'flex' },
              })}
            />

            <MainTab.Screen
              name="PostsScreen"
              component={PostsScreen}
              options={({ route }) => ({
                headerShown: false,
                tabBarStyle: { display: 'flex' },
              })}
            />
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
    width: 50,
    height: 40,
    borderRadius: 20,
    paddingTop: 9,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#b3b3b3',
  },
});
