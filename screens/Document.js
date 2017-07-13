import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class extends Component {
  static navigationOptions = {
    mode: 'card',
    gesturesEnabled: false
  };

  render() {

    return (
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <Text>Document</Text>
      </View>
    );
  }
}
