import { DefaultTheme } from 'react-native-paper';
import * as config from '../../env.json';

export const { googleMapsApiKey, serverUrl } = config;

export const jwtStorageKeyName = 'jwt';

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f51818',
    accent: '#fa6969',
    inactive: '#5c5c5c',
    backgroundAccent: '#f9f9fb',
    blue: '#50cfe6',
    textPrimary: '#24253d',
    textAccent: '#8f909b',
    backgroundPrimary: '#f5f5f5',
  },
};

export const defaultMapLocation = {
  latitude: 0,
  longitude: 0,
};

export const mapDeltas = {
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
};

export const markerMovingConfig = {
  useNativeDriver: false,
  duration: 1000,
};

export const watchPositionConfig = {
  enableHighAccuracy: true,
  distanceInterval: 2,
};

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
