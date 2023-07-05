import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '../Components/Card';
import { BgImage } from '../Components/BgImage';
import { useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSelectors';

export default function EmptyScreen({ navigation }) {

  const { blackList } = useSelector(selectUserData);
  
  return (
    <View style={styles.container}>
      <BgImage>
        <View style={styles.regScr}>
          <Card noSwipe={true} ageLimit={[18, 50]} eyeColor={['green', 'noInfo']} blackList = {blackList} />
        </View>
      </BgImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regScr: {
    paddingHorizontal: 16,
    height: '85%',
    backgroundColor: '#FFFFFF',
    // backgroundColor: 'yellow',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 16,
  },
});
