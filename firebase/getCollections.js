import { collection, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { calculateAge } from '../Utils/ageValidation';

export const getCollectionOfEyeColors = async () => {
  const fetchedCollection = collection(db, 'users');
  try {
    const snapshot = await getDocs(fetchedCollection);
    const userDataArray = snapshot.docs.map(doc => doc.data());

    // збираємо в масив нові значення + беремо останнє  значення з масиву масивів
    const filteredData = [
      ...new Set(
        userDataArray.map(user => {
          const modifiedUser = { ...user };
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

    return fields;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// numeros call of this function. onSnapshot?
export const getCollectionOfFilteredUsersAAA = async ({
  sliderAge,
  eyeColor,
  blackList,
  setCurrentIndex,
  // resetPosition,
  userId,
}) => {
  const defaultSliderAge = [18, 42];
  const usersCollection = collection(db, 'users');

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      usersCollection,
      snapshot => {
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
            (user.age >= (sliderAge || defaultSliderAge)[0] && user.age <= (sliderAge || defaultSliderAge)[1]) ||
            user.age === null ||
            typeof user.age === 'undefined';
          const userInBlackList = blackList?.includes(user.userId);
          const currentUser = userId === user.userId;
          const result = userEyeColor && userAge && !currentUser && !userInBlackList;
          return result;
        });
        console.log('getCollectionOfFilteredUsers ');
        resolve(filteredUsers);
        setCurrentIndex(0);
      },
      reject
    );

    return unsubscribe;
  });
};

export const getCollectionOfFilteredUsers = async ({ sliderAge, eyeColor, blackList, setCurrentIndex, userId }) => {
  const defaultSliderAge = [18, 42];
  const usersCollection = collection(db, 'users');

  try {
    const snapshot = await getDocs(usersCollection);
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
        (user.age >= (sliderAge || defaultSliderAge)[0] && user.age <= (sliderAge || defaultSliderAge)[1]) ||
        user.age === null ||
        typeof user.age === 'undefined';
      const userInBlackList = blackList?.includes(user.userId) || null;
      const currentUser = userId === user.userId;

      const result = userEyeColor && userAge && !userInBlackList && !currentUser;
      return result;
    });

    console.log('getCollectionOfFilteredUsers');
    setCurrentIndex(0);
    return filteredUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getCollectionOfUsersById = usersArray => {
  const usersCollection = collection(db, 'users');
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      usersCollection,
      snapshot => {
        const userDataArray = snapshot.docs.map(doc => doc.data());
        const filteredUsers = userDataArray.filter(user => usersArray?.includes(user.userId));
        resolve(filteredUsers);
      },
      reject
    );
    return unsubscribe;
  });
};


export const getCollectionOfUsersByIdAAAAAAAA = async usersArray => {
  const usersCollection = collection(db, 'users');
  try {
    const snapshot = await getDocs(usersCollection);
    const userDataArray = snapshot.docs.map(doc => doc.data());
    const filteredUsers = userDataArray.filter(user => usersArray?.includes(user.userId));
    return filteredUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
