import { CommonActions } from '@react-navigation/native';
import { Animated } from 'react-native';
import React, { useRef, useState } from 'react';

// Scroll
export const onScrollHandler = (e, offset, setOffset, navigation) => {
  const currentOffset = e.nativeEvent.contentOffset.y;
  const direction = currentOffset > offset ? 'down' : 'up';
  setOffset(currentOffset);

  if (direction === 'down') {
    console.log('down :>> ');
    navigation.dispatch(
      CommonActions.setParams({
        tabBarVisible: false,
      })
    );
  } else {
    console.log('up :>> ');
    navigation.dispatch(
      CommonActions.setParams({
        tabBarVisible: true,
      })
    );
  }
};

// Animation for tabBar
const opacityAnimation = new Animated.Value(1);
const bottomAnimation = new Animated.Value(0);

const animateTabBar = show => {
  Animated.parallel([
    Animated.timing(opacityAnimation, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(bottomAnimation, {
      toValue: show ? 0 : 50,
      duration: 150,
      useNativeDriver: true,
    }),
  ]).start();
};

export const getTabBarVisible = route => {
  const params = route.params;

  if (params) {
    if (params.tabBarVisible === false) {
      animateTabBar(false);
      return {
        position: 'absolute',
        transform: [{ translateY: bottomAnimation }],
        opacity: opacityAnimation,
      };
    }
  }
  animateTabBar(true);
  return {
    position: 'absolute',
    transform: [{ translateY: bottomAnimation }],
    opacity: opacityAnimation,
  };
};
