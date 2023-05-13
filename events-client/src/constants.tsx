import Icon from 'react-native-vector-icons/FontAwesome';

import Add from './screens/Add';
import Events from './screens/Events';
import { Screens } from './types';

export const CONTRACT_ADDRESS: string =
  '0x4089B524fF4bEb3ABD338D2fBddC4f204C6A0807';

export const FUNCTIONS = {
  get_events: 'getEvents',
  create_event: 'createEvent',
};

export const ACTIVE_OPACITY = 0.8;

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
    TabIcon: (props: any) => <Icon name="rocket" {...props} />,
    name: Screens.Events,
    Component: Events,
  },
  {
    label: 'Add',
    TabIcon: (props: any) => <Icon name="plus-circle" {...props} />,
    name: Screens.Add,
    Component: Add,
  },
  {
    label: 'My Events',
    TabIcon: (props: any) => <Icon name="usd" {...props} />,
    name: Screens.MyEvents,
    Component: Events,
  },
];
