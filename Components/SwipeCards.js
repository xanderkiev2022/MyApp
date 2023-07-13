import React, { useRef, useState } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../redux/auth/authOperations';
import { selectUserData } from '../redux/auth/authSelectors';
import { FontAwesome } from '@expo/vector-icons';

const AnimatedSvg = Animated.createAnimatedComponent(FontAwesome);

export const SwipeCards = ({ currentCard, setCurrentIndex, noSwipe, children }) => {
  const [position, setPosition] = useState(new Animated.ValueXY());
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUserData);
  // const [svgColor, setSvgColor] = useState('gray');
  const [isPressedMinus, setIsPressedMinus] = useState(false);
  const [isPressedPlus, setIsPressedPlus] = useState(false);

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
        handlePressPlus();
      } else if (event.nativeEvent.translationX < -200) {
        handlePressMinus();
      } else {
        resetPosition();
      }
    }
  };

  const handlePressPlus = () => {
    resetPosition();
    setCurrentIndex(prevIndex => prevIndex + 1);
    dispatch(update({ userId, state: { whiteList: currentCard.userId } }));
  };

  const handlePressMinus = () => {
    resetPosition();
    setCurrentIndex(prevIndex => prevIndex + 1);
    dispatch(update({ userId, state: { blackList: currentCard.userId } }));
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
    outputRange: ['red', 'rgba(255, 0, 0, 0.2)', 'white', 'rgba(0, 255, 0, 0.2)', 'green'],
    extrapolate: 'clamp',
  });

  const interpolatedPlus = position.x.interpolate({
    inputRange: [0, 5, 20, 200],
    outputRange: ['gray', 'gray', 'rgba(0, 255, 0, 0.2)', 'green'],
    extrapolate: 'clamp',
  });

  const interpolatedMinus = position.x.interpolate({
    inputRange: [-200, -20, -5, 0],
    outputRange: ['red', 'rgba(255, 0, 0, 0.2)', 'gray', 'gray'],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: rotationValues }],
    backgroundColor: interpolatedColor,
    borderColor: interpolatedColor,
  };

  const animatedHeartStyle = {
    transform: [{ translateX: 0 }, { translateY: 0 }],
    color: isPressedPlus ? 'green' : interpolatedPlus,
  };

  const animatedCloseStyle = {
    transform: [{ translateX: 0 }, { translateY: 0 }],
    color: isPressedMinus ? 'red' : interpolatedMinus,
  };

  const animatedCircleStyle = {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <>
      {noSwipe ? (
        <View style={styles.cardContainer}>{children}</View>
      ) : (
        <>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureStateChange}>
              <Animated.View style={[styles.cardContainer, animatedCardStyle]}>{children}</Animated.View>
            </PanGestureHandler>
          </GestureHandlerRootView>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={handlePressMinus}
              onPressIn={() => {
                setIsPressedMinus(true);
              }}
              onPressOut={() => {
                setIsPressedMinus(false);
              }}
              activeOpacity={0.8}
            >
              <View style={animatedCircleStyle}>
                <AnimatedSvg name="close" style={[styles.svg, animatedCloseStyle]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePressPlus}
              onPressIn={() => {
                setIsPressedPlus(true);
              }}
              onPressOut={() => {
                setIsPressedPlus(false);
              }}
              activeOpacity={0.8}
            >
              <AnimatedSvg name="heart" style={[styles.svg, animatedHeartStyle]} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: -10,
    width: '100%',
    paddingHorizontal: 20,
  },
  svg: {
    fontSize: 24,
  },
});
