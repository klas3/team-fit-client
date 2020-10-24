// eslint-disable-next-line no-use-before-define
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MenuNavigator from './MenuNavigator';
import AccountNavigator from './AccountNavigator';

const Stack = createStackNavigator();

const mainNavigatorScreenOptions = { headerShown: false };

const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={mainNavigatorScreenOptions}>
      <Stack.Screen name="Account" component={AccountNavigator} />
      <Stack.Screen name="Main" component={MenuNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
