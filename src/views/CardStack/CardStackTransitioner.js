import React from 'react';
import { Easing } from 'react-native';
import CardStackTransitioner from 'react-navigation/src/views/CardStack/CardStackTransitioner';
import CardStack from './CardStack';
import Transitioner from './Transitioner';
import { addNavigationHelpers } from 'react-navigation';

export default class extends CardStackTransitioner {

  render() {
    return (
      <Transitioner
        configureTransition={this.configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        style={this.props.style}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
      />
    );
  }

  configureTransition = (
    transitionProps,
    prevTransitionProps,
  ) => {
    const currentNavigationState = transitionProps.navigation.state;
    const prevNavigationState = prevTransitionProps.navigation.state;
    const shouldPerformTransition = currentNavigationState.routes[currentNavigationState.index].key !== prevNavigationState.routes[prevNavigationState.index].key;
    
    const currentScreenMode = this._getScreenMode(transitionProps);
    const prevScreenMode = this._getScreenMode(prevTransitionProps);
    const transitionMode = transitionProps.index > prevTransitionProps.index ? currentScreenMode : prevScreenMode;
    return shouldPerformTransition && transitionMode !== 'static' ? this._configureTransition(transitionProps, prevTransitionProps) : {
      duration: 0,
      easing: Easing.linear,
      useNativeDriver: true
    };
  }

  _getScreenMode(transitionProps) {
    const { navigation, scenes, index } = transitionProps;
    const scene = scenes[index];
    const screenNavigation = addNavigationHelpers({
      ...navigation,
      state: scene.route,
      index: scene.index
    });
    return this.props.router.getScreenOptions(screenNavigation, this.props.screenProps).mode;
  }

  _render = (props, prevProps) => {
    const {
      screenProps,
      headerMode,
      mode,
      router,
      cardStyle,
      transitionConfig,
      style,
    } = this.props;

    let transitionTargets = [];

    if (prevProps) {
      const prevActiveKey = prevProps.scenes[prevProps.index].key.replace(/scene_/, '');
      const currentActiveKey = props.scenes[props.index].key.replace(/scene_/, '');

      if (prevActiveKey !== currentActiveKey) {
        transitionTargets = [prevActiveKey, currentActiveKey]
      }
    }

    return (
      <CardStack
        screenProps={screenProps}
        headerMode={headerMode}
        mode={mode}
        router={router}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        style={style}
        transitionTargets={transitionTargets}
        {...props}
      />
    );
  };
}
