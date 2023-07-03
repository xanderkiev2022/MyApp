import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { useRef } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Slider({ sliderAge, setSliderAge }) {
  const [leftHandlePosition, setLeftHandlePosition] = useState(10);
  const [rightHandlePosition, setRightHandlePosition] = useState(92);

  const leftHandleAnimation = useRef(new Animated.Value(leftHandlePosition)).current;
  const rightHandleAnimation = useRef(new Animated.Value(rightHandlePosition)).current;

  const updateLeftHandlePosition = position => {
    leftHandleAnimation.setValue(position);
    setLeftHandlePosition(position);

    const ageRange = 45 - 18;
    const valueRange = 92 - 5;
    const valueOffset = position - 5;

    const newSliderAge = Math.floor((valueOffset / valueRange) * ageRange) + 17;
    // Застосовуємо обмеження від 18 до 45
    const clampedSliderMinAge = Math.max(18, Math.min(newSliderAge, sliderAge[1]-1));

    // Оновлюємо значення sliderAge
    setSliderAge([clampedSliderMinAge, Math.max(clampedSliderMinAge, ...sliderAge.slice(1))]);
  };

  const updateRightHandlePosition = position => {
    rightHandleAnimation.setValue(position);
    setRightHandlePosition(position);
    const ageRange = 45 - 18;
    const valueRange = 92 - 5;
    const valueOffset = position - 5;

    const newSliderAge = Math.floor((valueOffset / valueRange) * ageRange) + 18;
    // Застосовуємо обмеження від 18 до 45
    const clampedSliderMaxAge = Math.max(18, Math.min(newSliderAge-2, 45));

    // Оновлюємо значення sliderAge
   setSliderAge([...sliderAge.slice(0, 1), clampedSliderMaxAge]);

  };

  const leftHandleTranslation = leftHandleAnimation.interpolate({
    inputRange: [0, 105],
    outputRange: ['0%', '105%'],
  });

  const rightHandleTranslation = rightHandleAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const leftPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (event, gestureState) => {
      const { dx } = gestureState;
      const adjustedDx = dx / 3.65;
      const newLeftHandlePosition = Math.max(10, Math.min(leftHandlePosition + adjustedDx, rightHandlePosition - 5));
      updateLeftHandlePosition(newLeftHandlePosition);
    },
    onPanResponderRelease: () => {},
  });

  const rightPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (event, gestureState) => {
      const { dx } = gestureState;
      const adjustedDx = dx / 3.65;
      const newRightHandlePosition = Math.max(leftHandlePosition + 5, Math.min(rightHandlePosition + adjustedDx, 92));
      updateRightHandlePosition(newRightHandlePosition);
    },
    onPanResponderRelease: () => {},
  });

  return (
    <View style={styles.slider}>
      <Animated.View style={{ ...styles.sliderTrack, left: leftHandlePosition + '%', right: 99 - rightHandlePosition + '%' }} />
      <Animated.View style={{ ...styles.handle, left: leftHandleTranslation }} {...leftPanResponder.panHandlers}>
        <FontAwesome5 name="grip-lines-vertical" size={13} color="white" />
      </Animated.View>
      <Animated.View style={{ ...styles.handle, left: rightHandleTranslation }} {...rightPanResponder.panHandlers}>
        <FontAwesome5 name="grip-lines-vertical" size={13} color="white" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 5,
    backgroundColor: 'black',
    borderRadius: 2.5,
    marginTop: 10,
  },
  sliderTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'orange',
    opacity: 0.9,
    borderRadius: 2.5,
  },
  handle: {
    position: 'absolute',
    top: -8,
    marginLeft: -10,
    width: 13,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'orange',
    borderWidth: 0,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});