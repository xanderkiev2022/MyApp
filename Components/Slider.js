import React from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { useState } from 'react';
import { useRef } from 'react';

export default function Slider({ navigation }) {
  const [leftHandlePosition, setLeftHandlePosition] = useState(5);
  const [rightHandlePosition, setRightHandlePosition] = useState(92);

  const leftHandleAnimation = useRef(new Animated.Value(leftHandlePosition)).current;
  const rightHandleAnimation = useRef(new Animated.Value(rightHandlePosition)).current;

  const updateLeftHandlePosition = position => {
    leftHandleAnimation.setValue(position);
    setLeftHandlePosition(position);
  };

  const updateRightHandlePosition = position => {
    rightHandleAnimation.setValue(position);
    setRightHandlePosition(position);
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
      const newLeftHandlePosition = Math.max(5, Math.min(leftHandlePosition + adjustedDx, rightHandlePosition - 5));
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
      <Animated.View style={{ ...styles.handle, left: leftHandleTranslation }} {...leftPanResponder.panHandlers} />
      <Animated.View style={{ ...styles.handle, left: rightHandleTranslation }} {...rightPanResponder.panHandlers} />
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
  handle: {
    position: 'absolute',
    top: -8,
    width: 13,
    height: 20,
    // borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  sliderTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'orange',
    opacity: 0.9,
    borderRadius: 2.5,
  },
  sliderTrackInner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 2.5,
  },
});