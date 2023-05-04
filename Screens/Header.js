import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Header({title}) {
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
    <View style={styles.container}>
      <AntDesign name="arrowleft" style={styles.returnSvg} size={28} color={'#BDBDBD'} backgroundColor={'transparent'} header={20} />
      <Text style={styles.title}>{title}</Text>
      <Ionicons name="exit-outline" style={styles.exitSvg} size={28} color="#BDBDBD" backgroundColor="transparent" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    fontFamily: 'RobotoRegular',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  title: {
    fontFamily: 'RobotoMedium',
    fontSize: 17,
    lineHeight: 22,
    color: '#212121',
  },
});
