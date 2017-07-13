import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Root from './screens/Root';


class App extends Component {
  render() {
    return (
      <Root
        onNavigationStateChange={null}
      />
    );
  }
}

AppRegistry.registerComponent('navigators', () => App);
