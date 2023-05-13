import React from 'react';
import {
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
} from '@thirdweb-dev/react-native';
import { NavigationContainer } from '@react-navigation/native';

import Home from './src/screens/Home';
import EventDetail from './src/screens/EventDetail';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet(), rainbowWallet()]}>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home">
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="EventDetail" component={EventDetail} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ThirdwebProvider>
  );
};

export default App;
