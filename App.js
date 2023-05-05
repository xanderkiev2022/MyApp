import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import RegistrationScreen from './Screens/RegistrationScreen';
import Home from './Screens/Home';
import LoginScreen from './Screens/LoginScreen';

// import CreatePostsScreen from './Screens/CreatePostsScreen';
// import PostsScreen from './Screens/PostsScreen';
// import CommentsScreen from './Screens/CommentsScreen';
// import ProfileScreen from './Screens/ProfileScreen';
// import MapScreen from './Screens/MapScreen';

const MainStack = createStackNavigator();

export default function App() {
  // Fonts
  const [fontsLoaded] = useFonts({
    RobotoBold: require('./assets/fonts/RobotoBold.ttf'),
    RobotoMedium: require('./assets/fonts/RobotoMedium.ttf'),
    RobotoRegular: require('./assets/fonts/RobotoRegular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="Registration">
        <MainStack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
        <MainStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <MainStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      </MainStack.Navigator>
      {/* <View style={styles.container}> */}
      {/* <StatusBar style="auto" /> */}
      {/* <Header /> */}
      {/* <RegistrationScreen /> */}
      {/* <LoginScreen /> */}
      {/* <CreatePostsScreen /> */}
      {/* <PostsScreen /> */}
      {/* <CommentsScreen /> */}
      {/* <ProfileScreen /> */}
      {/* <MapScreen /> */}
      {/* <Home /> */}
      {/* </View> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
