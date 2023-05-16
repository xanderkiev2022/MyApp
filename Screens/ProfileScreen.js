import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { launchImageLibraryAsync } from 'react-native-image-picker';

// Firebase
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth, storage, database } from '../firebase/config';
import { selectName, selectUserId, selectPhoto } from '../redux/auth/authSelectors';
import { useSelector, useDispatch } from 'react-redux';
import PostComponent from '../Components/PostComponent';
import { logout, update } from '../redux/auth/authOperations';
import { BgImage } from '../Components/BgImage';
import { getAuth, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as ref2, set } from 'firebase/database';

import * as ImagePicker from 'expo-image-picker';
import { setDoc } from 'firebase/firestore'; 

export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectName);
  const userPhoto = useSelector(selectPhoto);

  const dispatch = useDispatch();

  const getAllPost = async () => {
   onSnapshot(collection(db, 'posts'), snapshot => {
      const postsArray = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(postsArray);
    });
  };

  useEffect(() => {
    getAllPost();
  }, []);

  // margin for last child
  const renderPostItem = ({ item, index }) => {
    const isLastItem = index === posts.length - 1;
    return <PostComponent post={item} navigation={navigation} isLastItem={isLastItem} forProfileScreen />;
  };

  const [image, setImage] = useState('');

  const handleChooseAvatar = async () => {
    await chooseImg();
  };

  // choose img on drive of the phone
  const chooseImg = async () => {
    const options = {
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    };
    let res = await ImagePicker.launchImageLibraryAsync(options);

    if (!res.canceled) {
      const { assets } = res;
      if (assets.length > 0) {
        const { uri } = assets[0];
        setImage(uri);
        console.log('image :>> ', image);
        // uploadInfo();
      }
    }
  };

  // upload photo
  const uploadData = async () => {
    try {
      const response = await fetch(image); // дістаємо фото зі стейту
      const file = await response.blob(); // перетворюємо отриману фотографію на об'єкт Blob
      const uniqueId = Date.now().toString(); // генеруємо унікальне ім"я для фото
      const fileName = `${uniqueId}.jpg`; // Використовуємо унікальне ім'я для файлу
      const linkToFile = ref(storage, `avatar/${userId}/${fileName}`); // створюємо посилання на місце збереження фото в Firebase
      await uploadBytes(linkToFile, file); // завантажуємо фото
      const photoUrl = await getDownloadURL(ref(storage, `avatar/${userId}/${fileName}`)); // отримуємо URL-адресу завантаженого фото
      return photoUrl;
    } catch (error) {
      console.log(error);
    }
  };



  const uploadInfo = async () => {
    try {
      const photoUrl = await uploadData();


      const uploadedInfo = {
        avatar: photoUrl,
        userId: userId,
      };
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, uploadedInfo);
    
      const auth = getAuth();
      const currentUser = auth.currentUser;
   if (currentUser) {
     await updateProfile(currentUser, {
       photoURL: photoUrl,
     });
     console.log('Profile updated successfully');
   } else {
     console.log('User is not authenticated');
   }
// update(photoUrl);

    } catch (error) {
      console.log(error);
    }
  };




useEffect(() => {
  if (image !== '') {
    uploadInfo();
  }
}, [image]);





  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <View style={styles.avatarBox}>
            <Image style={styles.avatarImg} source={{ uri: userPhoto }} />
            <TouchableOpacity onPress={handleChooseAvatar}>
              <AntDesign name="closecircleo" style={styles.addRemovePhoto} size={25} color="#E8E8E8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitSvg} onPress={() => dispatch(logout())}>
              <Ionicons name="exit-outline" size={28} color="#BDBDBD" backgroundColor="transparent" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarName}>{userName}</Text>
          <FlatList data={posts} style={styles.posts} keyExtractor={(__, index) => index.toString()} renderItem={renderPostItem} />
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
