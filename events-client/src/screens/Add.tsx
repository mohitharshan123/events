import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Web3Button } from '@thirdweb-dev/react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWallet } from '@thirdweb-dev/react-native';

import { ACTIVE_OPACITY, CONTRACT_ADDRESS } from '../constants';
import DatePicker from 'react-native-date-picker';
import { CreateEventProp, EventFormFields } from '../types';
import ImageUploader from '../components/ImageUploader';
import useCreateEvent from '../hooks/useCreateEvent';

const Add = ({ navigation }: CreateEventProp) => {
  const wallet = useWallet();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    deadline,
    imageUrl,
    control,
    errors,
    setValue,
    createEvent,
    handleSubmit,
  } = useCreateEvent({ navigation });

  const renderInput = ({
    name,
    placeholder,
    isNumber = false,
    isDate = false,
  }: {
    name: keyof EventFormFields;
    placeholder: string;
    isNumber?: boolean;
    isDate?: boolean;
  }) => (
    <>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => {
          if (isDate) {
            return (
              <DatePicker
                modal
                open={isDatePickerOpen}
                date={deadline ? new Date(Number(deadline)) : new Date()}
                onConfirm={date => onChange(date.getTime().toString())}
                onCancel={() => setIsDatePickerOpen(false)}
              />
            );
          }
          return (
            <TextInput
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType={isNumber ? 'number-pad' : 'default'}
              className="border border-gray-400 rounded-xl m-4 px-2"
            />
          );
        }}
        name={name}
      />
      {errors[name] && (
        <Text className="text-xs ml-4 text-red-600">This is required.</Text>
      )}
    </>
  );

  if (!wallet) {
    return (
      <View className="h-full flex justify-center items-center bg-black dark:bg-black p-4">
        <Text className="font-bold text-lg">Please connect your wallet</Text>
      </View>
    );
  }

  return (
    <View className="h-full bg-black dark:bg-black p-4">
      {renderInput({ name: 'title', placeholder: 'Title' })}
      {renderInput({ name: 'description', placeholder: 'Description' })}
      {renderInput({ name: 'target', placeholder: 'Target', isNumber: true })}
      <>
        <View className="flex flex-row items-center mx-4 space-x-4 mb-10">
          <Text className="text-white ml-2">Deadline </Text>
          {deadline && (
            <Text className="border border-gray-500 p-2 rounded-full">
              {' '}
              {new Date(Number(deadline)).toLocaleDateString()}
            </Text>
          )}
          {renderInput({
            name: 'deadline',
            placeholder: 'Deadline',
            isDate: true,
          })}
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            className="rounded-xl "
            onPress={() => setIsDatePickerOpen(true)}>
            <Icon name="calendar-o" color="grey" size={30} />
          </TouchableOpacity>
        </View>
      </>
      <View className="flex flex-row items-center mx-4 space-x-4 mb-10">
        <Text className="text-white font-bold ml-2">Image</Text>
        <View>
          <ImageUploader imageUrl={imageUrl} setValue={setValue} />
        </View>
      </View>
      <View className="m-4">
        <Web3Button
          theme="dark"
          contractAddress={CONTRACT_ADDRESS}
          action={contract => handleSubmit(createEvent(contract))}>
          Create event
        </Web3Button>
      </View>
    </View>
  );
};

export default Add;
