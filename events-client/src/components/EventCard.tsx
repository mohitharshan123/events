import React from 'react';
import { View, Image, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import Animated, {
  LightSpeedInLeft,
  FadeInLeft,
} from 'react-native-reanimated';

import { EventToFund } from '../types';
import { toEther } from '../utils';

const EventCard = ({ event }: { event: EventToFund }) => (
  <Animated.View
    className="bg-white rounded-xl w-full mb-4"
    entering={LightSpeedInLeft}>
    <Image
      source={{ uri: event.imageUrl }}
      className="w-full h-64 rounded-t-xl"
      resizeMode="cover"
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
        Donators: {event.donators.length}
      </Animated.Text>
      <View className="mt-3 w-full flex flex-row justify-between mb-2">
        <Text className="text-gray-600 text-xs">
          Collected: {toEther(event.amountCollected)} ETH
        </Text>
        <Text className="text-gray-600 text-xs">
          Target: {toEther(event.target)} ETH
        </Text>
      </View>
      <Progress.Bar
        progress={(event.amountCollected / event.target) * event.target}
        width={null}
        borderColor="#5A5A5A"
      />
    </View>
  </Animated.View>
);

export default EventCard;
