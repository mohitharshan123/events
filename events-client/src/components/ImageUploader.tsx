import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UseFormSetValue } from 'react-hook-form/dist/types/form';

import { EventFormFields } from '../types';
import { ACTIVE_OPACITY } from '../constants';

type UploadToStorageType = {
  imageName: string;
  imagePath: string;
};

const ImageUploader: React.FC<{
  imageUrl: string;
  setValue: UseFormSetValue<EventFormFields>;
}> = ({ imageUrl, setValue }) => {
  const uploadImageToStorage = async ({
    imageName,
    imagePath,
  }: UploadToStorageType) => {
    let reference = storage().ref(imageName); // 2
    await reference.putFile(imagePath, { contentType: 'image/jpg' });
    const url = await reference.getDownloadURL();
    setValue('imageUrl', url);
  };

  const handleSelectImage = async () => {
    const uploadImage = (image: any) => {
      if (!image.assets?.length) return;
      const { uri: imagePath } = image.assets[0];
      const imageName = imagePath?.substring(imagePath.lastIndexOf('/') + 1);
      if (!imageName || !imagePath) return;

      uploadImageToStorage({ imageName, imagePath });
    };
    await launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      uploadImage,
    );
  };

  return (
    <>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-20 h-20"
          resizeMode="cover"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          className="rounded-xl "
          onPress={handleSelectImage}>
          <Icon name="image" color="grey" size={100} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default ImageUploader;
