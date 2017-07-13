import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <Text>Settings</Text>
      </View>
    );
  }
}
