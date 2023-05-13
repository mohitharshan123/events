import React from 'react';
import { useContract, useContractRead } from '@thirdweb-dev/react-native';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import Lottie from 'lottie-react-native';
import Animated from 'react-native-reanimated';

import { CONTRACT_ADDRESS, FUNCTIONS } from '../constants';
import { parseEvents, sharedElementTransition } from '../utils';
import EventCard from '../components/EventCard';

const Events = ({ navigation }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data, isLoading, refetch } = useContractRead(
    contract,
    FUNCTIONS.get_events,
  );

  const events = parseEvents(data);

  console.log(events?.length);

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
              <Animated.View
                className="flex w-full-h-full"
                sharedTransitionStyle={sharedElementTransition}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('EventDetail', { event: item })
                  }>
                  <EventCard event={item} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Events;
