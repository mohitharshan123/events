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
const Stack = createNativeStackNavigator();

const App: React.FC<{}> = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet(), rainbowWallet()]}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="EventDetail" component={EventDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThirdwebProvider>
  );
};

export default App;
