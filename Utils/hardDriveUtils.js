import * as ImagePicker from 'expo-image-picker';

export const choseFileOnHardDrive = async () => {
  const options = {
    mediaType: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
  };

  let res = await ImagePicker.launchImageLibraryAsync(options);

  if (!res.canceled) {
    const { assets } = res;
    if (assets.length > 0) {
      const { uri } = assets[0];
      return uri;
    }
  }
};
