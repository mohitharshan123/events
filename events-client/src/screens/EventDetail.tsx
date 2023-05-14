import { useContract, useContractRead } from '@thirdweb-dev/react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import EventCard from '../components/EventCard';
import { CONTRACT_ADDRESS, FUNCTIONS } from '../constants';
import { EventDetailRouteProp } from '../types';

const EventDetail = ({ route }: { route: EventDetailRouteProp }) => {
  const { event } = route.params;
  const { contract } = useContract(CONTRACT_ADDRESS);

  const translationY = useSharedValue(0);

  const {
    data: userDonations,
    isLoading,
    refetch,
  } = useContractRead(contract, FUNCTIONS.get_donators, [event.id]);

  const [donators, donations] = userDonations ?? [[], []];

  const scrollHandler = useAnimatedScrollHandler(
    event => {
      translationY.value = event.contentOffset.y;
    },
    [translationY],
  );

  return (
    <SafeAreaView className="flex w-full h-full bg-black dark:bg:black">
      <EventCard
        event={event}
        translationY={translationY}
        loadedFrom="eventDetail"
      />
      <View className="flex-1 h-full">
        <Text className="text-lg ml-4 font-bold mb-2">Donators</Text>
        <Animated.FlatList
          onScroll={scrollHandler}
          scrollEventThrottle={100}
          data={donators}
          renderItem={({ item, index }) => (
            <View className="flex flex-col m-2 bg-gray-800 rounded-md p-2">
              <Text className="text-white text-xs">{`Donator: ${item}`}</Text>
              <Text className="text-white text-xs">
                {`Donation: ${parseInt(donations[index], 16)} ETH`}
              </Text>
            </View>
          )}></Animated.FlatList>
      </View>
    </SafeAreaView>
  );
};

export default EventDetail;
