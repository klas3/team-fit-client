import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f51818',
    accent: '#fa6969',
    inactive: '#5c5c5c',
    background: '#f9f9fb',
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
