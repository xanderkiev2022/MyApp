import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '../Components/Card';
import { BgImage } from '../Components/BgImage';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSelectors';
import { useCallback } from 'react';
import { update } from '../redux/auth/authOperations';
import { getCollectionOfUsersById } from '../firebase/getCollections';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';

export default function EmptyScreen({ navigation }) {

  const { blackList, userId } = useSelector(selectUserData);
  const dispatch = useDispatch();
    const [myCollection, setMyCollection] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

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
  
  useEffect( () => {
      getCollection();
    }, [blackList]);
  
      const memoizedCollection = useMemo(() => myCollection, [myCollection]);
      const currentCard = memoizedCollection[currentIndex];
  
  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <Card
            noSwipe={true}
            blackList={blackList}
            remove={handleRemove}
            currentCard={currentCard}
            setCurrentIndex={setCurrentIndex}
          />
        </View>
      </BgImage>
    </View>
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
    // backgroundColor: 'yellow',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 16,
  },
});
