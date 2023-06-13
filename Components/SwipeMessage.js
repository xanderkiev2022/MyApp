import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

export const SwipeMessage = ({ onDelete, onReply, children }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: position.x,
          // translationY: position.y
        },
      },
    ],
    {
      useNativeDriver: false,
    }
  );

  const interpolatedColor = position.x.interpolate({
    inputRange: [-150, -20, 0, 20, 150],
    outputRange: ['rgba(255, 0, 0, 0.9)', 'rgba(255, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 0, 0.9)'],
    extrapolate: 'clamp',
  });

  const interpolatedLeftOpacity = position.x.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const interpolatedRightOpacity = position.x.interpolate({
    inputRange: [-200, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const interpolatedLeftScale = position.x.interpolate({
    inputRange: [0, 200],
    outputRange: [0.2, 1],
    extrapolate: 'clamp',
  });

  const interpolatedRightScale = position.x.interpolate({
    inputRange: [-200, 0],
    outputRange: [1, 0.2],
    extrapolate: 'clamp',
  });

  const onPanHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -150) {
        // If swiped far enough to the left, delete the message
        Animated.timing(position, {
          toValue: { x: -300, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          onDelete();
        });
      } else if (nativeEvent.translationX > 100) {
        // If swiped far enough to the right, reply the message
        Animated.timing(position, {
          toValue: { x: 200, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          onReply();
        });
        // Reset the background color
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      } else {
        // If not swiped far enough, return the message to its original position
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    } else if (nativeEvent.state === State.ACTIVE) {
      // Calculate the swipe progress and set the background color accordingly
      const progress = Math.abs(nativeEvent.translationX) / 120;
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onPanHandlerStateChange} activeOffsetX={[-25, 25]}>
      <Animated.View
        style={{
          backgroundColor: interpolatedColor,
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <Animated.Text
          style={{
            opacity: interpolatedLeftOpacity,
            marginLeft: 16,
            fontWeight: 'bold',
            color: 'black',
            position: 'absolute',
            zIndex: 1,
            transform: [{ scale: interpolatedLeftScale }],
          }}
        >
          Reply
        </Animated.Text>

        <Animated.Text
          style={{
            opacity: interpolatedRightOpacity,
            marginRight: 16,
            fontWeight: 'bold',
            color: 'white',
            position: 'absolute',
            right: 0,
            zIndex: 1,
            transform: [{ scale: interpolatedRightScale }],
          }}
        >
          Delete
        </Animated.Text>

        <Animated.View style={[position.getLayout()]}>{children}</Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};
