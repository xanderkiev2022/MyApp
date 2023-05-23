import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { EvilIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

// Firebase
import { collection, query, where, onSnapshot, updateProfile } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { selectName, selectUserId, selectPhoto, selectEmail, selectPass } from '../redux/auth/authSelectors';
import { useSelector, useDispatch } from 'react-redux';
import PostComponent from '../Components/PostComponent';
import { WrapperForTabBar, onScrollHandler } from '../Components/WrapperForTabBar';

export default function PostsScreenMain({ navigation }) {
  const [posts, setPosts] = useState([]);
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectName);
  const userEmail = useSelector(selectEmail);
  const userPhoto = useSelector(selectPhoto);

  useEffect(() => {
    const postsCollection = query(collection(db, 'posts'), where('userId', '==', userId));
    onSnapshot(postsCollection, querySnapshot => {
      // прослуховування колекції posts
      const postsArray = querySnapshot.docs.map(doc => ({
        // при зміні posts querySnapshot викликається повторно з оновленими даними
        ...doc.data(), // Для кожного поста створюється новий об'єкт, який містить всі дані про пост, а також його id.
        id: doc.id,
      }));
      setPosts(postsArray);
    });
  }, []);


// margin for last child
const renderPostItem = ({ item, index }) => {
  const isLastItem = index === posts.length - 1;
  return <PostComponent post={item} navigation={navigation} isLastItem={isLastItem} />;
  };
  
    // const email = useSelector(selectEmail);
    const pass = useSelector(selectPass);
    // console.log('email :>> ', email);
    // console.log('pass :>> ', pass);
  
  const [offset, setOffset] = useState(0);

  const onScroll = e => {
    onScrollHandler(e, offset, setOffset, navigation);
  };

  

  return (
    // <WrapperForTabBar navigation={navigation}>
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatarImg} source={{ uri: userPhoto }} />
        <View style={styles.avatarData}>
          <Text style={styles.avatarName}>{userName}</Text>
          <Text style={styles.avatarEmail}>
            {userEmail}, {pass}
          </Text>
        </View>
      </View>
      <FlatList onScroll={onScroll} data={posts} style={styles.posts} keyExtractor={(__, index) => index.toString()} renderItem={renderPostItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },

  avatarContainer: {
    flexDirection: 'row',
    marginVertical: 32,
    alignItems: 'center',
  },

  avatarImg: {
    width: 60,
    height: 60,
  },

  avatarData: {
    marginLeft: 8,
  },

  avatarName: {
    color: '#212121',
    fontFamily: 'RobotoBold',
    fontSize: 13,
    lineHeight: 15,
  },

  avatarEmail: {
    color: 'rgba(33, 33, 33, 0.8)',
    fontFamily: 'RobotoRegular',
    fontSize: 11,
    lineHeight: 13,
  },
});
