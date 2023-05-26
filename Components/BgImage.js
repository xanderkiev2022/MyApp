import { StyleSheet, ImageBackground, Dimensions } from 'react-native';
import BackGroundImage from '../assets/img/bg-photo.jpg';
import {  } from 'react-native';

export const BgImage = ({ children }) => {
  return (
    <ImageBackground source={BackGroundImage} style={styles.imgBg}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgBg: {
    justifyContent: 'flex-end',
    position: 'relative',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
