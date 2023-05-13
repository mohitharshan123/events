import React from 'react';
import { View } from 'react-native';
import EventCard from '../components/EventCard';

import Animated from 'react-native-reanimated';
import { sharedElementTransition } from '../utils';

const EventDetail = ({ route }) => {
  const { event } = route.params;
  return (
    <Animated.View
      className="w-full h-full bg-black dark:bg:black"
      sharedTransitionTag="sharedTag"
      sharedTransitionStyle={sharedElementTransition}>
      <EventCard event={event} />
    </Animated.View>
  );
};

export default EventDetail;
