import { EventToFund } from './types';

import { SharedTransition, withSpring } from 'react-native-reanimated';

const SPRING_CONFIG = {
  mass: 1,
  stiffness: 100,
  damping: 200,
};

export const parseEvents = (events: Array<any>): Array<EventToFund> =>
  events?.map((event, index) => ({
    id: index,
    title: event[1],
    description: event[2],
    target: event[3],
    deadline: new Date(parseInt(event[4], 16)).toString(),
    amountCollected: event[5],
    imageUrl: event[6],
    donators: event[7].toString(),
    donations: event[4].toString(),
    refunded: event[9],
  }));

export const sharedElementTransition = SharedTransition.custom(values => {
  ('worklet');
  return {
    height: withSpring(values.targetHeight, SPRING_CONFIG),
    width: withSpring(values.targetWidth, SPRING_CONFIG),
    originX: withSpring(values.targetGlobalOriginX, SPRING_CONFIG),
    originY: withSpring(values.targetGlobalOriginY, SPRING_CONFIG),
  };
});
