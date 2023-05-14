import React from 'react';
import { useContract, useContractRead } from '@thirdweb-dev/react-native';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Lottie from 'lottie-react-native';

import { ACTIVE_OPACITY, CONTRACT_ADDRESS, FUNCTIONS } from '../constants';
import { parseEvents } from '../utils';
import EventCard from '../components/EventCard';
import { Screens, EventsNavigationProp } from '../types';

const Events = ({ navigation }: { navigation: EventsNavigationProp }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data, isLoading, refetch } = useContractRead(
    contract,
    FUNCTIONS.get_events,
  );

  const events = parseEvents(data);

  console.log(events);

  if (!data?.length && !isLoading) {
    return (
      <View className="w-full flex flex-col h-full px-2 justify-center bg-black dark:bg-black">
        <Lottie source={require('../lotties/nodata.json')} />
      </View>
    );
  }

  return (
    <View className="w-full h-full px-2 justify-center bg-black dark:bg-black">
      {isLoading ? (
        <Lottie source={require('../lotties/loading.json')} autoPlay loop />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          data={events}
          onRefresh={refetch}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <View className="flex">
              <View className="flex w-full-h-full">
                <TouchableOpacity
                  activeOpacity={ACTIVE_OPACITY}
                  onPress={() =>
                    navigation.navigate(Screens.EventDetail, { event: item })
                  }>
                  <EventCard event={item} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Events;
