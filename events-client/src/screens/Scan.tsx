import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Lottie from 'lottie-react-native';
import { useContract } from '@thirdweb-dev/react-native';

import { ScanRouteProp } from '../types';
import { CONTRACT_ADDRESS, FUNCTIONS } from '../constants';

const Scan: React.FC<{ route: ScanRouteProp }> = ({ route }) => {
  const { eventId } = route.params;
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [isScanned, setIsScanned] = useState(false);
  const [isDonator, setIsDonator] = useState(false);
  const { contract } = useContract(CONTRACT_ADDRESS);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
    return () => setIsScanned(false);
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    const scannedAddress = data.split(':')[1];
    const isDonator = await contract?.call(FUNCTIONS.is_donator, [
      eventId,
      scannedAddress,
    ]);
    setIsScanned(true);
    setIsDonator(isDonator);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <BarCodeScanner
        onBarCodeScanned={isScanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {isScanned && (
        <>
          <Button
            className="absolute top-4"
            title="Tap to scan again"
            onPress={() => setIsScanned(false)}
          />
          <View className="h-40 w-40 left-20 absolute bottom-10">
            {isDonator ? (
              <Lottie
                source={require('../lotties/approve.json')}
                autoPlay
                loop
              />
            ) : (
              <Lottie
                source={require('../lotties/reject.json')}
                autoPlay
                loop
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default Scan;
