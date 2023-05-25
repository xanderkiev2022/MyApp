import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserId } from '../redux/auth/authSelectors';
import moment from 'moment-timezone';
import { TouchableOpacity } from 'react-native';
moment.tz.setDefault('Europe/Kiev');
import { FontAwesome } from '@expo/vector-icons';

export default function CommentComponent({ item, onDeleteComment }) {
  const { comment, date, userId, photo } = item;
  const myId = useSelector(selectUserId);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    onDeleteComment(item.id);
    setModalVisible(false);
     };

  const handlePress = () => {
    if (userId === myId) {
      setModalVisible(true);
    }
    return null;
  };

    const handleModalClose = () => {
      setModalVisible(false);
    };

  return (
    <View style={{ ...styles.container, flexDirection: userId !== myId ? 'row' : 'row-reverse' }}>
      <Image source={{ uri: photo }} style={{ ...styles.avatar, marginLeft: userId !== myId ? 0 : 16, marginRight: userId !== myId ? 16 : 0 }} />

      <TouchableWithoutFeedback onPress={handlePress}>
        <View
          style={{
            ...styles.commentContainer,
            marginLeft: userId !== myId ? 16 : 0,
            borderTopStartRadius: userId !== myId ? 0 : 6,
            borderTopEndRadius: userId !== myId ? 6 : 0,
            backgroundColor: modalVisible ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.03)',
          }}
        >
          <Text style={styles.commentText}>{comment}</Text>
          <Text style={styles.commentDate}>
            {moment(date.seconds * 1000).format('DD MMMM, YYYY')}&nbsp;|&nbsp;
            {moment(date.seconds * 1000).format('hh:mm')}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <Modal animationType="fade" transparent visible={modalVisible}>
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.deleteButtonContainer} onPress={handleDelete}>
                  <FontAwesome name="trash" size={20} color="#BDBDBD" />
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    marginBottom: 24,
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
    padding: 16,
  },
  commentText: {
    fontFamily: 'RobotoRegular',
    fontSize: 13,
    lineHeight: 18,
    color: '#212121',
    marginBottom: 8,
  },
  commentDate: {
    fontFamily: 'RobotoRegular',
    fontSize: 10,
    lineHeight: 12,
    color: '#BDBDBD',
    textAlign: 'right',
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
    flexDirection: 'row',
    alignItems: 'center',
  },

  deleteButtonContainer: {
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