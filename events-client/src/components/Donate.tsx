import React from 'react';

import {
  toEther,
  useContract,
  useContractWrite,
  Web3Button,
} from '@thirdweb-dev/react-native';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import web3 from 'web3-utils';

import { ACTIVE_OPACITY, CONTRACT_ADDRESS, FUNCTIONS } from '../constants';
import { DonateComponentProps } from '../types';
import { Controller, useForm } from 'react-hook-form';

const Donate: React.FC<DonateComponentProps> = ({
  isDonateModalVisible,
  setIsDonateModalVisible,
  eventId,
  refetchEvents,
}) => {
  const { control, watch } = useForm({
    defaultValues: { amount: 0 },
  });

  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: donateToEvent, isLoading } = useContractWrite(
    contract,
    FUNCTIONS.donate_to_event,
  );
  const amount = watch('amount');

  const donate = async () =>
    await donateToEvent(
      {
        args: [eventId],
        overrides: { value: amount },
      },
      {
        onSuccess: () => {
          ToastAndroid.showWithGravity(
            'Successfully donated',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          refetchEvents();
          setIsDonateModalVisible(false);
        },
      },
    );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isDonateModalVisible}
      onRequestClose={() => setIsDonateModalVisible(false)}>
      <Pressable
        className="h-full w-full items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        onPress={() => setIsDonateModalVisible(false)}>
        <View className="h-1/4 w-3/4 justify-center p-2  rounded-lg">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                name="amount"
                placeholder="Amount"
                placeholderTextColor="gray"
                keyboardType="number-pad"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="border border-gray-400 px-2 rounded-xl text-white mb-2"
              />
            )}
            name="amount"
          />

          <TouchableOpacity
            onPress={donate}
            activeOpacity={ACTIVE_OPACITY}
            disabled={isLoading}
            className="bg-white p-2 w-1/2 self-center items-center rounded-xl">
            <Text className="text-gray-700 font-bold">Donate</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default Donate;
