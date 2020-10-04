// eslint-disable-next-line no-use-before-define
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';

const LoadingSpinner = () => <ActivityIndicator style={{ flex: 1 }} size={70} animating />;

export default LoadingSpinner;
