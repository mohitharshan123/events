import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAddress, Web3Button } from '@thirdweb-dev/react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import storage from '@react-native-firebase/storage';

import {
  ACTIVE_OPACITY,
  CONTRACT_ADDRESS,
  EVENT_FORM_INITIAL_VALUES,
  FUNCTIONS,
} from '../constants';
import DatePicker from 'react-native-date-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Screens, AddEventNavigationProp, EventFormFields } from '../types';

const Add = ({ navigation }: { navigation: AddEventNavigationProp }) => {
  const address = useAddress();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: EVENT_FORM_INITIAL_VALUES,
  });

  const createEvent = async (contract: any) => {
    await contract.call(FUNCTIONS.create_event, [
      address,
      title,
      description,
      target,
      deadline,
      imageUrl,
    ]);
    navigation.navigate(Screens.Events);
  };

  const uploadImageToStorage = async ({
    imageName,
    imagePath,
  }: {
    imageName: string;
    imagePath: string;
  }) => {
    let reference = storage().ref(imageName); // 2
    await reference.putFile(imagePath, { contentType: 'image/jpg' });
    const url = await reference.getDownloadURL();
    setValue('imageUrl', url);
  };

  const { title, description, target } = getValues();

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

  const deadline = watch('deadline');
  const imageUrl = watch('imageUrl');

  const renderInput = ({
    name,
    placeholder,
    isNumber = false,
  }: {
    name: keyof EventFormFields;
    placeholder: string;
    isNumber?: boolean;
  }) => (
    <>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType={isNumber ? 'number-pad' : 'default'}
            className="border border-gray-400 rounded-xl m-4 px-2"
          />
        )}
        name={name}
      />
      {errors[name] && <Text>This is required.</Text>}
    </>
  );

  return (
    <View className="h-full bg-black dark:bg-black p-4">
      {renderInput({ name: 'title', placeholder: 'Title' })}
      {renderInput({ name: 'description', placeholder: 'Description' })}
      {renderInput({ name: 'target', placeholder: 'Target', isNumber: true })}
      <>
        <View className="flex flex-row items-center mx-4 justify-between space-x-4 mb-10">
          <Text className="text-white font-bold ml-2">
            Deadline{' '}
            {deadline ? new Date(Number(deadline)).toLocaleDateString() : ''}
          </Text>
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            className="rounded-xl "
            onPress={() => setIsDatePickerOpen(true)}>
            <Icon name="calendar-o" color="grey" size={30} />
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          open={isDatePickerOpen}
          date={deadline ? new Date(Number(deadline)) : new Date()}
          onConfirm={date => {
            setIsDatePickerOpen(false);
            setValue('deadline', date.getTime().toString(), {
              shouldDirty: true,
            });
          }}
          onCancel={() => {
            setIsDatePickerOpen(false);
          }}
        />
      </>
      <View className="flex flex-row items-center mx-4 justify-between space-x-4 mb-10">
        <Text className="text-white font-bold ml-2">Image</Text>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            className="w-20 h-20"
            resizeMode="cover"
          />
        )}
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          className="rounded-xl "
          onPress={handleSelectImage}>
          <Icon name="image" color="grey" size={30} />
        </TouchableOpacity>
      </View>
      <View className="m-4">
        <Web3Button
          theme="dark"
          contractAddress={CONTRACT_ADDRESS}
          action={createEvent}>
          Create event
        </Web3Button>
      </View>
    </View>
  );
};

export default Add;
