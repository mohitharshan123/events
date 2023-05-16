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
import { RootStackParamList, Screens } from './src/types';
import Scan from './src/screens/Scan';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet(), rainbowWallet()]}>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={Screens.Home}>
          <RootStack.Screen name={Screens.Home} component={Home} />
          <RootStack.Screen
            name={Screens.EventDetail}
            component={EventDetail}
          />
          <RootStack.Screen name={Screens.Scan} component={Scan} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ThirdwebProvider>
  );
};

export default App;
