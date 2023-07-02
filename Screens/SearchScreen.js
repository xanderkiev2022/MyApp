import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BgImage } from '../Components/BgImage';
import Slider from '../Components/Slider';
import { CheckBox } from '../Components/CheckBox';
import { Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native';
import EmptyScreen from './EmptyScreen';

export default function SearchScreen({ navigation }) {
  // slider

  const fields = [
    { text: 'Blue color', value: 'blue', disabled: false },
    { text: 'Green color', value: 'green', disabled: false },
    { text: 'Gray color', value: 'gray', disabled: false },
  ];
  const [sliderAge, setSliderAge] = useState([18, 43]); // Початкове значення sliderAge
  const [eyeColor, setEyeColor] = useState(fields.map(field => field.value));

  const handleEyeColorSelection = value => {
    let updatedValues = [...eyeColor];
    const valueIndex = updatedValues.indexOf(value);
    if (valueIndex > -1) {
      updatedValues.splice(valueIndex, 1);
    } else {
      updatedValues.push(value);
    }
    setEyeColor(updatedValues);
  };

  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <Text style={{ ...styles.titleText, textAlign: 'center' }}>Set your preferences</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Age</Text>
              <Text style={styles.sliderAge}>
                {sliderAge[0]}-{sliderAge[1]}
              </Text>
            </View>
            <Slider sliderAge={sliderAge} setSliderAge={setSliderAge} />
          </View>
          <View style={styles.checkboxTitle}>
            <Text style={styles.titleText}>Title of CheckBox</Text>
            {fields.map(field => (
              <View key={field.text} style={styles.checkboxContainer}>
                <CheckBox
                  disabled={field.disabled}
                  // isSelected={field.isSelected}
                  isSelected={eyeColor.includes(field.value)}
                  onSelectChange={() => handleEyeColorSelection(field.value)}
                  // onSelectChange={() => {
                  //   field.setIsSelected(!field.isSelected);
                  // }}
                />
                <Text style={styles.checkboxText}>{field.text}</Text>
              </View>
            ))}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.btnComment}
              // disabled={!comment}
              onPress={() => {
                // setComment('');
                Keyboard.dismiss();
                // addComment();
                // setTextInputHeight(45);
              }}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
            <EmptyScreen ageLimit={sliderAge} eyeColor={eyeColor} />
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
