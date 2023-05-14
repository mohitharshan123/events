import { Web3Button } from '@thirdweb-dev/react-native';
import React from 'react';
import { View, Image, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import Animated, {
  LightSpeedInLeft,
  FadeInLeft,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { CONTRACT_ADDRESS } from '../constants';

import { EventToFund } from '../types';

export const IMAGE_HEIGHT = 300;

const EventCard = ({
  event,
  translationY = undefined,
  loadedFrom = 'events',
}: {
  event: EventToFund;
  translationY?: { value: number };
  loadedFrom?: 'events' | 'eventDetail';
}) => {
  console.log((event.amountCollected / event.target) * 100);
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
          className="text-slate-900 text-md font-light">
          {event.deadline}
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
      {loadedFrom === 'eventDetail' && (
        <View className="m-4">
          <Web3Button
            theme="dark"
            contractAddress={CONTRACT_ADDRESS}
            action={contract => {}}>
            Donate
          </Web3Button>
        </View>
      )}
    </Animated.View>
  );
};

export default EventCard;
