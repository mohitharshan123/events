import { useContract, useContractRead } from '@thirdweb-dev/react-native';
import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Lottie from 'lottie-react-native';

import EventCard from '../components/EventCard';
import { CONTRACT_ADDRESS, FUNCTIONS } from '../constants';
import { EventDetailRouteProp } from '../types';
import { buildEvent, parseEvents } from '../utils';

const EventDetail = ({
  route,
  navigation,
}: {
  route: EventDetailRouteProp;
  navigation: any;
}) => {
  const { eventId, loadedFrom } = route.params;
  const { contract } = useContract(CONTRACT_ADDRESS);

  const translationY = useSharedValue(0);

  const { data: userDonations, isLoading } = useContractRead(
    contract,
    FUNCTIONS.get_donators,
    [eventId],
  );

  const { data: events, isLoading: isEventLoading } = useContractRead(
    contract,
    FUNCTIONS.get_events,
  );

  let event = null;

  if (!isEventLoading) {
    const allEvents = parseEvents(events);
    event = allEvents.find(({ id }) => id === eventId);
  }
  const [donators, donations] = userDonations ?? [[], []];

  const scrollHandler = useAnimatedScrollHandler(
    event => {
      translationY.value = event.contentOffset.y;
    },
    [translationY],
  );

  const renderDonators = () => {
    if (!donators.length && !isLoading) {
      return (
        <View className="w-40 flex items-center justify-center flex-col h-40 px-2">
          <Lottie source={require('../lotties/nodata.json')} />
          <Text className="mt-24 text-xs">No donators</Text>
        </View>
      );
    }

    return isLoading ? (
      <Lottie source={require('../lotties/loading_2.json')} autoPlay loop />
    ) : (
      <View className="flex-1 h-full">
        <Text className="text-lg ml-4 font-bold mb-2">Donations</Text>
        <Animated.FlatList
          scrollEventThrottle={100}
          data={donators}
          onScroll={scrollHandler}
          renderItem={({ item, index }) => (
            <View className="flex flex-col m-2 bg-gray-800 rounded-md p-2">
              <Text className="text-white text-xs">{`Donator: ${item}`}</Text>
              <Text className="text-white text-xs">
                {`Donation: ${parseInt(donations[index], 16)} ETH`}
              </Text>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View className="flex w-full h-full bg-black dark:bg:black">
      {event && (
        <EventCard
          translationY={translationY}
          {...{ event, loadedFrom, navigation }}
        />
      )}

      <View className="flex-1 h-full items-center justify-center">
        {renderDonators()}
      </View>
    </View>
  );
};

export default EventDetail;
