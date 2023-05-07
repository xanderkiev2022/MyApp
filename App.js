import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './Screens/Home';

// Redux
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';

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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Home />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
