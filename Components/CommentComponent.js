import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserId } from '../redux/auth/authSelectors';
import moment from 'moment-timezone';
import { TouchableOpacity } from 'react-native';
moment.tz.setDefault('Europe/Kiev');
import { MaterialCommunityIcons, Feather, FontAwesome, Entypo } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function CommentComponent({ item, onDeleteComment, onReplyComment, onEditComment, onTranslateComment, selectedComments, setSelectedComments }) {
  const { comment, date, userId, photo, edited, translatedComment, repliedComment, del } = item;
  const myId = useSelector(selectUserId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleDelete = () => {
    if (userId === myId) {
      // onDeleteComment(item.id);
      onDeleteComment(selectedComments);
      setModalVisible(false);
    }
    return null;
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


  return (
    <>
      {!del && (
        <View style={styles.checkContainer}>
          {isAnyCheckboxSelected && (
            <Checkbox
              disabled={false}
              value={isSelected}
              onValueChange={handleLongPress}
              color={isSelected ? 'orange' : undefined}
              style={{ ...styles.checkbox }}
            />
          )}
          <View style={{ ...styles.container, width: isAnyCheckboxSelected ? '93%' : '100%', flexDirection: userId !== myId ? 'row' : 'row-reverse' }}>
            {!isAnyCheckboxSelected && (
              <Image source={{ uri: photo }} style={{ ...styles.avatar, marginLeft: userId !== myId ? 0 : 16, marginRight: userId !== myId ? 16 : 0 }} />
            )}

            <TouchableWithoutFeedback onPress={handlePress} onLongPress={handleLongPress}>
              <View
                style={{
                  ...styles.commentContainer,
                  marginLeft: userId !== myId ? 16 : 0,
                  borderTopStartRadius: userId !== myId ? 0 : 6,
                  borderTopEndRadius: userId !== myId ? 6 : 0,
                  backgroundColor: modalVisible || selected ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.03)',
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

            <Modal animationType="fade" transparent visible={modalVisible}>
              <TouchableWithoutFeedback onPress={handleModalClose}>
                <View style={styles.modalContainer}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <TouchableOpacity style={styles.svg} onPress={handleEdit}>
                        <Feather name="edit-2" size={20} color="#BDBDBD" />
                        <Text style={styles.deleteButton}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.svg} onPress={handleDelete}>
                        <Feather name="trash" size={20} color="#BDBDBD" />
                        <Text style={styles.deleteButton}>Delete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.svg} onPress={handleTranslate}>
                        <MaterialCommunityIcons name="google-translate" size={20} color="#BDBDBD" />
                        <Text style={styles.deleteButton}>Translate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.svg} onPress={handleReply}>
                        <Entypo name="reply" size={20} color="#BDBDBD" />
                        <Text style={styles.deleteButton}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  checkContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  container: {
    display: 'flex',
    marginBottom: 19,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 50,
    padding: 5,
    marginRight: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  checkedIcon: {
    alignSelf: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 6,
    width: 150,
  },

  svg: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    color: '#212121',
    marginLeft: 8,
  },
});
