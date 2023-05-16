import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Dispatch, SetStateAction } from 'react';

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
  Scan = 'Scan',
}

export type BottomTabNavigatorParamList = {
  [Screens.Events]: undefined;
  [Screens.Add]: undefined;
  [Screens.MyEvents]: undefined;
};

export type RootStackParamList = {
  [Screens.Home]: undefined;
  [Screens.EventDetail]: { eventId: string | number; loadedFrom?: Screens };
  [Screens.Scan]: { eventId: string | number };
};

export type EventsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  Screens.EventDetail
>;

export type AddEventNavigationProp = NativeStackNavigationProp<
  BottomTabNavigatorParamList,
  Screens.Add
>;

export type EventDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  Screens.Scan
>;

export type EventDetailRouteProp = RouteProp<
  RootStackParamList,
  Screens.EventDetail
>;

export type ScanRouteProp = RouteProp<RootStackParamList, Screens.Scan>;

export type EventFormFields = {
  title: string;
  description: string;
  target: string | number;
  deadline: string;
  imageUrl: string;
};

export type EventCardProps = {
  event: EventToFund;
  translationY?: { value: number };
  loadedFrom?: Screens;
  refetchEvents?: any;
  navigation?: EventDetailNavigationProp | EventsNavigationProp;
};

export type CreateEventProp = {
  navigation: AddEventNavigationProp;
};

export type DonateComponentProps = {
  isDonateModalVisible: boolean;
  setIsDonateModalVisible: Dispatch<SetStateAction<boolean>>;
  eventId: string | number;
  refetchEvents?: any;
};
