import React, { useRef } from 'react';
import { useState } from 'react';
import { View, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

export const SwipeToDeleteMessage = ({ onDelete, children }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

  const onPanGestureEvent = Animated.event([{ nativeEvent: { translationX: position.x } }], {
    useNativeDriver: false,
  });

  const onPanHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -150) {
        // If swiped far enough to the left, delete the message
        Animated.timing(position, {
          toValue: { x: -300, y: 50 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          onDelete();
        });
      } else {
        // If not swiped far enough to the left, return the message to its original position
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
      // Reset the background color
      setBackgroundOpacity(0);
    } else if (nativeEvent.state === State.ACTIVE) {
      // Calculate the swipe progress and set the background color accordingly
      const progress = Math.abs(nativeEvent.translationX) / 120;
      setBackgroundOpacity(progress);
    }
  };

  const interpolatedColor = position.x.interpolate({
    inputRange: [-150, -20, 0],
    outputRange: ['rgba(255, 0, 0, 0.9)', 'rgba(255, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)'],
    extrapolate: 'clamp',
  });

  return (
    <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onPanHandlerStateChange}>
      <Animated.View style={{ backgroundColor: interpolatedColor }}>
        <Animated.View style={[position.getLayout()]}>{children}</Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};