import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Card from '../Components/Card';
import { BgImage } from '../Components/BgImage';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSelectors';
import { useCallback } from 'react';
import { update } from '../redux/auth/authOperations';
import { getCollectionOfUsersById } from '../firebase/getCollections';
import { useEffect } from 'react';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function EmptyScreen({ navigation, favorite }) {
  const dispatch = useDispatch();
  const { whiteList, blackList, userId } = useSelector(selectUserData);
  const [myCollection, setMyCollection] = useState([]);
  let list = blackList;

  const handleRemove = useCallback(
    currentUser => {
      console.log('handleRemove in ES :>> ');
      const updatedList = list.filter(user => user !== currentUser);
      const listKey = list === blackList ? 'blackList' : 'whiteList';
      dispatch(update({ userId, state: { [listKey]: updatedList } }));
    },
    [blackList, whiteList, dispatch, userId]
  );
    
  const getCollection = async (list) => {
    const filteredUsers = await getCollectionOfUsersById(list);
    console.log('filteredUsers :>> ', filteredUsers);
    setMyCollection(filteredUsers);
  }

  useEffect(() => {
    getCollection(list);
  }, [blackList, whiteList]);
  
  const numColumns = 2;
  const cardWidth = Dimensions.get('window').width / numColumns - 16;
  const cardHeight = Dimensions.get('window').height - 444;
  
  const renderItem = ({ item }) => (
    <View style={{ ...styles.card, width: cardWidth, height: cardHeight }}>
      <Card key={item.userId} noSwipe={true} favorite={list === whiteList} remove={handleRemove} currentCard={item} />
    </View>
  );
  
  return (
    <View style={styles.container}>
      <BgImage>
        {/* <View style={styles.favoriteContainer}>
          <TouchableOpacity onPress={() => getCollection(whiteList)}>
            <FontAwesome name="heart" style={styles.heartIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getCollection(blackList)}>
            <FontAwesome name="trash" style={styles.heartIcon} />
          </TouchableOpacity>
        </View> */}
        <View style={styles.cardContainer}>
          <FlatList
            data={myCollection}
            renderItem={renderItem}
            keyExtractor={item => item.userId}
            numColumns={numColumns}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </BgImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 50,
    paddingTop: 50,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  card: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  favoriteContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 30,
    paddingLeft: 16,
  },
  heartIcon: {
    marginLeft: 'auto',
    marginRight: 20,
    fontSize: 24,
    color: 'red',
  },
});
