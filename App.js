import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RegistrationScreen from './Screens/RegistrationScreen';
// import LoginScreen from './Screens/LoginScreen';

export default function App() {
  return (
    <View
      style={styles.container}
    >
      <StatusBar style="auto" />
      <RegistrationScreen />
      {/* <LoginScreen /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
