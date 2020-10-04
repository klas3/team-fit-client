// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
// prettier-ignore
import MapView, {
  AnimatedRegion, LatLng, MapEvent, Marker, MarkerAnimated,
} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { Pedometer } from 'expo-sensors';
import MapViewDirections from 'react-native-maps-directions';
import { ActivityIndicator, FAB } from 'react-native-paper';
import MapFab from '../components/MapFab';
import {
  defaultMapLocation,
  googleMapsApiKey,
  mapDeltas,
  markerMovingConfig,
  theme,
  watchPositionConfig,
} from '../other/constants';

const userLocation = new AnimatedRegion({
  ...defaultMapLocation,
  ...mapDeltas,
});

const Map = () => {
  const [userCoordinates, setUserCoordinates] = useState(defaultMapLocation);
  const [steps, setSteps] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [shouldDisplayDirection, setShouldDisplayDirection] = useState(false);
  const [isRouteFabVisible, setIsRouteFabVisible] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<LatLng>();
  const [endPoint, setEndPoint] = useState<LatLng>();
  const [waypoints, setWaypoints] = useState<LatLng[]>([]);

  // prettier-ignore
  const onMapLongPress = (event: MapEvent) => {
    setShouldDisplayDirection(false);
    if (!startPoint) {
      setStartPoint(event.nativeEvent.coordinate);
      return;
    }
    setEndPoint(event.nativeEvent.coordinate);
    setIsRouteFabVisible(true);
  };

  const onMapPress = (event: MapEvent) => {
    setWaypoints([...waypoints, event.nativeEvent.coordinate]);
  };

  const onMapMarkerPress = (event: MapEvent<{ id: string }>) => {
    if (event.nativeEvent.id === 'userMarker' || event.nativeEvent.id === 'teammateMarker') {
      return;
    }
    setShouldDisplayDirection(false);
    if (event.nativeEvent.id === 'startMarker') {
      setStartPoint(undefined);
      return;
    }
    if (event.nativeEvent.id === 'endMarker') {
      setEndPoint(undefined);
      setIsRouteFabVisible(false);
      return;
    }
    const oldWaypoints = [...waypoints];
    oldWaypoints.splice(Number.parseInt(event.nativeEvent.id, 10), 1);
    setWaypoints([...oldWaypoints]);
  };

  const onMapReady = () => setIsMapInitialized(true);

  const dropMapRoute = () => {
    setStartPoint(undefined);
    setEndPoint(undefined);
    setWaypoints([]);
  };

  const onRouteFabPress = () => {
    setIsRouteFabVisible(false);
    setShouldDisplayDirection(true);
  };

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      return;
    }
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const userPosition = await Location.getCurrentPositionAsync({});
      setUserCoordinates(userPosition.coords);
      setIsReady(true);
      userLocation.timing({ ...userPosition.coords, ...mapDeltas, ...markerMovingConfig }).start();
      Location.watchPositionAsync(watchPositionConfig, (position) => {
        userLocation.timing({ ...position.coords, ...mapDeltas, ...markerMovingConfig }).start();
      });
      Pedometer.watchStepCount((result) => {
        setSteps(result.steps);
      });
    })();
  }, []);

  if (!isReady) {
    return <ActivityIndicator size={70} style={styles.main} animating />;
  }
  return (
    <View style={styles.main}>
      <MapView
        onMarkerPress={onMapMarkerPress}
        onLongPress={onMapLongPress}
        onPress={onMapPress}
        region={isMapInitialized ? undefined : { ...userCoordinates, ...mapDeltas }}
        style={styles.main}
        onMapReady={onMapReady}
      >
        <MarkerAnimated
          identifier="userMarker"
          coordinate={userLocation}
          icon={require('../../assets/markers/user-marker.png')}
          title={`${steps}`}
        />
        {startPoint && (
          <Marker
            identifier="startMarker"
            coordinate={startPoint}
            icon={require('../../assets/markers/start-marker.png')}
          />
        )}
        {endPoint && (
          <Marker
            identifier="endMarker"
            coordinate={endPoint}
            icon={require('../../assets/markers/end-marker.png')}
          />
        )}
        {waypoints.map((marker, index) => (
          <Marker
            // TODO replace index with waypoint id
            identifier={`${index}`}
            // eslint-disable-next-line
            key={index}
            coordinate={marker}
            icon={require('../../assets/markers/waypoint-marker.png')}
          />
        ))}
        {shouldDisplayDirection && (
          <MapViewDirections
            origin={startPoint}
            destination={endPoint}
            waypoints={waypoints}
            apikey={googleMapsApiKey}
            strokeWidth={5}
            strokeColor={theme.colors.primary}
          />
        )}
      </MapView>
      {startPoint && endPoint && (
        <FAB
          theme={{ colors: { accent: 'white' } }}
          visible={isRouteFabVisible}
          color={theme.colors.accent}
          style={styles.routeFab}
          icon="run"
          onPress={onRouteFabPress}
        />
      )}
      <MapFab setOtherFabsVisibility={setIsRouteFabVisible} dropMapRoute={dropMapRoute} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  routeFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 70,
  },
});

export default Map;
