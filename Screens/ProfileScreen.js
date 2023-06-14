import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity, View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { selectName } from '../redux/auth/authSelectors';
import { logout } from '../redux/auth/authOperations';
import { BgImage } from '../Components/BgImage';
import PostComponent from '../Components/PostComponent';
import Avatar from '../Components/Avatar';
// Firebase
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { onScrollHandler } from '../Components/WrapperForTabBar';


export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const userName = useSelector(selectName);

  const dispatch = useDispatch();

  const getAllPost = async () => {
    const postsCollection = query(collection(db, 'posts'));
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
    return <PostComponent post={item} navigation={navigation} isLastItem={isLastItem} forProfileScreen />
  };

  const [state, setState] = useState({ photo: null });



const [offset, setOffset] = useState(0);

  const onScroll = e => {
  onScrollHandler(e, offset, setOffset, navigation);
};

  const memoizedPosts = useMemo(() => posts, [posts]);


  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <View style={styles.avatarBox}>
            <Avatar setState={setState} />
            <TouchableOpacity style={styles.exitSvg} onPress={() => dispatch(logout())}>
              <Ionicons name="exit-outline" size={28} color="#BDBDBD" backgroundColor="transparent" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarName}>{userName}</Text>
          <FlatList
            // showsVerticalScrollIndicator={false}
            // scrollEventThrottle={16}
            onScroll={onScroll}
            data={memoizedPosts}
            style={styles.posts}
            keyExtractor={(__, index) => index.toString()}
            renderItem={renderPostItem}
          />
        </View>
      </BgImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily: 'RobotoRegular',
  },
  regScr: {
    paddingHorizontal: 16,
    width: '100%',
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'relative',
  },
  avatarBox: {
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    marginTop: -60,
    alignSelf: 'center',
    marginBottom: 32,
    alignItems: 'flex-end',
  },
  addRemovePhoto: {
    backgroundColor: '#fff',
    position: 'absolute',
    left: 108,
    top: 80,
    borderRadius: 25,
  },
  exitSvg: {
    position: 'absolute',
    top: 78,
    right: -120,
  },

  avatarName: {
    fontFamily: 'RobotoMedium',
    fontSize: 30,
    lineHeight: 35,
    color: '#212121',
    marginBottom: 32,
    alignSelf: 'center',
  },
  posts: {
    marginHorizontal: 8,
    height: '50%',
  },
});
