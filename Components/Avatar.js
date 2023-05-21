import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { launchImageLibraryAsync } from 'react-native-image-picker';

// Firebase
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth, storage, database } from '../firebase/config';
import { selectName, selectUserId, selectPhoto, selectEmail, selectPass } from '../redux/auth/authSelectors';
import { useSelector, useDispatch } from 'react-redux';
import PostComponent from '../Components/PostComponent';
import { login, logout, update } from '../redux/auth/authOperations';
import { BgImage } from '../Components/BgImage';
import { getAuth, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as ref2, set } from 'firebase/database';

import * as ImagePicker from 'expo-image-picker';
import { setDoc } from 'firebase/firestore';

export default function Avatar({ setState }) {
  const userId = useSelector(selectUserId);
  const userPhoto = useSelector(selectPhoto);

  const dispatch = useDispatch();

  const [image, setImage] = useState('');

  const handleChooseAvatar = async () => {
    await chooseImg();
  };

  // choose img on drive of the phone
  const chooseImg = async () => {
    const options = {
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    };
    let res = await ImagePicker.launchImageLibraryAsync(options);

    if (!res.canceled) {
      const { assets } = res;
      if (assets.length > 0) {
        const { uri } = assets[0];
        setImage(uri);
          setState(prevState => ({ ...prevState, photo: uri }));
        console.log('uri :>> ', uri);
      }
    }
  };

  // upload photo
//   const uploadData = async () => {
//     try {
//       const response = await fetch(image); // дістаємо фото зі стейту
//       const file = await response.blob(); // перетворюємо отриману фотографію на об'єкт Blob
//       const uniqueId = Date.now().toString(); // генеруємо унікальне ім"я для фото
//       const fileName = `${uniqueId}.jpg`; // Використовуємо унікальне ім'я для файлу
//       const linkToFile = ref(storage, `avatar/${userId}/${fileName}`); // створюємо посилання на місце збереження фото в Firebase
//       await uploadBytes(linkToFile, file); // завантажуємо фото
//       const photoUrl = await getDownloadURL(ref(storage, `avatar/${userId}/${fileName}`)); // отримуємо URL-адресу завантаженого фото
//       return photoUrl;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const uploadInfo = async () => {
//     try {
//       const photoUrl = await uploadData();

//       const uploadedInfo = {
//         avatar: photoUrl,
//         userId: userId,
//       };
//       const userRef = doc(db, 'users', userId);
//       await updateDoc(userRef, uploadedInfo);
//       dispatch(update({ photoUrl }));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (image !== '') {
//       uploadInfo();
//     }
//   }, [image]);

  return (
    <View style={styles.avatarBox}>
      <Image style={styles.avatarImg} source={{ uri: image || 'https://i.pravatar.cc/300' }} />
      <TouchableOpacity onPress={handleChooseAvatar}>
        {image ? (
          <AntDesign name="closecircleo" style={styles.addRemovePhoto} size={25} color="#E8E8E8" />
        ) : (
          <AntDesign name="pluscircleo" style={styles.addRemovePhoto} size={25} color="#FF6C00" backgroundColor="white" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
