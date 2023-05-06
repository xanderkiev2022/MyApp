import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { EvilIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function PostsScreenMain({navigation}) {
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
      <View style={styles.avatarContainer}>
        <Image style={styles.avatarImg} source={require('../assets/img/avatar.png')} />
        <View style={styles.avatarData}>
          <Text style={styles.avatarName}>Natali Romanova</Text>
          <Text style={styles.avatarEmail}>email@example.com</Text>
        </View>
      </View>

      <View>
        <Image style={styles.photo} source={require('../assets/img/avatar.png')} />
        <Text style={styles.locationName}>Wood</Text>

        <View style={styles.iconsContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.innerWrapperIcons} onPress={() => navigation.navigate('Comments')}>
            <Feather name="message-circle" size={24} color="#BDBDBD" />
            <Text style={styles.messeges}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.innerWrapperIcons} onPress={() => navigation.navigate('Map')}>
            <EvilIcons name="location" size={24} color="#BDBDBD" />
            <Text style={styles.location}>Ivano-Frankivs'k Region, Ukraine</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },

  avatarContainer: {
    flexDirection: 'row',
    marginVertical: 32,
    alignItems: 'center',
  },

  avatarImg: {
    width: 60,
    height: 60,
  },

  avatarData: {
    marginLeft: 8,
  },

  avatarName: {
    color: '#212121',
    fontFamily: 'RobotoBold',
    fontSize: 13,
    lineHeight: 15,
  },

  avatarEmail: {
    color: 'rgba(33, 33, 33, 0.8)',
    fontFamily: 'RobotoRegular',
    fontSize: 11,
    lineHeight: 13,
  },

  photo: {
    width: '100%',
    height: 240,
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  locationName: {
    fontFamily: 'RobotoMedium',
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 11,
  },

  iconsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  messeges: {
    marginLeft: 9,
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },

  location: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
    textDecorationLine: 'underline',
  },

  innerWrapperIcons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
