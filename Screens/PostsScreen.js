import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { EvilIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostsScreenMain from './PostsScreenMain';
import CommentsScreen from './CommentsScreen';
import MapScreen from './MapScreen';

const NavStack = createStackNavigator();

export default function PostsScreen() {
  // Fonts
  const [fontsLoaded] = useFonts({
    RobotoBold: require('../assets/fonts/RobotoBold.ttf'),
    RobotoMedium: require('../assets/fonts/RobotoMedium.ttf'),
    RobotoRegular: require('../assets/fonts/RobotoRegular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      <NavStack.Navigator initialRouteName="PostsScreen">
        <NavStack.Screen name="PostsScreen" component={PostsScreenMain} options={{ headerShown: true }} />
        <NavStack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: true }} />
        <NavStack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      </NavStack.Navigator>
    </NavigationContainer>
  );
}
