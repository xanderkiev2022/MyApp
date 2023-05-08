import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function CommentsScreen() {

  return (
    <View style={styles.container}>
      <Image style={styles.photo} source={require('../assets/img/avatar.png')} />
      <View>
        <TextInput placeholder="Comment..." style={styles.inputComment} />
        <TouchableOpacity activeOpacity={0.8} style={styles.btnComment}>
          <AntDesign name="arrowup" size={24} color="#FFFFFF" style={styles.svgArrow} opacity={0.6} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    marginBottom: 8,
  },
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