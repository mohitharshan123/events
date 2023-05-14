import React from 'react';

import { View, Pressable } from 'react-native';

const TabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View className="absolute flex flex-row rounded-full bottom-3 bg-gray-700 mx-4">
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const Icon = options?.tabBarIcon;
        const isFocused = state.index === index;

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
          <View
            key={index}
            className="flex-1 justify-center items-center my-2 rounded">
            <Pressable
              onPress={onPress}
              className={`${
                isFocused ? 'bg-gray-800' : 'bg-gray-600'
              } rounded-full w-12`}>
              <View className="flex p-4 justify-center items-center w-full">
                <Icon route={label} isFocused={isFocused} />
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default TabBar;
