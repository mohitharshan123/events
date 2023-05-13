import React from 'react';
import { View } from 'react-native';

import EventCard from '../components/EventCard';
import { EventDetailRouteProp } from '../types';

const EventDetail = ({ route }: { route: EventDetailRouteProp }) => {
  const { event } = route.params;

  return (
    <View
      className="w-full h-full bg-black dark:bg:black"
      sharedTransitionTag="sharedTag">
      <EventCard event={event} />
    </View>
  );
};

export default EventDetail;
