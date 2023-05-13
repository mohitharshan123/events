import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type EventToFund = {
  id: string | number;
  title: string;
  description: string;
  target: number;
  deadline: string;
  amountCollected: number;
  imageUrl: string;
  donators: string;
  donations: string;
  refunded: string;
};

export enum Screens {
  Events = 'Events',
  MyEvents = 'MyEvents',
  EventDetail = 'EventDetail',
  Home = 'Home',
  Add = 'Add',
}

export type BottomTabNavigatorParamList = {
  [Screens.Events]: undefined;
  [Screens.Add]: undefined;
  [Screens.MyEvents]: undefined;
};

export type RootStackParamList = {
  [Screens.Home]: undefined;
  [Screens.EventDetail]: { event: EventToFund };
};

export type EventsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  Screens.EventDetail
>;

export type AddEventNavigationProp = NativeStackNavigationProp<
  BottomTabNavigatorParamList,
  Screens.Add
>;

export type EventDetailRouteProp = RouteProp<
  RootStackParamList,
  Screens.EventDetail
>;

export type EventFormFields = {
  title: string;
  description: string;
  target: string | number;
  deadline: string;
  imageUrl: string;
};
