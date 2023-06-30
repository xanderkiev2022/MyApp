import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, FlatList, Image, TouchableOpacity } from 'react-native';
import { BgImage } from '../Components/BgImage';
import Avatar from '../Components/Avatar';
import PostComponent from '../Components/PostComponent';
import { useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSelectors';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

// Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { calculateAge } from '../Utils/ageValidation';

export default function EmptyScreen({ navigation, ageLimit }) {
  console.log('ageLimit :>> ', ageLimit);
  const [position, setPosition] = useState(new Animated.ValueXY());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myCollection, setMyCollection] = useState([]);

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

  const getCollection = async () => {
    const usersCollection = collection(db, 'users');

    onSnapshot(usersCollection, snapshot => {
      const userDataArray = snapshot.docs.map(doc => doc.data());
      // .map(doc => doc.data().photo);
      const modifiedCollection = userDataArray.map(user => {
        const modifiedUser = { ...user };

        Object.keys(modifiedUser).forEach(key => {
          if (Array.isArray(modifiedUser[key])) {
            modifiedUser[key] = modifiedUser[key][modifiedUser[key].length - 1];
          }
        });

        return modifiedUser;
      });

      setMyCollection(modifiedCollection);
      console.log('modifiedCollection :>> ', modifiedCollection);
    });
  };

  useEffect(() => {
    getCollection();
  }, []);

  const memoizedCollection = useMemo(() => myCollection, [myCollection]);
  const currentCard = memoizedCollection[currentIndex];

  return (
    // <View style={styles.container}>
    // <BgImage>
    <View style={styles.regScr}>
      {/* <View style={styles.avatarImg}>
             <Avatar changeAvatarSvg={true} />
          </View> */}
      {currentCard ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureStateChange}>
            <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
              <View style={styles.card}>
                {currentCard.name && <Text style={styles.cardText}>Name: {currentCard.name}</Text>}
                {currentCard.birth && <Text style={styles.cardText}>Age: {calculateAge(currentCard.birth)}</Text>}
                {currentCard.region && <Text style={styles.cardText}>Region: {currentCard.region}</Text>}
                {currentCard.photo && <Image style={styles.cardImage} source={{ uri: currentCard.photo }} />}
              </View>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      ) : (
        <View style={styles.cardContainer}>
          <Text style={styles.cardText}>You reached the finish</Text>
        </View>
      )}
    </View>
    // </BgImage>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regScr: {
    paddingHorizontal: 16,
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatarImg: {
    width: 120,
    height: 120,
    marginTop: -60,
    alignSelf: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    height: 400,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 300,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
