import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { calculateAge } from '../Utils/ageValidation';

export const getCollectionOfEyeColors = async ({ setEyeCheckBoxFileds, setEyeColor }) => {
  const fetchedCollection = collection(db, 'users');
  const unsubscribe = onSnapshot(fetchedCollection, snapshot => {
    const userDataArray = snapshot.docs.map(doc => doc.data());

    // збираємо в масив нові значення + беремо останнє  значення з масиву масивів
    const filteredData = [
      ...new Set(
        userDataArray.map(user => {
          const modifiedUser = { ...user };
          // console.log('modifiedUser.length :>> ', modifiedUser.length);
          Object.keys(modifiedUser).forEach(eyeColor => {
            if (Array.isArray(modifiedUser[eyeColor])) {
              modifiedUser[eyeColor] = modifiedUser[eyeColor][modifiedUser[eyeColor].length - 1];
            }
          });
          return modifiedUser.eyeColor;
        })
      ),
    ];

    // створюємо масив об"єктів для чекбоксів
    const fields = filteredData.map(color => {
      if (color === undefined) {
        return { text: 'No information', value: 'noInfo', disabled: false };
      } else {
        const capitalizedColor = color.charAt(0).toUpperCase() + color.slice(1);
        return { text: `${capitalizedColor} color`, value: color, disabled: false };
      }
    });
    setEyeCheckBoxFileds(fields);
    setEyeColor(fields.map(field => field.value));
  });

  return unsubscribe;
};

// export const getCollectionOfBlackList = async ({ userId }) => {
//   console.log('userId :>> ', userId);
//    const fetchedCollection = collection(db, 'users');
//    const unsubscribe = onSnapshot(fetchedCollection, snapshot => {
//      const userDataArray = snapshot.docs.map(doc => doc.data());
// console.log('userDataArray :>> ', userDataArray);

//      const currentUser = userDataArray.find(user => user.userId === userId);
//      console.log('currentUser :>> ', currentUser);

//     //  if (currentUser) {
//     //    return currentUser.blackList;

//     //  } else {
//     //    return [];
//     //  }
//    });

//    return unsubscribe;
// };

// export const getCollectionOfFilteredUsers = async ({ ageLimit, eyeColor, setMyCollection, setCurrentIndex, resetPosition }) => {
//   const defaultAgeLimit = [18, 42];
//   const usersCollection = collection(db, 'users');
//   const unsubscribe = onSnapshot(usersCollection, snapshot => {
//     const userDataArray = snapshot.docs.map(doc => {
//       const user = doc.data();

//       const modifiedUser = { ...user };

//       Object.keys(modifiedUser).forEach(key => {
//         if (Array.isArray(modifiedUser[key])) {
//           modifiedUser[key] = modifiedUser[key][modifiedUser[key].length - 1];
//         }
//       });
//       const age = modifiedUser.birth ? calculateAge(modifiedUser.birth) : null;

//       return { ...modifiedUser, age };
//     });

//     const filteredUsers = userDataArray.filter(user => {
//       const userEyeColor = (!user.eyeColor && eyeColor && eyeColor.includes('noInfo')) || (eyeColor && eyeColor.includes(user.eyeColor));
//       const userAge = (user.age >= (ageLimit || defaultAgeLimit)[0] && user.age <= (ageLimit || defaultAgeLimit)[1]) || user.age === null;
//       return userEyeColor && userAge;
//     });

//     setMyCollection(filteredUsers);
//     setCurrentIndex(0);
//     resetPosition();
//   });

//   return unsubscribe;
// };

export const getCollectionOfFilteredUsers = async ({ ageLimit, eyeColor, blackList, setMyCollection, setCurrentIndex, resetPosition, userId }) => {
  const defaultAgeLimit = [18, 42];
  const usersCollection = collection(db, 'users');
  const unsubscribe = onSnapshot(usersCollection, snapshot => {
    const userDataArray = snapshot.docs.map(doc => {
      const user = doc.data();

      const modifiedUser = { ...user };

      Object.keys(modifiedUser).forEach(key => {
        if (Array.isArray(modifiedUser[key])) {
          modifiedUser[key] = modifiedUser[key][modifiedUser[key].length - 1];
        }
      });
      const age = modifiedUser.birth ? calculateAge(modifiedUser.birth) : null;

      return { ...modifiedUser, age };
    });

    const filteredUsers = userDataArray.filter(user => {
      const userEyeColor = (!user.eyeColor && eyeColor && eyeColor?.includes('noInfo')) || (eyeColor && eyeColor?.includes(user.eyeColor));
      const userAge =
        (user.age >= (ageLimit || defaultAgeLimit)[0] && user.age <= (ageLimit || defaultAgeLimit)[1]) || user.age === null || typeof user.age === 'undefined';
      // const userBlackList = user.userId === userId && user.blackList ? [...user.blackList] : [];
      const userInBlackList = blackList?.includes(user.userId);
      const currentUser = userId === user.userId;
      // console.log('user.userId :>> ', user.userId);
      // console.log('userInBlackList :>> ', userInBlackList);

      const result = userEyeColor && userAge && !userInBlackList && !currentUser;

      return result;
    });
    console.log('власник :>> ', userId);
    console.log('BlackList :>> ', blackList);
    console.log('Avaliable users :>> ', filteredUsers.map(user => user.userId));
    setMyCollection(filteredUsers);
    setCurrentIndex(0);
    resetPosition();
  });

  return unsubscribe;
};

// export const getFilteredUsers = async ({ database, ageLimit, eyeColor, blackList, setMyCollection, setCurrentIndex, resetPosition }) => {
//   const defaultAgeLimit = [18, 42];

//   const userDataArray = database.map(user => {
//     const modifiedUser = { ...user };

//     Object.keys(modifiedUser).forEach(key => {
//       if (Array.isArray(modifiedUser[key])) {
//         modifiedUser[key] = modifiedUser[key][modifiedUser[key].length - 1];
//       }
//     });
//     const age = modifiedUser.birth ? calculateAge(modifiedUser.birth) : null;

//     return { ...modifiedUser, age };
//   });

//   const filteredUsers = userDataArray.filter(user => {
//     const userEyeColor = (!user.eyeColor && eyeColor && eyeColor.includes('noInfo')) || (eyeColor && eyeColor.includes(user.eyeColor));
//     const userAge = (user.age >= (ageLimit || defaultAgeLimit)[0] && user.age <= (ageLimit || defaultAgeLimit)[1]) || user.age === null;
//     // const userInBlackList = blackList.includes(user.userId);
//     const result = userEyeColor && userAge;
//     // && !userInBlackList;
//     return result;
//   });
//   console.log('filteredUsers :>> ', filteredUsers);
//   setMyCollection(filteredUsers);
//   setCurrentIndex(0);
//   resetPosition();
// };
