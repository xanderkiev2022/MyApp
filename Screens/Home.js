import { NavigationContainer } from '@react-navigation/native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
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

const MainTab = createBottomTabNavigator();
const MainStack = createStackNavigator();

export default function Home() {
  const authCheck = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

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
              } else if (route.name === 'Posts') {
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
            name="Posts"
            component={PostsScreen}
            options={{
              headerShown: true,
              header: ({ navigation, route }) => <Header title={route.name} />,
            }}
          />
          <MainTab.Screen
            name="Create Posts"
            component={CreatePostsScreen}
            options={{
              headerShown: true,
              header: ({ navigation, route }) => <Header title={route.name} />,
            }}
          />
          <MainTab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
              header: ({ navigation, route }) => <Header title={route.name} />,
            }}
          />
        </MainTab.Navigator>
      ) : (
        <MainStack.Navigator initialRouteName="Login">
          <MainStack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
          <MainStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <MainStack.Screen name="Home" component={PostsScreenMain} options={{ headerShown: true }} />
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
});
