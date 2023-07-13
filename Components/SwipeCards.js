import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../redux/auth/authOperations';
import { selectUserData } from '../redux/auth/authSelectors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(FontAwesome);
const AnimatedCircle = Animated.createAnimatedComponent(Entypo);

export const SwipeCards = ({ currentCard, setCurrentIndex, noSwipe, children }) => {
  const [position, setPosition] = useState(new Animated.ValueXY());
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUserData);
  // const [svgColor, setSvgColor] = useState('gray');
  const [isPressedMinus, setIsPressedMinus] = useState(false);
  const [isPressedPlus, setIsPressedPlus] = useState(false);
  const [percentage, setPercentage] = useState(0);

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
    setPercentage(interpolatedBorder);
    console.log('interpolatedBorder :>> ', interpolatedBorder);
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (event.nativeEvent.translationX > 150) {
        handlePressPlus();
      } else if (event.nativeEvent.translationX < -150) {
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
    inputRange: [-150, 0, 150],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const interpolatedColor = position.x.interpolate({
    inputRange: [-150, -20, 0, 20, 150],
    outputRange: ['red', 'rgba(255, 0, 0, 0.2)', 'white', 'rgba(0, 255, 0, 0.2)', 'green'],
    extrapolate: 'clamp',
  });

  const interpolatedPlus = position.x.interpolate({
    inputRange: [0, 5, 20, 150],
    outputRange: ['gray', 'gray', 'rgba(0, 255, 0, 0.2)', 'green'],
    extrapolate: 'clamp',
  });

  const interpolatedMinus = position.x.interpolate({
    inputRange: [-150, -20, -5, 0],
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

  const interpolatedBorder = position.x.interpolate({
    inputRange: [-150, 0],
    outputRange: [100, 0],
    extrapolate: 'clamp',
  });

  // animation of circle
  const size = 35;
  const strokewidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokewidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);
  const animation = toValue => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener(value => {
      strokeDashoffset = circumference - (circumference * value.value) / 100;
      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
  }, [percentage]);

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
            <View style={styles.innerIconContainer}>
              {/* <View style={styles.circle}> </View> */}
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
                <AnimatedSvg name="close" style={[styles.svg, animatedCloseStyle]} />
              </TouchableOpacity>
              <Svg width={size} height={size} style={styles.svgContainer}>
                <G rotation="-90" origin={center}>
                  <Circle stroke="grey" cx={center} cy={center} r={radius} strokewidth={strokewidth} />
                  <Circle
                    ref={progressRef}
                    stroke="red"
                    cx={center}
                    cy={center}
                    r={radius}
                    strokewidth={strokewidth}
                    strokeDasharray={circumference}
                    // strokeDashoffset={circumference - (circumference * 70) / 100}
                  />
                </G>
              </Svg>
            </View>
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

  innerIconContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  svgContainer: {
    position: 'absolute',
    bottom: 1,
    zIndex: -1,
    // fill: 'gray'
    // backgroundColor: 'gray',
  },
  svg: {
    fontSize: 38,
  },
  circle: {
    borderWidth: 2,
    // borderColor: 'gray',
    // borderRadius: 50,
    // width: 40,
    // height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
