import React, { useState } from 'react';
import { StyleSheet,  Animated, } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

export const SwipeCards = ({ setCurrentIndex, children }) => {
  const [position, setPosition] = useState(new Animated.ValueXY());

  const handleGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: position.x,
          translationY: position.y,
        },
      },
    ],
    { useNativeDriver: false }
  );

  const handleGestureStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (event.nativeEvent.translationX > 200) {
        resetPosition();
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else if (event.nativeEvent.translationX < -200) {
        resetPosition();
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        resetPosition();
      }
    }
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const rotationValues = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const interpolatedColor = position.x.interpolate({
    inputRange: [-200, -20, 0, 20, 200],
    outputRange: ['rgba(255, 0, 0, 0.9)', 'rgba(255, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 0, 0.9)'],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: rotationValues }],
    backgroundColor: interpolatedColor,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureStateChange}>
        <Animated.View style={[styles.cardContainer, animatedCardStyle]}>{children}</Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});
