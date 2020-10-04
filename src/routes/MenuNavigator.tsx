// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BackHandler } from 'react-native';
import Map from '../screens/Map';
import Scores from '../screens/Scores';
import Profile from '../screens/Profile';
import { theme } from '../other/constants';
import Friends from '../screens/Friends';

const Tab = createMaterialBottomTabNavigator();

const MenuNavigator = () => {
  const onBackPress = () => true;

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  return (
    <Tab.Navigator
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.inactive}
      barStyle={{ backgroundColor: theme.colors.backgroundAccent }}
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color }) => {
          let iconName: string;
          if (route.name === 'Profile') {
            iconName = 'account';
          } else if (route.name === 'Map') {
            iconName = 'map-outline';
          } else if (route.name === 'Friends') {
            iconName = 'account-multiple';
          } else {
            iconName = 'format-list-bulleted';
          }
          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Scores" component={Scores} />
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default MenuNavigator;
