import { mapValues, mapKeys } from 'lodash';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Custom Scenes
import RootScreen from '~/Container/Example/RootScreen';
import ApiExampleScreen from '~/Container/Example/ApiExampleScreen';
import FcmExampleScreen from '~/Container/Example/FcmExampleScreen';

const RootStack = createNativeStackNavigator();

const getDisplayName = (comp) => comp.displayName.replace('Connect(', '').replace(')', '');

export default () => (
  <RootStack.Navigator>
    <RootStack.Screen name={getDisplayName(RootScreen)} component={RootScreen} />
    <RootStack.Screen name={getDisplayName(ApiExampleScreen)} component={ApiExampleScreen} />
    <RootStack.Screen name="FcmExampleScreen" component={FcmExampleScreen} />
  </RootStack.Navigator>
);
