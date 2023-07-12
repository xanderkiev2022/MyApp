import React, { useRef, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../redux/auth/authOperations';
import { selectUserData } from '../redux/auth/authSelectors';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';

const AnimatedSvg = Animated.createAnimatedComponent(FontAwesome);

export const SwipeCards = ({
  currentCard,
  setCurrentIndex,
  noSwipe,
  children,
}) => {
  const [position, setPosition] = useState(new Animated.ValueXY());
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUserData);
  // const [svgColor, setSvgColor] = useState('gray');

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
        dispatch(update({ userId, state: { whiteList: currentCard.userId } }));
      } else if (event.nativeEvent.translationX < -200) {
        resetPosition();
        setCurrentIndex(prevIndex => prevIndex + 1);
        dispatch(update({ userId, state: { blackList: currentCard.userId } }));
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
    outputRange: ['rgba(255, 0, 0, 0.9)', 'rgba(255, 0, 0, 0.2)', 'white', 'rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 0, 0.9)'],
    extrapolate: 'clamp',
  });

    const interpolatedPlus = position.x.interpolate({
      inputRange: [0, 5, 20, 200],
      outputRange: ['gray', 'gray', 'rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 0, 0.9)'],
      extrapolate: 'clamp',
    });
  
      const interpolatedMinus = position.x.interpolate({
        inputRange: [-200, -20, 0, 5],
        outputRange: ['rgba(255, 0, 0, 0.9)', 'rgba(255, 0, 0, 0.2)', 'gray', 'gray'],
        extrapolate: 'clamp',
      });

  const animatedCardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate: rotationValues },
    ],
    backgroundColor: interpolatedColor,
    borderColor: interpolatedColor,
  };

  const animatedHeartStyle = {
    transform: [{ translateX: 0 }, { translateY: 0 }],
    color: interpolatedPlus,
  };

  const animatedCloseStyle = {
    transform: [{ translateX: 0 }, { translateY: 0 }],
    color: interpolatedMinus,
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
            <AnimatedSvg name="close" style={[styles.svg, animatedCloseStyle]} />
            <AnimatedSvg name="heart" style={[styles.svg, animatedHeartStyle]} />
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
    position: 'absolute',
    bottom: -30,
    width: '100%',
    paddingHorizontal: 20,
  },
  svg: {
    marginHorizontal: 20,
    fontSize: 24,
    width: 24,
    height: 24,
    // color: 'red',
  },
});
