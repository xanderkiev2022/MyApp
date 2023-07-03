import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useEffect } from 'react';
import { useMemo } from 'react';

import { getCollectionOfFilteredUsers } from '../firebase/getCollections';
import { SwipeCards } from '../Components/SwipeCards';

export default function Card({ navigation, ageLimit, eyeColor }) {
  console.log('ageLimit in Card :>> ', ageLimit);
  const [position, setPosition] = useState(new Animated.ValueXY());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myCollection, setMyCollection] = useState([]);

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    getCollectionOfFilteredUsers({ ageLimit, eyeColor, setMyCollection, setCurrentIndex, resetPosition });
  }, [ageLimit, eyeColor]);

  const memoizedCollection = useMemo(() => myCollection, [myCollection]);
  const currentCard = memoizedCollection[currentIndex];

  return (
    <>
      <View style={styles.regScr}>
        <Text style={{ ...styles.cardText, alignSelf: 'center' }}>Found {myCollection.length} profiles</Text>
        {currentCard ? (
          <SwipeCards setCurrentIndex={setCurrentIndex}>
            <View style={styles.card}>
              {currentCard.name && <Text style={styles.cardText}>Name: {currentCard.name}</Text>}
              {currentCard.birth && <Text style={styles.cardText}>Age: {currentCard.age}</Text>}
              {currentCard.region && <Text style={styles.cardText}>Region: {currentCard.region}</Text>}
              {currentCard.eyeColor && <Text style={styles.cardText}>Color of eyes: {currentCard.eyeColor}</Text>}
              {currentCard.photo && <Image style={styles.cardImage} source={{ uri: currentCard.photo }} />}
            </View>
          </SwipeCards>
        ) : (
          <View style={styles.cardContainer}>
            <Text style={styles.cardText}>You reached the finish</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  regScr: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: '75%',
    // backgroundColor: '#FFFFFF',
    backgroundColor: 'yellow',

    borderRadius: 25,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingTop: 10,
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
    borderRadius: 25,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
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
