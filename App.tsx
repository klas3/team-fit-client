// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/other/constants';
import MainNavigator from './src/routes/MainNavigator';

const App = () => (
  <PaperProvider theme={theme}>
    <MainNavigator />
  </PaperProvider>
);

export default App;
