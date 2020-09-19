// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1,
  },
});

const defaultMapLocation = {
  latitude: 0,
  longitude: 0,
};

const mapDeltas = {
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
};

const markerMovingConfig = {
  useNativeDriver: false,
  duration: 1000,
};

const userLocation = new AnimatedRegion({
  latitude: 0,
  longitude: 0,
  ...mapDeltas,
});

export default function App() {
  const [mapLocation, setMapLocation] = useState(defaultMapLocation);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if ((Platform.OS === 'android' && !Constants.isDevice) || isReady) {
      return;
    }
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const userPosition = await Location.getCurrentPositionAsync({});
      setIsReady(true);
      setMapLocation(userPosition.coords);
      userLocation.timing({ ...userPosition.coords, ...mapDeltas, ...markerMovingConfig }).start();
      Location.watchPositionAsync({ enableHighAccuracy: true, distanceInterval: 2 }, (position) => {
        userLocation.timing({ ...position.coords, ...mapDeltas, ...markerMovingConfig }).start();
      });
    })();
  });

  return (
    <MapView region={{ ...mapLocation, ...mapDeltas }} style={styles.mapStyle}>
      <MarkerAnimated
        coordinate={userLocation}
        icon={require('./assets/user-marker.png')}
        title="You"
      />
    </MapView>
  );
}
