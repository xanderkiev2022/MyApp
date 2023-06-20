import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BgImage } from '../Components/BgImage';
import Slider from '../Components/Slider';

export default function SearchScreen({ navigation }) {
  const [sliderAge, setSliderAge] = useState(20); // Початкове значення sliderAge

  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <Text>Set your preferences</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Age</Text>
              <Text style={styles.sliderAge}>{sliderAge}-45</Text>
            </View>
            <Slider sliderAge={sliderAge} setSliderAge={setSliderAge} />
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
  sliderContainer: {},
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
