import React from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { selectPhoto, selectUserId } from '../redux/auth/authSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { refreshAvatar } from '../redux/auth/authSlice';
import { choseFileOnHardDrive } from '../Utils/hardDriveUtils';
import { getUrlofUploadedAvatar } from '../firebase/config';
import { update } from '../redux/auth/authOperations';

export default function Avatar() {
  const dispatch = useDispatch();
  const avatar = useSelector(selectPhoto);
  const userId = useSelector(selectUserId);
  let photo;

  const handleChooseAvatar = async () => {
    photo = await choseFileOnHardDrive();

    if (userId) {
      const photoURL = await getUrlofUploadedAvatar(photo, userId);
      dispatch(update({ photoURL, userId }));
    } else {
      dispatch(refreshAvatar({ photo }));
    }
  };

  return (
    <View style={styles.container}>
      {avatar ? (
        <>
          <Image style={styles.avatarImg} source={{ uri: avatar }} />
          <TouchableOpacity onPress={handleChooseAvatar}>
            <AntDesign name="closecircleo" style={styles.addRemoveAvatar} size={25} color="#E8E8E8" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image style={styles.avatarImg} />
          <TouchableOpacity onPress={handleChooseAvatar}>
            <AntDesign name="pluscircleo" style={styles.addRemoveAvatar} size={25} color="#FF6C00" backgroundColor="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    alignItems: 'flex-end',
  },
  avatarImg: {
    height: '100%',
    width: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },

  addRemoveAvatar: {
    backgroundColor: '#fff',
    position: 'absolute',
    left: -12,
    top: -39,
    borderRadius: 25,
  },
});