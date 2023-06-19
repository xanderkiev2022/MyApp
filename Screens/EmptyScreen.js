import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BgImage } from '../Components/BgImage';

export default function EmptyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}></View>
      </BgImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  regScr: {
    paddingHorizontal: 16,
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});
