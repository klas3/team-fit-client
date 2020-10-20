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
import { FAB, Snackbar } from 'react-native-paper';
import MapFab from '../components/MapFab';
import {
  defaultMapLocation,
  googleMapsApiKey,
  mapDeltas,
  markerMovingConfig,
  theme,
  watchPositionConfig,
} from '../other/constants';
import { Spacing } from '../styles';
import LoadingSpinner from '../components/LoadingSpinner';
import { Party, PartyInvite } from '../other/entities';
import partyConnection, { eventEmitter } from '../other/partyConnection';
import PartyList from '../components/PartyList';
import { joinParty } from '../other/api';
import userInfo from '../other/userInfo';
import { getMarkerColorLiteral } from '../other/library';
import { userMarkers, routeMarkers } from '../other/images';

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
  const [travelCoordinates, setTravelCoordinates] = useState<[number, number][]>([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [party, setParty] = useState<Party>(partyConnection.party);
  const [snackbarText, setSnackbarText] = useState('');
  const [invitePartyId, setInvitePartyId] = useState('');
  const [snackbarVisibility, setSnackbarVisibility] = useState(false);
  const [mapFabVisibility, setMapFabVisibility] = useState(true);

  const userMarker = userMarkers[getMarkerColorLiteral(userInfo.markerColor)];

  const showInvite = (invite: PartyInvite) => {
    const { partyId, senderLogin } = invite;
    setSnackbarText(`${senderLogin} has invited you to his party`);
    setInvitePartyId(partyId);
    setSnackbarVisibility(true);
  };

  eventEmitter.addListener('newInvite', showInvite);
  eventEmitter.addListener('partyChanged', (newParty: Party) => setParty(newParty));

  const getSnackbarAction = () => ({
    label: 'join',
    onPress: async () => {
      await joinParty(invitePartyId);
      await partyConnection.loadParty();
    },
  });

  const hidePartyList = () => {
    setModalVisibility(false);
    setMapFabVisibility(true);
  };

  const showPartyList = () => {
    setModalVisibility(true);
    setMapFabVisibility(false);
  };

  const onDismissSnackbar = () => setSnackbarVisibility(false);

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
        const { latitude, longitude } = position.coords;
        setTravelCoordinates(travelCoordinates.concat([[latitude, longitude]]));
        userLocation.timing({ ...position.coords, ...mapDeltas, ...markerMovingConfig }).start();
      });
      Pedometer.watchStepCount((result) => {
        setSteps(result.steps);
      });
      partyConnection.registerConnection();
      await partyConnection.loadParty();
      setParty(partyConnection.party);
    })();
  }, []);

  if (!isReady) {
    return <LoadingSpinner />;
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
          icon={userMarker}
          title={`${steps}`}
        />
        {startPoint && (
          <Marker identifier="startMarker" coordinate={startPoint} icon={routeMarkers.start} />
        )}
        {endPoint && (
          <Marker identifier="endMarker" coordinate={endPoint} icon={routeMarkers.end} />
        )}
        {waypoints.map((marker, index) => (
          <Marker
            // TODO replace index with waypoint id
            identifier={`${index}`}
            // eslint-disable-next-line
            key={index}
            coordinate={marker}
            icon={routeMarkers.waypoint}
          />
        ))}
        {shouldDisplayDirection && (
          <MapViewDirections
            origin={startPoint}
            destination={endPoint}
            waypoints={waypoints}
            apikey={googleMapsApiKey}
            strokeWidth={Spacing.smallest}
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
      {party && <PartyList onDismiss={hidePartyList} visibility={modalVisibility} party={party} />}
      {mapFabVisibility && (
        <MapFab
          setOtherFabsVisibility={setIsRouteFabVisible}
          onDeleteButtonPress={dropMapRoute}
          onPartyButtonnPress={showPartyList}
        />
      )}
      <Snackbar
        visible={snackbarVisibility}
        onDismiss={onDismissSnackbar}
        action={getSnackbarAction()}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  routeFab: {
    position: 'absolute',
    margin: Spacing.base,
    right: 0,
    bottom: 70,
  },
});

export default Map;
