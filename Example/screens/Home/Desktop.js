import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigator } from 'shimo-navigation';

const Desktop = StackNavigator({
  '/desktop/index': {
    getScreen: () => require('../../components/Folder').default
  },
  '/desktop/folder': {
    getScreen: () => require('../../components/Folder').default
  }
}, {
  initialRouteName: '/desktop/index',
  initialRouteParams: {
    guid: -1
  },
  mode: 'card'
});

Desktop.navigationOptions = {
  header: null
};

export default Desktop;