import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SwipeCards } from '../Components/SwipeCards';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Card({
  navigation,
  currentCard,
  setCurrentIndex,
  noSwipe,
  favorite,
  remove,
}) {

  // const resetPosition = () => {
  //   Animated.spring(position, {
  //     toValue: { x: 0, y: 0 },
  //     useNativeDriver: false,
  //   }).start();
  // };

  return (
    <>
      <View style={styles.regScr}>
        {currentCard ? (
          <SwipeCards currentCard={currentCard} setCurrentIndex={setCurrentIndex} noSwipe={noSwipe}>
            <View style={styles.card}>
              {noSwipe && (
                <TouchableOpacity onPress={() => remove(currentCard.userId)}>
                  {favorite && <FontAwesome name="heart" style={styles.heartIcon} />}
                  {!favorite && <Text style={{ marginLeft: 'auto', marginRight: 20 }}>X</Text>}
                </TouchableOpacity>
              )}
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
    paddingHorizontal: 1,
    paddingVertical: 1,
    height: '100%',
    // height: '75%',
    // backgroundColor: '#FFFFFF',
    // backgroundColor: 'yellow',
    borderRadius: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingTop: 10,
    width: '100%',
    height: '100%',
    borderRadius: 5,
    // backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: 'green',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    elevation: 80,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
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
  heartIcon: {
    marginLeft: 'auto',
    marginRight: 20,
    fontSize: 24,
    color: 'red',
  },
});
