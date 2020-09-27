// eslint-disable-next-line no-use-before-define
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Map from '../screens/Map';
import Scores from '../screens/Scores';
import Profile from '../screens/Profile';
import { theme } from '../other/constants';

const Tab = createMaterialBottomTabNavigator();

const MenuNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.inactive}
      barStyle={{ backgroundColor: theme.colors.background }}
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ focused, color }) => {
          let iconName: string;
          if (route.name === 'Scores') {
            iconName = focused ? 'ios-list-box' : 'ios-list';
          } else if (route.name === 'Profile') {
            iconName = 'md-person';
          } else {
            return <MaterialCommunityIcons name="map-outline" size={26} color={color} />;
          }
          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Scores" component={Scores} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default MenuNavigator;
