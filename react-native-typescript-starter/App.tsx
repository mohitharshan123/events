import React from 'react';
import {
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
} from '@thirdweb-dev/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import Home from '../events-client/src/screens/Home';
import EventDetail from '../events-client/src/screens/EventDetail';

const Stack = createSharedElementStackNavigator();

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet(), rainbowWallet()]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="EventDetail" component={EventDetail} />
        </Stack.Navigator>{' '}
      </NavigationContainer>
    </ThirdwebProvider>
  );
};

export default App;
