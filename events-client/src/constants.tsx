import Lottie from 'lottie-react-native';
import React from 'react';

import Add from './screens/Add';
import Events from './screens/Events';
import { Screens } from './types';

export const CONTRACT_ADDRESS: string =
  '0x7b5eeb87CC676697749F1d56bC005Bba1138b724';

export const FUNCTIONS = {
  get_events: 'getEvents',
  create_event: 'createEvent',
  get_my_events: 'getMyEvents',
  get_donators: 'getDonators',
  donate_to_event: 'donateToEvent',
  is_donator: 'isDonator',
  get_event: 'events',
};

export const ACTIVE_OPACITY = 0.8;
export const TAB_BAR_HEIGHT = 50;
export const EVENT_FORM_INITIAL_VALUES = {
  title: '',
  description: '',
  target: '',
  deadline: '',
  imageUrl: '',
};

export const TABS = [
  {
    label: 'All Events',
    TabIcon: (props: any) => (
      <Lottie source={require('./lotties/events.json')} {...props} />
    ),
    name: Screens.Events,
    Component: Events,
  },
  {
    label: 'Add',
    TabIcon: (props: any) => (
      <Lottie source={require('./lotties/add.json')} {...props} />
    ),
    name: Screens.Add,
    Component: Add,
  },
  {
    label: 'My Events',
    TabIcon: (props: any) => (
      <Lottie source={require('./lotties/my_events.json')} {...props} />
    ),
    name: Screens.MyEvents,
    Component: (props: any) => (
      <Events loadedFrom={Screens.MyEvents} {...props} />
    ),
  },
];
