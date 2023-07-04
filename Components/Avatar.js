import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { selectPhoto, selectUserId } from '../redux/auth/authSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { refreshAvatar } from '../redux/auth/authSlice';
import { choseFileOnHardDrive } from '../Utils/hardDriveUtils';
import { getUrlofUploadedAvatar } from '../firebase/config';
import { update } from '../redux/auth/authOperations';
import gpsLocation from '../Utils/gpsLocation';

export default function Avatar({ changeAvatarSvg, updateProfileData }) {
  const dispatch = useDispatch();
  const avatar = useSelector(selectPhoto);
  console.log('Avatar', avatar);
  const userId = useSelector(selectUserId);

  let photoOnHardDrive;
  let state;

  const handleChooseAvatar = async () => {
    try {
      photoOnHardDrive = await choseFileOnHardDrive();
      const { coords, parsedLocation } = await gpsLocation();
      const photo = await getUrlofUploadedAvatar(photoOnHardDrive, userId);
      state = {
        coordinate: coords,
        country: parsedLocation[0].country,
        region: parsedLocation[0].region,
        city: parsedLocation[0].city,
        street: parsedLocation[0].street,
        photo
      };

      try {
        if (userId) {          
          dispatch(update({ userId, state }));
          updateProfileData(state, field={name:'photo'});
        } else {
          dispatch(refreshAvatar({ photoOnHardDrive }));
          updateProfileData({ ...state, photo: photoOnHardDrive }, field={name:'photo'});
        }
      } catch (error) {
        console.log('Avatar. Problem with saving of avatar in state');
      } finally {
        // console.log('Avatar. UserId when chossing avatar', userId);
      }
    } catch (error) {
      console.log('Avatar. Problem with GPS / choosing of avatar on hard drive / uploading of avatar to cloud');
    } finally {
      console.log('Avatar. Link of avatar from state', avatar);
      console.log('Avatar. Link of avatar from hard drive', photoOnHardDrive);
    }
  };

  return (
    <View style={styles.container}>
      {avatar ? (
        <>
          <Image style={styles.avatarImg} source={{ uri: avatar }} />
          {!changeAvatarSvg && (
            <TouchableOpacity onPress={handleChooseAvatar}>
              <AntDesign name="closecircleo" style={styles.addRemoveAvatar} size={25} color="#E8E8E8" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Image style={styles.avatarImg} />
          {!changeAvatarSvg && (
            <TouchableOpacity onPress={handleChooseAvatar}>
              <AntDesign name="pluscircleo" style={styles.addRemoveAvatar} size={25} color="#FF6C00" backgroundColor="white" />
            </TouchableOpacity>
          )}
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
