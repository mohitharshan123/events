import React from 'react';
import { ConnectWallet } from '@thirdweb-dev/react-native';
import { SafeAreaView, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Events from './Events';
import Add from './Add';

const Tab = createBottomTabNavigator();

const Home: React.FC<{}> = () => {
  return (
    <SafeAreaView className="flex flex-col h-full bg-black dark:bg-black">
      <ConnectWallet />
      <Tab.Navigator
        initialRouteName="Events"
        screenOptions={{
          headerShown: false,
          tabBarInactiveBackgroundColor: 'black',
          tabBarActiveBackgroundColor: 'black',
          tabBarActiveTintColor: 'white',
          unmountOnBlur: true,
        }}>
        <Tab.Screen
          options={{
            tabBarLabel: 'All events',
            tabBarIcon: ({ color, size }) => (
              <Icon name="rocket" color={color} size={size} />
            ),
          }}
          name="Events"
          component={Events}
        />
        <Tab.Screen
          options={{
            tabBarLabel: 'New',
            tabBarIcon: ({ color, size }) => (
              <Icon name="plus-circle" color={color} size={size} />
            ),
          }}
          name="Add"
          component={Add}
        />
        <Tab.Screen
          name="My events"
          options={{
            tabBarLabel: 'My events',
            tabBarIcon: ({ color, size }) => (
              <Icon name="usd" color={color} size={size} />
            ),
          }}
          component={Events}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Home;
