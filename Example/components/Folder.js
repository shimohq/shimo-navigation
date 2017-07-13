import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class extends Component {
  static navigationOptions = ({ navigation: { state }, screenProps }) => {
    return {
      title: state.routeName === '/desktop/index' ? 'desktop' : `GUID: ${state.params.guid}`
    };
  };

  static screenKey = (routeName, params) => `${routeName}/${params.guid}`;

  render() {
    const { navigation } = this.props;
    const { guid } = navigation.state.params;

    return (
      <View style={styles.container}>
        <Button
          title="go to folder"
          onPress={() => navigation.navigate('/desktop/folder', { guid: guid + 1 })}
        />

        <Button
          title="go to document"
          onPress={() => navigation.navigate('/document', { guid: guid })}
        />

        <Button
          title="go to move"
          onPress={() => navigation.navigate('/move', {guid: guid })}
        />
      </View>
    );
  }
}
