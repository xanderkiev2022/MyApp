import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';

// Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { selectName, selectUserId, selectPhoto, selectEmail, selectPass } from '../redux/auth/authSelectors';
import { useSelector } from 'react-redux';
import PostComponent from '../Components/PostComponent';
import { onScrollHandler } from '../Components/WrapperForTabBar';

export default function PostsScreenMain({ navigation }) {
  const [posts, setPosts] = useState([]);
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectName);
  const userEmail = useSelector(selectEmail);
  const userPhoto = useSelector(selectPhoto);

  const getAllPost = async () => {
      const postsCollection = query(collection(db, 'posts'), where('userId', '==', userId));
      onSnapshot(postsCollection, snapshot => {
        const postsArray = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => {
          if (a.date && b.date) {
            console.log('сортуємо :>> ');
            return b.date.seconds - a.date.seconds;
          }
          return 0;
        });
        setPosts(postsArray);
      });
    };

    useEffect(() => {
      getAllPost();
    }, []);


// margin for last child
const renderPostItem = ({ item, index }) => {
  const isLastItem = index === posts.length - 1;
  return <PostComponent post={item} navigation={navigation} isLastItem={isLastItem} />;
  };
  
  const pass = useSelector(selectPass);
  const [offset, setOffset] = useState(0);

  const onScroll = e => {
    onScrollHandler(e, offset, setOffset, navigation);
  };

  const memoizedPosts = useMemo(() => posts, [posts]);

  return (
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
      <FlatList onScroll={onScroll} data={memoizedPosts} style={styles.posts} keyExtractor={(__, index) => index.toString()} renderItem={renderPostItem} />
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
