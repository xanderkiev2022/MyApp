import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

// Firebase
import { doc, updateDoc, collection, getDoc, addDoc, onSnapshot, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { selectPhoto, selectUserId } from '../redux/auth/authSelectors';

import CommentComponent from '../Components/CommentComponent';
import { blockScreenshot } from '../Utils/blockScreenshoot';
import { openAiTranslate } from '../Utils/openAiTranslate';
import { ScrollToEnd } from '../Components/ScrollToEnd';

export default function CommentsScreen({ route, navigation }) {
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(selectUserId);
  const photo = useSelector(selectPhoto);
  const positionForScrollDownOfComments = useRef(null);
  const commentInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [repliedComment, setRepliedComment] = useState('');
  const [commentId, setCommentId] = useState('');
  const [isAtEnd, setIsAtEnd] = useState(false);

  blockScreenshot();

  const { photo: pic, id: postId } = route.params;

  const addComment = async () => {
    const date = new Date();

    if (editMode) {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, { comment: comment, edited: true });
      setEditMode(false);
    } else {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        comment,
        date,
        userId,
        photo,
        edited: false,
        translatedComment: '',
        repliedComment,
        del: false,
      });

      const docRef = doc(db, 'posts', postId); // Отримуємо посилання на конкретний об"єкт
      const docSnap = await getDoc(docRef); // Отримуємо знімок об"єкта
      const docData = docSnap.data(); // Отримуємо об"єкт

      await updateDoc(docRef, { comments: docData.comments + 1 }); // Оновлюємо запис
      setRepliedComment('');
    }
  };

  const editComment = async commentId => {
    setCommentId(commentId);
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    setComment(commentSnap.data().comment);

    const prevComment = `comment old ${new Date().getTime()}`;
    await updateDoc(commentRef, { [prevComment]: commentSnap.data().comment });
    setEditMode(true);
    commentInputRef.current.focus();
  };

  const replyComment = async repComment => {
    setRepliedComment(repComment);
    commentInputRef.current.focus();
  };

  const translateComment = async commentId => {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const needToTranslateComment = commentSnap.data().comment;
      const translatedComment = await openAiTranslate(needToTranslateComment);
      await updateDoc(commentRef, { translatedComment });
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedComments, setSelectedComments] = useState([]);

  const deleteComment = async commentIds => {
    // v2 del of several comments
  try {
    const batch = writeBatch(db);
    commentIds.forEach(commentId => {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      batch.delete(commentRef);
    });
    await batch.commit();

    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();
    const updatedCommentsCount = postData.comments - commentIds.length;
    await updateDoc(postRef, { comments: updatedCommentsCount });
    setSelectedComments([]);
  } catch (error) {
    console.error('Помилка при видаленні коментарів:', error);
  }

    // v1 del of 1 comment
    // const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    // try {
    //   // await updateDoc(commentRef, { del: true });
    //   await deleteDoc(commentRef);
    //   const postRef = doc(db, 'posts', postId);
    //   const postSnap = await getDoc(postRef);
    //   const postData = postSnap.data();
    //   await updateDoc(postRef, { comments: postData.comments - 1 });
    // } catch (error) {
    //   console.error('Помилка при видаленні коментаря:', error);
    // }
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

  const memoizedComments = useMemo(() => allComments, [allComments]);

  // const [containerHeight, setContainerHeight] = useState(0);
  // const scrollY = useRef(new Animated.Value(0)).current;

  // const scrollToBottom = () => {
  //     Animated.timing(scrollY, {
  //       toValue: 1, // Анімаційне значення для прокрутки до кінця
  //       duration: 500, // Тривалість анімації (500 мс)
  //       easing: Easing.linear, // Використовуйте бажану функцію ефекту затухання
  //       useNativeDriver: true, // Використовуйте вбудований драйвер анімації
  //     }).start();
  //   };


  const [textInputHeight, setTextInputHeight] = useState(45);


  const [contentHeight, setContentHeight] = useState(0);

  return (
    <>
      <KeyboardAwareFlatList
        style={styles.container}
        ListHeaderComponent={<Image style={styles.photo} source={{ uri: pic }} />}
        ListEmptyComponent={<Text>No comments yet</Text>}
        ref={positionForScrollDownOfComments}
        data={memoizedComments || []}
        keyExtractor={item => item.id.toString()}
        onLayout={e => {setContentHeight(e.nativeEvent.layout.height);}}
        renderItem={({ item }) => (
          <CommentComponent
            item={item}
            onDeleteComment={deleteComment}
            onEditComment={editComment}
            onTranslateComment={translateComment}
            onReplyComment={replyComment}
            selectedComments={selectedComments}
            setSelectedComments={setSelectedComments}
          />
        )}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height; // 50 is a threshold value
          setIsAtEnd(isEnd);
        }}
        onContentSizeChange={(contentWidth, contentHeight) => {
          if (contentHeight > 0) {
            setContentHeight(contentHeight);
            positionForScrollDownOfComments.current?.scrollToEnd({ animated: true });
          }
        }}
      />
      <ScrollToEnd isAtEnd={isAtEnd} positionRef={positionForScrollDownOfComments} contentHeight={contentHeight}/>

      <View style={styles.inputContainer}>
        {repliedComment && (
          <View style={styles.replyContainer}>
            <Text style={styles.repliedText}>"{repliedComment.length > 35 ? repliedComment.substring(0, 35) + '...' : repliedComment}"</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.btnClose}
              onPress={() => {
                setRepliedComment('');
              }}
            >
              <AntDesign name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.commentInputContainer}>
          <TextInput
            ref={commentInputRef}
            placeholder="Comment..."
            style={{
              ...styles.inputComment,
              height: textInputHeight,
            }}
            value={comment}
            onChangeText={text => setComment(text)}
            multiline
            numberOfLines={1}
            onContentSizeChange={e => setTextInputHeight(e.nativeEvent.contentSize.height)}
          />

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
                setTextInputHeight(45);
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 13,
  },
  photo: {
    marginTop: 32,
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: 32,
  },
  inputContainer: {},
  replyContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 8,
    top: 0,
    padding: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  btnClose: {
    marginRight: 9,
  },

  repliedText: {
    fontFamily: 'RobotoRegular',
    fontSize: 14,
    color: '#212121',
    paddingHorizontal: 8,
    fontStyle: 'italic',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  inputComment: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontFamily: 'RobotoMedium',
    fontSize: 16,
    lineHeight: 19,
    paddingRight: 50,
    paddingLeft: 16,
    paddingVertical: 5,
    maxHeight: 120,
    minHeight:45
  },
  btnComment: {
    height: 34,
    width: 34,
    borderRadius: 50,
    backgroundColor: '#FF6C00',
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
    right: 8,
  },
  svgArrow: {
    alignSelf: 'center',
    paddingTop: 4,
  },
});
