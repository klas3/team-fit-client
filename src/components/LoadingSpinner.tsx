// eslint-disable-next-line no-use-before-define
import React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { loadingSpinnerSize } from '../other/constants';

const LoadingSpinner = () => (
  <ActivityIndicator style={styles.flexContainer} size={loadingSpinnerSize} animating />
);

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});

export default LoadingSpinner;
