import React from 'react';
import { ConnectWallet } from '@thirdweb-dev/react-native';
import { SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BottomTabNavigatorParamList } from '../types';
import { Screens } from '../types';
import { TABS } from '../constants';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const Home = () => {
  return (
    <SafeAreaView className="flex flex-col h-full bg-black dark:bg-black">
      <ConnectWallet />
      <Tab.Navigator
        initialRouteName={Screens.Events}
        screenOptions={{
          headerShown: false,
          tabBarInactiveBackgroundColor: 'black',
          tabBarActiveBackgroundColor: 'black',
          tabBarActiveTintColor: 'white',
          unmountOnBlur: true,
        }}>
        {TABS.map(({ label, TabIcon, name, Component }) => (
          <Tab.Screen
            key={name}
            options={{
              tabBarLabel: label,
              tabBarIcon: props => <TabIcon {...props} />,
            }}
            name={name as keyof BottomTabNavigatorParamList}
            component={Component}
          />
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Home;
