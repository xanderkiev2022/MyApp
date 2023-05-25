import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useSelector } from 'react-redux';

// Firebase
import { doc, updateDoc, collection, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { selectPhoto, selectUserId } from '../redux/auth/authSelectors';

import CommentComponent from '../Components/CommentComponent';

export default function CommentsScreen({ route, navigation }) {
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(selectUserId);
  const photo = useSelector(selectPhoto);
  const positionForScrollDownOfComments = useRef(null);

  const { photo: pic, id: postId } = route.params;

  const addComment = async () => {
    const date = new Date();
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      // Додаємо новий запис до колекції "comments" під шляхом "posts/postId/comments"
      comment,
      date,
      userId,
      photo,
      // Вказуємо поля які будуть в цьому записі
    });

    const docRef = doc(db, 'posts', postId); // Отримуємо посилання на конкретний об"єкт
    const docSnap = await getDoc(docRef); // Отримуємо знімок об"єкта
    const docData = docSnap.data(); // Отримуємо об"єкт
    await updateDoc(docRef, { comments: docData.comments + 1 }); // Оновлюємо запис
  };

  const commentsCollection = async () => {
    onSnapshot(collection(db, 'posts', postId, 'comments'), querySnapshot => {
      // прослуховуємо зміни в колекції comments через querySnapshot (містить інформацію про змінені записи)
      const commentsArray = querySnapshot.docs
        // отримуємо масив коментарів
        .map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => a.date.seconds - b.date.seconds);
      // сортуємо по даті
      setAllComments(commentsArray);
      setLoading(false);
    });
  };

  useEffect(() => {
    commentsCollection();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.photo} source={{ uri: pic }} />

      {loading
        ? (<Text>Loading...</Text>)
        : allComments.length > 0
          ? (
            <FlatList
            ref={positionForScrollDownOfComments}
            data={allComments || []}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <CommentComponent item={item} />}
            onContentSizeChange={(contentWidth, contentHeight) => positionForScrollDownOfComments.current?.scrollToOffset({ offset: contentHeight })}
            />)
          : (<Text>No comments yet</Text>)}

      <View style={styles.inputContainer}>
        <TextInput placeholder="Comment..." style={styles.inputComment} value={comment} onChangeText={text => setComment(text)} />
        <TouchableOpacity activeOpacity={0.8} style={styles.btnComment}>
          <AntDesign
            name="arrowup"
            size={24}
            color="#FFFFFF"
            style={styles.svgArrow}
            opacity={0.6}
            onPress={() => {
              setComment('');
              Keyboard.dismiss();
              addComment();
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    marginBottom: 16,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  photo: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: 32,
  },
  inputContainer: {},
  inputComment: {
    backgroundColor: '#F6F6F6',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    fontFamily: 'RobotoMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  btnComment: {
    height: 34,
    width: 34,
    borderRadius: 50,
    backgroundColor: '#FF6C00',
    alignSelf: 'flex-end',
    marginTop: -43,
    marginRight: 8,
  },
  svgArrow: {
    alignSelf: 'center',
    paddingTop: 4,
  },
});