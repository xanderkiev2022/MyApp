import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Home from './Screens/Home';

// Redux
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { GoogleLogin } from './firebase/GoogleLogin';

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
        {/* <GoogleLogin/> */}
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
