import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BgImage } from '../Components/BgImage';
import Slider from '../Components/Slider';
import { CheckBox } from '../Components/CheckBox';

export default function SearchScreen({ navigation }) {

  // slider
  const [sliderAge, setSliderAge] = useState(20); // Початкове значення sliderAge

  // checkBox
  const [green, setGreen] = useState(false);
  const [blue, setBlue] = useState(false);

  const fields = [
    { text: 'Blue color', disabled: false, isSelected: blue, setIsSelected: setBlue },
    { text: 'Green color', disabled: false, isSelected: green, setIsSelected: setGreen },
  ];

  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <Text style={{ ...styles.titleText, textAlign: 'center' }}>Set your preferences</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Age</Text>
              <Text style={styles.sliderAge}>{sliderAge}-45</Text>
            </View>
            <Slider sliderAge={sliderAge} setSliderAge={setSliderAge} />
          </View>
          <View style={styles.checkboxTitle}>
            <Text style={styles.titleText}>Title of CheckBox</Text>
            {fields.map(field => (
              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={field.disabled}
                  isSelected={field.isSelected}
                  onSelectChange={() => {
                    field.setIsSelected(!field.isSelected);
                  }}
                />
                <Text style={styles.checkboxText}>{field.text}</Text>
              </View>
            ))}
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
    paddingTop: 16,
    paddingHorizontal: 16,
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',    
  },
  checkboxTitle: {
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
});
