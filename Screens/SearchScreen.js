import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BgImage } from '../Components/BgImage';
import Slider from '../Components/Slider';

export default function SearchScreen({ navigation }) {
 

  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <View style={styles.ageContainer}>
            <View style={styles.ageHeader}>
              <Text>Age</Text>
              <Text>20-28</Text>
            </View>
            <Slider />
          </View>
        </View>
      </BgImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  regScr: {
    // width: '100%',
    paddingHorizontal: 16,
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  ageContainer: {

  },
  ageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between'
      
  },
});
