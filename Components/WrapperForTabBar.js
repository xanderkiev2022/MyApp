import { CommonActions} from '@react-navigation/native';
import { ScrollView, Dimensions, View, FlatList, Text } from 'react-native';
import React, { useState } from 'react';

 
  // const height = Dimensions.get('window').height;
  // const width = Dimensions.get('window').width;

  // export const WrapperForTabBar = ({ navigation, children }) => {
    
    
    
export const onScrollHandler = (e, offset, setOffset, navigation) => {
  // const [offset, setOffset] = useState(0);
      
      const currentOffset = e.nativeEvent.contentOffset.y;
      const direction = currentOffset > offset ? 'down' : 'up';
      setOffset(currentOffset);

  if (direction === 'down') {
    console.log('down :>> ');
    console.log('navigation :>> ', navigation);
        navigation.dispatch(
          CommonActions.setParams({
            tabBarVisible: false,
            tabBarStyle: { display: 'none' },
          })
        );
      } else {
        navigation.dispatch(
          CommonActions.setParams({
            tabBarVisible: true,
            tabBarStyle: { display: 'flex' },
          })
        );
      }
    };

  //   return (
  //     <View onScroll={onScrollHandler} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       {/* <FlatList
  //         showsVerticalScrollIndicator={false}
  //         scrollEventThrottle={16}
  //         onScroll={onScrollHandler}
  //         data={[{ key: 'dummy' }]}
  //         renderItem={() => ( */}
  //           <Text>{children}</Text>
  //           {/* // {children} */}
  //           {/* // <View */}
  //           {/* //   style={{ */}
  //           {/* //     alignItems: 'center',
  //           //     height: height * 2,
  //           //     width: width,
  //           //     backgroundColor: 'pink',
  //           //   }}
  //           // >
  //           //   <View style={{ backgroundColor: 'turquoise', width: 100, height: height * 2 }} />
  //           // </View>
  //         )} */}
  //       {/* // /> */}
  //     </View>
  //   );
  // };

  // <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={onScrollHandler}></ScrollView>