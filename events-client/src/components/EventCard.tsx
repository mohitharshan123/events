import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import Animated, {
  LightSpeedInLeft,
  FadeInLeft,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ACTIVE_OPACITY } from '../constants';
import { useWallet } from '@thirdweb-dev/react-native';

import { EventCardProps, Screens } from '../types';
import Donate from './Donate';

export const IMAGE_HEIGHT = 300;

const EventCard = ({
  event,
  translationY = undefined,
  loadedFrom = Screens.Events,
  refetchEvents = () => {},
  navigation,
}: EventCardProps) => {
  const wallet = useWallet();
  const [isDonateModalVisible, setIsDonateModalVisible] =
    useState<boolean>(false);
  const animatedCardStyles = useAnimatedStyle(() => {
    if (!translationY) return {};

    const height = interpolate(
      translationY.value,
      [0, IMAGE_HEIGHT],
      [IMAGE_HEIGHT, 0],
      {
        extrapolateRight: Extrapolate.CLAMP,
        extrapolateLeft: Extrapolate.CLAMP,
      },
    );
    const opacity = interpolate(translationY.value, [0, IMAGE_HEIGHT], [1, 0], {
      extrapolateRight: Extrapolate.CLAMP,
      extrapolateLeft: Extrapolate.CLAMP,
    });

    return {
      height,
      opacity,
    };
  }, [translationY]);

  return (
    <>
      <Animated.View
        className="bg-white rounded-xl w-full mb-4 overflow-hidden"
        entering={LightSpeedInLeft}>
        <Animated.Image
          source={{ uri: event.imageUrl }}
          className="w-full rounded-t-xl h-64"
          style={animatedCardStyles}
        />
        <View className="p-6">
          <Animated.Text
            entering={FadeInLeft}
            className="text-slate-900 text-lg font-bold">
            {event.title}
          </Animated.Text>
          <Animated.Text
            entering={FadeInLeft}
            className="text-slate-900 text-md font-light">
            {event.description}
          </Animated.Text>
          <Animated.Text
            entering={FadeInLeft}
            className="text-slate-900 text-xs font-light">
            Deadline: {new Date(event.deadline).toString()}
          </Animated.Text>
          <Animated.Text
            entering={FadeInLeft}
            className="text-slate-900 text-xs font-light">
            Donators: {event.donators.length}
          </Animated.Text>
          <View className="mt-3 w-full flex flex-row justify-between mb-2">
            <Text className="text-gray-600 text-xs">
              Collected: {event.amountCollected.toString()} ETH
            </Text>
            <Text className="text-gray-600 text-xs">
              Target: {event.target.toString()} ETH
            </Text>
          </View>
          <Progress.Bar
            animated
            progress={((event.amountCollected / event.target) * 100) / 100}
            width={null}
            borderColor="#5A5A5A"
          />
        </View>
        {!!wallet && (
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            onPress={() =>
              loadedFrom === Screens.Events
                ? setIsDonateModalVisible(true)
                : navigation?.navigate(Screens.Scan, { eventId: event.id })
            }
            className="m-4 flex bg-blue-500 py-2 rounded-xl items-center">
            <Text className="text-white">
              {loadedFrom === Screens.Events ? 'Donate' : 'Scan'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      {!!wallet && (
        <Donate
          {...{ isDonateModalVisible, setIsDonateModalVisible }}
          eventId={event.id}
          refetchEvents={refetchEvents}
        />
      )}
    </>
  );
};

export default EventCard;
