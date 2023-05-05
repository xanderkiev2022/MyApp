import React from 'react';
import { Feather } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import Header from './Header';

const MainTab = createBottomTabNavigator();

export default function Home () {
    return (
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
    );
};

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