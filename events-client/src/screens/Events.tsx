import React from 'react';
import {
  useAddress,
  useContract,
  useContractRead,
} from '@thirdweb-dev/react-native';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import Lottie from 'lottie-react-native';

import {
  ACTIVE_OPACITY,
  CONTRACT_ADDRESS,
  FUNCTIONS,
  TAB_BAR_HEIGHT,
} from '../constants';
import { parseEvents } from '../utils';
import EventCard from '../components/EventCard';
import { Screens, EventsNavigationProp } from '../types';
import { useWallet } from '@thirdweb-dev/react-native';

const Events = ({
  navigation,
  loadedFrom = Screens.Events,
}: {
  navigation: EventsNavigationProp;
  loadedFrom: Screens;
}) => {
  const wallet = useWallet();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const user = useAddress();
  const {
    data: allEvents,
    isLoading: isAllEventsLoading,
    refetch,
  } = useContractRead(contract, FUNCTIONS.get_events);

  const { data: myEvents, isLoading: isMyEventsLoading } = useContractRead(
    contract,
    FUNCTIONS.get_my_events,
    [user],
  );

  const events =
    loadedFrom === Screens.Events
      ? parseEvents(allEvents)
      : parseEvents(myEvents);

  const isLoading =
    loadedFrom === Screens.Events ? isAllEventsLoading : isMyEventsLoading;

  if (!wallet && loadedFrom === Screens.MyEvents) {
    return (
      <View className="h-full flex justify-center items-center bg-black dark:bg-black p-4">
        <Text className="font-bold text-lg">Please connect your wallet</Text>
      </View>
    );
  }

  if (!events?.length && !isLoading) {
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
          className="flex-1"
          data={events}
          contentContainerStyle={{
            marginTop: 20,
            paddingBottom: TAB_BAR_HEIGHT + 40,
          }}
          onRefresh={refetch}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <View className="flex">
              <View className="flex w-full">
                <TouchableOpacity
                  activeOpacity={ACTIVE_OPACITY}
                  onPress={() =>
                    navigation.navigate(Screens.EventDetail, {
                      eventId: item.id,
                      loadedFrom,
                    })
                  }>
                  <EventCard
                    event={item}
                    refetchEvents={refetch}
                    loadedFrom={loadedFrom}
                    navigation={navigation}
                  />
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
