import React from 'react';

import { View, Pressable } from 'react-native';

import Animated from 'react-native-reanimated';
import { TAB_BAR_HEIGHT } from '../constants';

const TabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View className="absolute flex flex-row rounded-full bottom-3 bg-gray-700 mx-4">
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;
        const Icon = options.tabBarIcon;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Animated.View
            key={index}
            style={{ height: TAB_BAR_HEIGHT }}
            className="flex-1 justify-center items-center my-2 rounded">
            <Pressable
              onPress={onPress}
              className={`${
                isFocused ? 'bg-gray-800' : 'bg-gray-600'
              } rounded-full p-2`}>
              <Animated.View className="flex p-4 justify-center items-center w-full">
                <Icon key={`${index}-${isFocused}`} autoPlay={isFocused} />
              </Animated.View>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default TabBar;
