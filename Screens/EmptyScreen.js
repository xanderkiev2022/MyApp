import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import Card from '../Components/Card';
import { BgImage } from '../Components/BgImage';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSelectors';
import { useCallback } from 'react';
import { update } from '../redux/auth/authOperations';
import { getCollectionOfUsersById } from '../firebase/getCollections';
import { useEffect } from 'react';
import { useState } from 'react';

export default function EmptyScreen({ navigation }) {
  const dispatch = useDispatch();
  const { blackList, userId } = useSelector(selectUserData);
  const [myCollection, setMyCollection] = useState([]);

  const handleRemove = useCallback(
    currentUser => {
      console.log('handleRemove in ES :>> ');
        const updatedBlackList = blackList.filter(user => user !== currentUser);
        dispatch(update({ userId, state: { blackList: updatedBlackList } }));
      },
      [blackList, dispatch, userId]
  );
    
  const getCollection = async () => {
    const filteredUsers = await getCollectionOfUsersById(blackList);
    setMyCollection(filteredUsers);
  }

  useEffect(() => {
    getCollection();
  }, [blackList]);
  
  const numColumns = 2;
  const cardWidth = Dimensions.get('window').width / numColumns - 16;
  const cardHeight = Dimensions.get('window').height - 444;
  
  const renderItem = ({ item }) => (
    <View style={{ ...styles.card, width: cardWidth, height: cardHeight }}>
      <Card key={item.userId} noSwipe={true} blackList={blackList} remove={handleRemove} currentCard={item} />
    </View>
  );
  
  return (
    <View style={styles.container}>
      <BgImage>
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
});
