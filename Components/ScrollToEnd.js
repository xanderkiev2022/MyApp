import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export const ScrollToEnd = ({ isAtEnd, positionRef, contentHeight}) => {
const [renderButtonDelay, setRenderButtonDelay] = useState(false);
const windowHeight = Dimensions.get('window').height;
const sizeOfContentIsBig = contentHeight > windowHeight;

  // Затримка 0,5 секунд на відображення кнопки скролу вниз
  useEffect(() => {
    let timeout;
    if (!isAtEnd && sizeOfContentIsBig) {
      timeout = setTimeout(() => {
        setRenderButtonDelay(true);
      }, 500);
    } else {
      setRenderButtonDelay(false);
    }
    return () => clearTimeout(timeout);
  }, [isAtEnd]);
  
      return (
        <>
          {!isAtEnd && sizeOfContentIsBig && renderButtonDelay && (
            <TouchableOpacity
              style={styles.scrollDownButton}
              onPress={() => {
                positionRef.current?.scrollToEnd({ animated: true });
              }}
            >
              <AntDesign name="arrowdown" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </>
      );
};

const styles = StyleSheet.create({
  scrollDownButton: {
    height: 34,
    width: 34,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    alignSelf: 'center',
    marginBottom: 33,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 9,
    bottom: 50,
  },
});
