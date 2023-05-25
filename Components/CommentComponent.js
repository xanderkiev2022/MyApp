import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserId } from '../redux/auth/authSelectors';
import moment from 'moment-timezone';
import { TouchableOpacity } from 'react-native';
moment.tz.setDefault('Europe/Kiev');

export default function CommentComponent({ item, onDeleteComment }) {
  const { comment, date, userId, photo } = item;
  const myId = useSelector(selectUserId);

  const handleDelete = () => {
    onDeleteComment(item.id);
  };

  const renderDeleteButton = () => {
    if (userId === myId) {
      return (
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={{ ...styles.container, flexDirection: userId !== myId ? 'row' : 'row-reverse' }}>
      <Image source={{ uri: photo }} style={{ ...styles.avatar, marginLeft: userId !== myId ? 0 : 16, marginRight: userId !== myId ? 16 : 0 }} />
      <View
        style={{
          ...styles.commentContainer,
          marginLeft: userId !== myId ? 16 : 0,
          borderTopStartRadius: userId !== myId ? 0 : 6,
          borderTopEndRadius: userId !== myId ? 6 : 0,
        }}
      >
        <Text style={styles.commentText}>{comment}</Text>
        <Text style={styles.commentDate}>
          {moment(date.seconds * 1000).format('DD MMMM, YYYY')}&nbsp;|&nbsp;
          {moment(date.seconds * 1000).format('hh:mm')}
        </Text>
      </View>
      {renderDeleteButton()}
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
});