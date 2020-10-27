// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
// prettier-ignore
import MapView, {
  LatLng, MapEvent, Marker, MarkerAnimated,
} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import MapViewDirections from 'react-native-maps-directions';
import { FAB, Snackbar, Text } from 'react-native-paper';
import haversine from 'haversine';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapFab from '../components/MapFab';
import {
  applicationEvents,
  defaultMapLocation,
  googleMapsApiKey,
  mapDeltas,
  parsingRadix,
  theme,
  watchPositionConfig,
} from '../other/constants';
import { Spacing } from '../styles';
import LoadingSpinner from '../components/LoadingSpinner';
import { Party, SnackbarAction } from '../other/entities';
import partyConnection from '../services/partyConnection';
import PartyHub from '../components/PartyHub';
import { addScore, joinParty, setRoute } from '../other/api';
import userInfo from '../services/userInfo';
import { getMarkerColorLiteral } from '../other/library';
import { userMarkers, routeMarkers } from '../other/images';
import usersMarkers from '../services/usersMarkers';

const Map = () => {
  const [userCoordinates, setUserCoordinates] = useState(defaultMapLocation);
  const [isReady, setIsReady] = useState(false);
  const [shouldDisplayDirection, setShouldDisplayDirection] = useState(false);
  const [isRouteFabVisible, setIsRouteFabVisible] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<LatLng>();
  const [endPoint, setEndPoint] = useState<LatLng>();
  const [waypoints, setWaypoints] = useState<LatLng[]>([]);
  const [previousCoordinates, setPreviousCoordinates] = useState<LatLng>();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarVisibility, setSnackbarVisibility] = useState(false);
  const [mapFabVisibility, setMapFabVisibility] = useState(true);
  const [traveledDistance, setTraveledDistance] = useState(0);
  const [isCountingDistance, setIsCountingDistance] = useState(false);
  const [snackbarAction, setSnackbarAction] = useState<SnackbarAction>();

  const startCountingDistance = () => setIsCountingDistance(true);

  const saveScore = async () => {
    const fixedDistance = Number.parseFloat(traveledDistance.toFixed(2));
    if (fixedDistance) {
      await addScore(fixedDistance);
      setSnackbarText(`Your score of ${fixedDistance} km has been saved`);
    } else {
      setSnackbarText('Your traveled distance is too small for saving');
    }
    setIsCountingDistance(false);
    setTraveledDistance(0);
    setSnackbarAction(undefined);
    setSnackbarVisibility(true);
  };

  const showInvite = (senderLogin: string) => {
    setSnackbarText(`${senderLogin} has invited you to his party`);
    setSnackbarAction({ label: 'join', onPress: onJoinPartyButtonPressed });
    setSnackbarVisibility(true);
  };

  const handlePartyChanges = (newParty: Party) => {
    const {
      startPointLatitude,
      startPointLongitude,
      endPointLatitude,
      endPointLongitude,
    } = newParty;
    usersMarkers.resetPartyMembersMarkers();
    if (startPointLatitude && startPointLongitude) {
      setStartPoint({ latitude: startPointLatitude, longitude: startPointLongitude });
    }
    if (endPointLatitude && endPointLongitude) {
      setEndPoint({ latitude: endPointLatitude, longitude: endPointLongitude });
    }
    setWaypoints(newParty.waypoints ?? []);
    if (startPointLatitude && startPointLongitude && endPointLatitude && endPointLongitude) {
      displayRoute();
    }
  };

  const onJoinPartyButtonPressed = async () => {
    await joinParty(partyConnection.inviteId);
    await partyConnection.loadParty();
  };

  const hidePartyList = () => {
    setModalVisibility(false);
    setMapFabVisibility(true);
  };

  const showPartyList = () => {
    setModalVisibility(true);
    setMapFabVisibility(false);
  };

  const onDismissSnackbar = () => setSnackbarVisibility(false);

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
    setIsRouteFabVisible(true);
    setShouldDisplayDirection(false);
  };

  const onMapMarkerPress = (event: MapEvent<{ id: string }>) => {
    if (event.nativeEvent.id !== 'startMarker' && event.nativeEvent.id === 'teammateMarker') {
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
    oldWaypoints.splice(Number.parseInt(event.nativeEvent.id, parsingRadix), 1);
    setWaypoints([...oldWaypoints]);
  };

  const onMapReady = () => setIsMapInitialized(true);

  const dropMapRoute = () => {
    setStartPoint(undefined);
    setEndPoint(undefined);
    setWaypoints([]);
  };

  const displayRoute = () => {
    setIsRouteFabVisible(false);
    setShouldDisplayDirection(true);
  };

  const onRouteFabPress = async () => {
    await setRoute(
      partyConnection.party.id,
      waypoints,
      startPoint?.latitude,
      startPoint?.longitude,
      endPoint?.latitude,
      endPoint?.longitude,
    );
    displayRoute();
  };

  useEffect(() => {
    usersMarkers.resetPartyMembersMarkers();
    if (Platform.OS === 'android' && !Constants.isDevice) {
      return;
    }
    (async () => {
      // prettier-ignore
      applicationEvents.addListener('newInvite', showInvite);
      applicationEvents.addListener('partyChanged', handlePartyChanges);
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const userPosition = await Location.getCurrentPositionAsync({});
      setUserCoordinates(userPosition.coords);
      Location.watchPositionAsync(watchPositionConfig, (position) => {
        const { latitude, longitude } = position.coords;
        if (isCountingDistance && previousCoordinates) {
          setTraveledDistance(
            traveledDistance + haversine(previousCoordinates, { latitude, longitude }),
          );
        }
        setPreviousCoordinates({ latitude, longitude });
        usersMarkers.moveUserMarker(userInfo.id, latitude, longitude);
        partyConnection.emitUserLocationChanges(latitude, longitude);
      });
      setIsReady(true);
    })();
  }, []);

  const renderedMembersMarkers = usersMarkers.usersRegions.map((region, index) => {
    // prettier-ignore
    const {
      login, markerColor, currentLatitude, currentLongitude,
    } = partyConnection.party.users[index];
    if (currentLatitude === 0 && currentLongitude === 0) {
      return <View key={login} />;
    }
    return (
      <MarkerAnimated
        key={login}
        coordinate={region}
        icon={userMarkers[getMarkerColorLiteral(markerColor)]}
        title={login}
      />
    );
  });

  if (!isReady) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.flexContainer}>
      <MapView
        onMarkerPress={onMapMarkerPress}
        onLongPress={onMapLongPress}
        onPress={onMapPress}
        region={isMapInitialized ? undefined : { ...userCoordinates, ...mapDeltas }}
        style={styles.flexContainer}
        onMapReady={onMapReady}
      >
        {renderedMembersMarkers}
        {startPoint && (
          <Marker identifier="startMarker" coordinate={startPoint} icon={routeMarkers.start} />
        )}
        {endPoint && (
          <Marker identifier="endMarker" coordinate={endPoint} icon={routeMarkers.end} />
        )}
        {waypoints.map((marker, index) => (
          <Marker
            identifier="waypoint"
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
      <PartyHub onDismiss={hidePartyList} visibility={modalVisibility} />
      {mapFabVisibility && (
        <MapFab
          setOtherFabsVisibility={setIsRouteFabVisible}
          onDeleteButtonPress={dropMapRoute}
          onPartyButtonPress={showPartyList}
          isDistanceDisplaying={isCountingDistance}
          onDistanceButtonPress={isCountingDistance ? saveScore : startCountingDistance}
        />
      )}
      {isCountingDistance && (
        <SafeAreaView style={styles.bottomBar}>
          <View style={styles.flexContainer}>
            <Text style={styles.bottomBarHeader}>Traveled distance</Text>
            <Text style={styles.bottomBarContent}>{`${traveledDistance.toFixed(2)} km`}</Text>
          </View>
        </SafeAreaView>
      )}
      <Snackbar visible={snackbarVisibility} onDismiss={onDismissSnackbar} action={snackbarAction}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  routeFab: {
    position: 'absolute',
    margin: Spacing.base,
    right: 0,
    bottom: 70,
  },
  bottomBar: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(219,219,219,0.7)',
    padding: Spacing.large,
    flexDirection: 'row',
  },
  bottomBarHeader: {
    fontSize: 17,
    textAlign: 'center',
    color: theme.colors.accent,
  },
  bottomBarContent: {
    fontWeight: '700',
    fontSize: 18,
    marginTop: Spacing.small,
    color: theme.colors.primary,
    textAlign: 'center',
  },
});

export default Map;
