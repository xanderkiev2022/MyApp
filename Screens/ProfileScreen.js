import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

// Firebase
import { collection, query, where, onSnapshot, updateProfile } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { selectName, selectUserId, selectPhoto } from '../redux/auth/authSelectors';
import { useSelector, useDispatch } from 'react-redux';
import PostComponent from '../Components/PostComponent';
import { logout } from '../redux/auth/authOperations';
import { BgImage } from '../Components/BgImage';

export default function ProfileScreen({ navigation }) {
 const [posts, setPosts] = useState([]);
 const userId = useSelector(selectUserId);
 const userName = useSelector(selectName);
const userPhoto = useSelector(selectPhoto);
  
const dispatch = useDispatch();

 useEffect(() => {
  //  const postsCollection = query(collection(db, 'posts'), where('userId', '==', userId));
   const postsCollection = query(collection(db, 'posts')); // всі опубліковані пости
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

  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <View style={styles.avatarBox}>
            <Image style={styles.avatarImg} source={{ uri: userPhoto }} />
            <AntDesign name="closecircleo" style={styles.addRemovePhoto} size={25} color="#E8E8E8" />
            <TouchableOpacity style={styles.exitSvg} onPress={() => dispatch(logout())}>
              <Ionicons name="exit-outline" size={28} color="#BDBDBD" backgroundColor="transparent" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarName}>{userName}</Text>
          <FlatList
            data={posts}
            style={styles.posts}
            keyExtractor={(__, index) => index.toString()}
            renderItem={({ item }) => <PostComponent post={item} navigation={navigation} forProfileScreen />}
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
  avatarImg: {
    height: '100%',
    width: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
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
