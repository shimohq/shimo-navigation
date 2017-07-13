import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import StackNavigator from './navigators/StackNavigator';


const Root = StackNavigator({
  '/': {
    getScreen: () => require('./screens/Home').default
  },
  '/move': {
    getScreen: () => require('./screens/Move').default
  },
  '/document': {
    getScreen: () => require('./screens/Document').default,
    path: 'document/:guid'
  },
  '/settings': {
    getScreen: () => require('./screens/Settings').default
  }
}, {
  headerMode: 'none',
  initialRouteName: '/',
  mode: 'modal'
});


AppRegistry.registerComponent('navigators', () => Root);
