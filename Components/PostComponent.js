import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { EvilIcons, Feather, AntDesign, FontAwesome } from '@expo/vector-icons';

// Firebase
import { doc, updateDoc, collection, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { selectName, selectUserId } from '../redux/auth/authSelectors';

export default function PostComponent({ post, navigation, forProfileScreen }) {
  const { photo, name, location, coordinate, id, comments, likes } = post;

  const userId = useSelector(selectUserId);
  const userName = useSelector(selectName);

  const addLike = async () => {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    const ourLike = docData.likes.find(item => item.userId === userId);
    if (ourLike) {
      const updatedLikes = docData.likes.filter(item => item.userId !== userId);
      await updateDoc(docRef, {
        likes: updatedLikes,
      });
    } else {
      await updateDoc(docRef, {
        likes: [...docData.likes, { userId, userName }],
      });
    }
  };

    const deletePost = async () => {
      const docRef = doc(db, 'posts', id);
      await deleteDoc(docRef);
    };

  return (
    <View>
      <Image style={styles.photo} source={{ uri: photo }} />
      <Text style={styles.locationName}>{name}</Text>

      <View style={styles.iconsContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.innerWrapperIcons} onPress={() => navigation.navigate('Comments', post)}>
            <Feather style={styles.flippedIcon} name="message-circle" size={24} color="#BDBDBD" />
            <Text style={styles.messeges}>{comments}</Text>
          </TouchableOpacity>

          {!forProfileScreen && (
            <TouchableOpacity activeOpacity={0.8} style={styles.innerWrapperIcons} onPress={deletePost}>
              <FontAwesome name="trash" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          )}

          {forProfileScreen && (
            <TouchableOpacity activeOpacity={0.8} style={styles.innerWrapperIcons}>
              <AntDesign name="like2" size={24} color="#FF6C00" onPress={addLike} />
              <Text style={styles.messeges}>{likes.length}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.innerWrapperIcons} onPress={() => navigation.navigate('Map', coordinate)}>
          <EvilIcons name="location" size={24} color="#BDBDBD" />
          <Text style={styles.location}>{location}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 240,
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  locationName: {
    fontFamily: 'RobotoMedium',
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 11,
  },

  iconsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  messeges: {
    marginLeft: 9,
    marginRight: 24,
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },

  location: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
    textDecorationLine: 'underline',
  },

  innerWrapperIcons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },
  flippedIcon: {
    transform: [{ scaleX: -1 }],
  },
});
