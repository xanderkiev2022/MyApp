import { NavigationContainer } from '@react-navigation/native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import Header from './Header';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, selectRefreshing } from '../redux/auth/authSelectors';
import RegistrationScreen from './RegistrationScreen';
import LoginScreen from './LoginScreen';
import PostsScreenMain from './PostsScreenMain';
import { AntDesign } from '@expo/vector-icons';

const MainTab = createBottomTabNavigator();
const MainStack = createStackNavigator();

export default function Home() {
  const authCheck = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  return (
    <NavigationContainer>
      {authCheck ? (
        <MainTab.Navigator
          tabBarOptions={{
            style: { position: 'absolute', bottom: 0 },
          }}
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
