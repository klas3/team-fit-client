// eslint-disable-next-line no-use-before-define
import React from 'react';
import { YellowBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/other/constants';
import MainNavigator from './src/routes/MainNavigator';

YellowBox.ignoreWarnings(['Require cycle:']);

const App = () => (
  <PaperProvider theme={theme}>
    <MainNavigator />
  </PaperProvider>
);

export default App;
