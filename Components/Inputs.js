import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

export const InputLogin = ({ isFocused, ...rest }) => {
  return (
    <TextInput
      style={{ ...styles.input, borderColor: isFocused.login ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.login ? 'white' : '#F6F6F6' }}
      {...rest}
    />
  );
};

export const InputEmail = ({ isFocused, ...rest }) => {
  return (
    <TextInput
      style={{ ...styles.input, borderColor: isFocused.email ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.email ? 'white' : '#F6F6F6' }}
      {...rest}
    />
  );
};

export const InputPassword = React.forwardRef(({ isPasswordShown, onTogglePassword, isFocused, ...rest }, ref) => {
  return (
    <View style={[styles.inputPass]}>
      <TextInput
        ref={ref}
        secureTextEntry={!isPasswordShown}
        style={{ ...styles.input, borderColor: isFocused.password ? '#FF6C00' : '#E8E8E8', backgroundColor: isFocused.password ? 'white' : '#F6F6F6' }}
        {...rest}
      />
      <Text style={styles.showPass} onPress={onTogglePassword}>
        {isPasswordShown ? 'Hide' : 'Show'}
      </Text>
    </View>
  );
});


const styles = StyleSheet.create({
  input: {
    height: 50,
    width: 343,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8E8E8',
    backgroundColor: '#F6F6F6',
    color: '#212121',
    fontSize: 16,
  },
  inputPass: {
    position: 'relative',
  },
  showPass: {
    position: 'absolute',
    right: 32,
    top: 16,
    color: '#1B4371',
    fontSize: 16,
  },
});