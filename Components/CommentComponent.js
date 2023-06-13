import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserId } from '../redux/auth/authSelectors';
import moment from 'moment-timezone';
import { TouchableOpacity } from 'react-native';
moment.tz.setDefault('Europe/Kiev');
import { CheckBox } from './CheckBox';
import ContextMenu from './ContextMenu';
import { SwipeMessage } from './SwipeMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CommentComponent({
  item,
  onDeleteComment,
  onReplyComment,
  onEditComment,
  onTranslateComment,
  selectedComments,
  setSelectedComments,
}) {
  const { comment, date, userId, photo, edited, translatedComment, repliedComment, del } = item;
  const myId = useSelector(selectUserId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleDelete = () => {
    // if (userId === myId) {
    if (!selectedComments.length) {
      onDeleteComment([item.id]);
    } else {
      onDeleteComment(selectedComments);
    }
    setModalVisible(false);
    // }
    // return null;
  };

  const handleEdit = () => {
    if (userId === myId) {
      onEditComment(item.id);
      setModalVisible(false);
    }
    return null;
  };

  const handleTranslate = () => {
    onTranslateComment(item.id);
    setModalVisible(false);
  };

  const handleReply = () => {
    onReplyComment(item.comment);
    setModalVisible(false);
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const renderCommentText = () => {
    if (expanded) {
      return (
        <View style={styles.replyContainer}>
          <Text style={styles.repliedText}>"{repliedComment}"</Text>
          {renderMoreButton()}
        </View>
      );
    } else {
      return (
        <View style={styles.replyContainer}>
          <Text style={styles.repliedText}>"{repliedComment.length > 35 ? repliedComment.substring(0, 35) + '...' : repliedComment}"</Text>
          {renderMoreButton()}
        </View>
      );
    }
  };

  const renderMoreButton = () => {
    if (repliedComment.length <= 35) {
      return null;
    } else {
      return (
        <TouchableOpacity style={styles.replyBtn} onPress={toggleExpanded}>
          <Text style={styles.moreLessBtn}>{expanded ? 'less' : 'more'}</Text>
        </TouchableOpacity>
      );
    }
  };

  const isSelected = selectedComments.includes(item.id);

  const handleLongPress = () => {
    setSelected(!selected);
    console.log('handleLongPress :>> ');
    handleSelectComments();
  };

  const handleSelectComments = () => {
    if (isSelected) {
      setSelectedComments(selectedComments.filter(commentId => commentId !== item.id));
    } else {
      setSelectedComments(prevState => [...prevState, item.id]);
    }
  };

  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);

  useEffect(() => {
    setIsAnyCheckboxSelected(selectedComments.length > 0);
  }, [selectedComments]);

  // Рендер з затримкою
  const [scheduledRender, setScheduledRender] = useState(false);
  useEffect(() => {
    const checkScheduledDate = async () => {
      const scheduledDate = new Date().getTime() + 10000; // Приклад затримки 10 секунд
      await AsyncStorage.setItem('scheduledDate', scheduledDate.toString());
      const scheduledDateReceivedFromStorrage = await AsyncStorage.getItem('scheduledDate');
      const renderDate = parseInt(scheduledDateReceivedFromStorrage, 10);

      if (renderDate) {
        const currentDate = new Date().getTime();
        if (currentDate >= renderDate) {
          setScheduledRender(true);
        } else {
          const timeout = setTimeout(() => {
            setScheduledRender(true);
            console.log('time to render :>> ');
            AsyncStorage.setItem('scheduledDate', '0');
          }, renderDate - currentDate);
          return () => clearTimeout(timeout);
        }
      }
    };
    checkScheduledDate();
  }, []);

  return (
    <>
      {!del && scheduledRender && (
        <View style={styles.linesBetweenMessages}>
          <SwipeMessage onDelete={handleDelete} onReply={handleReply}>
            <View style={styles.checkContainer}>
              {isAnyCheckboxSelected && <CheckBox disabled={false} isSelected={isSelected} onSelectChange={handleLongPress} />}

              <View style={{ ...styles.container, width: isAnyCheckboxSelected ? '93%' : '100%', flexDirection: userId !== myId ? 'row' : 'row-reverse' }}>
                {!isAnyCheckboxSelected && (
                  <Image source={{ uri: photo }} style={{ ...styles.avatar, marginLeft: userId !== myId ? 0 : 16, marginRight: userId !== myId ? 16 : 0 }} />
                )}

                <TouchableWithoutFeedback
                  onPress={isAnyCheckboxSelected ? handleLongPress : handlePress}
                  onLongPress={isAnyCheckboxSelected ? handlePress : handleLongPress}
                >
                  <View
                    style={{
                      ...styles.commentContainer,
                      marginLeft: userId !== myId ? 16 : 0,
                      borderTopStartRadius: userId !== myId ? 0 : 6,
                      borderTopEndRadius: userId !== myId ? 6 : 0,
                      backgroundColor: modalVisible || selected ? 'rgba(0, 0, 0, 0.25)' : 'rgb(229, 229, 229)',
                    }}
                  >
                    <View style={styles.textContainer}>
                      {repliedComment && renderCommentText()}
                      {translatedComment && <Text style={styles.repliedText}>UA: {translatedComment}</Text>}
                      <Text style={styles.commentText}>{comment}</Text>
                    </View>

                    <View style={styles.commentDateContainer}>
                      {edited && <Text style={styles.commentEdited}>Edited</Text>}
                      <Text style={styles.commentDate}>
                        {moment(date.seconds * 1000).format('DD MMMM, YYYY')}&nbsp;|&nbsp;
                        {moment(date.seconds * 1000).format('HH:mm')}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>

                <ContextMenu
                  visible={modalVisible}
                  modalClose={handleModalClose}
                  edit={handleEdit}
                  del={handleDelete}
                  translate={handleTranslate}
                  reply={handleReply}
                />
              </View>
            </View>
          </SwipeMessage>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  linesBetweenMessages: {
    marginBottom: 19,
  },
  checkContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  container: {
    display: 'flex',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  commentContainer: {
    flex: 1,
    borderBottomEndRadius: 6,
    borderBottomStartRadius: 6,
    // width: '100%'
    // width: 200,
    // backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  textContainer: {},
  replyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  repliedText: {
    fontFamily: 'RobotoRegular',
    fontSize: 11,
    color: '#212121',
    paddingHorizontal: 8,
    flexGrow: 1,
    flexShrink: 1,
  },
  moreLessBtn: {
    fontFamily: 'RobotoRegular',
    fontSize: 11,
    textDecorationLine: 'underline',
    color: '#212121',
    paddingHorizontal: 8,
  },
  commentText: {
    fontFamily: 'RobotoRegular',
    width: '100%',
    fontSize: 13,
    lineHeight: 18,
    color: '#212121',
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  commentDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  commentDate: {
    fontFamily: 'RobotoRegular',
    fontSize: 10,
    lineHeight: 12,
    color: '#BDBDBD',
    textAlign: 'right',
    marginLeft: 'auto',
  },
  commentEdited: {
    fontFamily: 'RobotoRegular',
    fontSize: 10,
    lineHeight: 12,
    color: '#BDBDBD',
    marginRight: 'auto',
  },
});
