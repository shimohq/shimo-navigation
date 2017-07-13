import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import StackNavigator from '../navigators/StackNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


class Move extends Component {
  static navigationOptions = ({ navigation, status, screenProps, ...others }) => {

    const { state } = navigation;
    return {
      title: state.routeName === '/desktop/index' ? 'desktop' : `GUID: ${state.params.guid}`,
      headerRight: (
        <Button
          title="X"
          onPress={() => navigation.goBack('/move')}
        />
      )
    };
  };

  static screenKey = (routeName, params) => `${routeName}/${params.guid}`;

  render() {
    const { navigation } = this.props;
    const { guid } = navigation.state.params;

    console.log(this.props);

    return (
      <View style={styles.container}>
        <Button
          title="go to next lsit"
          onPress={() => {
          navigation.navigate('/move/list', { guid: guid + 1 })
          navigation.navigate('/move/list', { guid: guid + 1 })
          }}
        />

      </View>
    );
  }
}




export default StackNavigator({
  '/move/list': {
    screen: Move
  }
}, {
  mode: 'card'
});
