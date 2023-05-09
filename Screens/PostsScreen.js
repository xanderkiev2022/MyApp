import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostsScreenMain from './PostsScreenMain';
import CommentsScreen from './CommentsScreen';
import MapScreen from './MapScreen';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authOperations';

const NavStack = createStackNavigator();

export default function PostsScreen() {
  const dispatch = useDispatch();

  return (
    // <NavigationContainer independent={true}>
    <NavStack.Navigator initialRouteName="Posts">
      <NavStack.Screen
        name="Posts"
        component={PostsScreenMain}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: styles.bottomBorder,
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }} onPress={() => dispatch(logout())}>
              <Ionicons name="exit-outline" size={28} color="#BDBDBD" backgroundColor="transparent" />
            </TouchableOpacity>
          ),
        })}
      />
      <NavStack.Screen
        name="Comments"
        component={CommentsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: styles.bottomBorder,
        })}
      />

      <NavStack.Screen
        name="Map"
        component={MapScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: styles.bottomBorder,
        })}
      />
    </NavStack.Navigator>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#b3b3b3',
  },
});