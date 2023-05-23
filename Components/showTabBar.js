import {  BottomTabBar } from '@react-navigation/bottom-tabs';
import { Animated, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export const ScrollTab = ({ children }) => {
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const tabBarOpacity = new Animated.Value(1);

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const delta = 5; // Minimum scroll distance to trigger the change

    if (offsetY > delta) {
      // Scrolled down, hide the tab bar
      Animated.timing(tabBarOpacity, {
        toValue: 0,
        duration: 200, // Adjust the animation duration as needed
        useNativeDriver: true,
      }).start(() => setTabBarVisible(false));
    } else if (offsetY < -delta) {
      // Scrolled up, show the tab bar
      setTabBarVisible(true);
      Animated.timing(tabBarOpacity, {
        toValue: 1,
        duration: 200, // Adjust the animation duration as needed
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ScrollView onScroll={handleScroll}>
      <Animated.View style={[styles.tabBar, { opacity: tabBarOpacity }]}>
        <BottomTabBar />
      </Animated.View>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  tabBar: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // backgroundColor: '#fff', // Adjust the background color as needed
  },
});