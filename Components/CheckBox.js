import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

export const CheckBox = ({ disabled, isSelected, onSelectChange }) => {
  
    const handlePress = () => {
    if (!disabled) {
      onSelectChange(!isSelected);
    }
  };

  return (
    <TouchableOpacity disabled={disabled} onPress={handlePress} style={{ ...styles.checkbox, backgroundColor: isSelected ? 'orange' : 'rgba(0, 0, 0, 0.03)' }}>
      {isSelected && (
        <View style={styles.iconContainer}>
          <AntDesign name="check" size={15} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});