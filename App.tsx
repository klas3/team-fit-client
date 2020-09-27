// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MenuNavigator from './src/routes/menuTabNavigation';
import { theme } from './src/other/constants';

const App = () => (
  <PaperProvider theme={theme}>
    <MenuNavigator />
  </PaperProvider>
);

export default App;
