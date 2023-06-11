import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';

export default function ContextMenu({ visible, modalClose, edit, del, translate, reply }) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={modalClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.svg} onPress={edit}>
                <Feather name="edit-2" size={20} color="#BDBDBD" />
                <Text style={styles.textBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.svg} onPress={del}>
                <Feather name="trash" size={20} color="#BDBDBD" />
                <Text style={styles.textBtn}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.svg} onPress={translate}>
                <MaterialCommunityIcons name="google-translate" size={20} color="#BDBDBD" />
                <Text style={styles.textBtn}>Translate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.svg} onPress={reply}>
                <Entypo name="reply" size={20} color="#BDBDBD" />
                <Text style={styles.textBtn}>Reply</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  textBtn: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    color: '#212121',
    marginLeft: 8,
  },
});
