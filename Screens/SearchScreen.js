import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { BgImage } from '../Components/BgImage';
import Slider from '../Components/Slider';
import { CheckBox } from '../Components/CheckBox';
import { TouchableOpacity } from 'react-native';
import { getCollectionOfEyeColors } from '../firebase/getCollections';
import Card from '../Components/Card';
import { useRef } from 'react';
import { selectUserData } from '../redux/auth/authSelectors';
import { useSelector } from 'react-redux';

export default function SearchScreen({ navigation }) {
  const [sliderAge, setSliderAge] = useState([18, 43]);
  const [eyeCheckBoxFileds, setEyeCheckBoxFileds] = useState([]);
  const [eyeColor, setEyeColor] = useState([]);
  const {blackList} = useSelector(selectUserData);

  useEffect(() => {
    getCollectionOfEyeColors({ setEyeCheckBoxFileds, setEyeColor });
  }, []);

  const [prefContainerVisible, setPrefContainerVisible] = useState(false);
  const prefContainerHeight = useState(new Animated.Value(0))[0];
  const [arrowDown, setArrowDown] = useState(true);

  const togglePrefContainer = () => {
    if (prefContainerVisible) {
      Animated.timing(prefContainerHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setPrefContainerVisible(false);
        setArrowDown(true);
      });
    } else {
      Animated.timing(prefContainerHeight, {
        toValue: 220,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setPrefContainerVisible(true);
        setArrowDown(false);
      });
    }
  };

  const handleEyeColorSelection = useCallback(
    value => {
      let updatedValues = [...eyeColor];
      const valueIndex = updatedValues.indexOf(value);
      if (valueIndex > -1) {
        updatedValues.splice(valueIndex, 1);
      } else {
        updatedValues.push(value);
      }
      setEyeColor(updatedValues);
    },
    [eyeColor]
  );

  const throttledSliderAge = useRef([18, 43]);
  const sliderAgeTimeout = useRef(null);
  
 const handleSliderAgeChange = useCallback(
   values => {
     throttledSliderAge.current = values;
     clearTimeout(sliderAgeTimeout.current);
     sliderAgeTimeout.current = setTimeout(() => {
       setSliderAge(values);
     }, 200);
   },
   [setSliderAge]
 );

  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <TouchableOpacity onPress={togglePrefContainer}>
            <Text style={{ ...styles.titleText, textAlign: 'center' }}>{arrowDown ? 'Preferences ▼' : 'Preferences ▲'}</Text>
          </TouchableOpacity>
          <Animated.View style={[styles.prefContainer, { height: prefContainerHeight }, !prefContainerVisible && { opacity: 0 }]}>
            <View styles={styles.prefContainer}>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text>Age</Text>
                  <Text style={styles.sliderAge}>
                    {sliderAge[0]}-{sliderAge[1]}
                  </Text>
                </View>
                <Slider
                  sliderAge={sliderAge}
                  // setSliderAge={setSliderAge}
                  setSliderAge={handleSliderAgeChange}
                />
              </View>

              <Text style={styles.titleText}>Eye color</Text>

              <Animated.View
                style={{
                  ...styles.checkboxContainer,
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                {eyeCheckBoxFileds.map(field => (
                  <View key={field.text} style={styles.checkboxContainer}>
                    <CheckBox
                      disabled={field.disabled}
                      isSelected={eyeColor.includes(field.value)}
                      onSelectChange={() => handleEyeColorSelection(field.value)}
                    />
                    <Text style={styles.checkboxText}>{field.text}</Text>
                  </View>
                ))}
              </Animated.View>
            </View>
          </Animated.View>
          <Card ageLimit={sliderAge} eyeColor={eyeColor} blackList={blackList} />
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
  checkboxTitle: {},
  titleText: {
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    marginRight: 5,
  },
  prefContainer: {},
});
