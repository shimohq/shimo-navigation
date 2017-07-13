import React from 'react';
import { createNavigator, createNavigationContainer } from 'react-navigation';
import NavigatorTypes from 'react-navigation/src/navigators/NavigatorTypes';

import StackRouter from './StackRouter';
import CardStackTransitioner from './views/CardStackTransitioner';

export default (
  routeConfigMap,
  stackConfig = {}
) => {
  const {
    initialRouteName,
    initialRouteParams,
    paths,
    headerMode,
    mode,
    cardStyle,
    transitionConfig,
    onTransitionStart,
    onTransitionEnd,
    navigationOptions,
  } = stackConfig;
  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };

  const router = StackRouter(routeConfigMap, stackRouterConfig);

  const navigator = createNavigator(
    router,
    routeConfigMap,
    stackConfig,
    NavigatorTypes.STACK
  )((props) => {
    return (
      <CardStackTransitioner
        {...props}
        headerMode={headerMode}
        mode={mode}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        onTransitionStart={onTransitionStart}
        onTransitionEnd={onTransitionEnd}
      />
    )
  });

  const NavigationContainer = createNavigationContainer(navigator, stackConfig.containerOptions);

  return class extends NavigationContainer {
    _nav = null;

    // dispatch synchronously
    dispatch = (action) => {
      if (!this._isStateful()) {
        return false;
      }

      if (!this._nav) {
        this._nav = this.state.nav;
      }

      const nav = navigator.router.getStateForAction(action, this._nav);

      if (nav && nav !== this._nav) {
        this.setState({ nav }, () =>
          this._onNavigationStateChange(this._nav, nav, action)
        );
        this._nav = nav;
        return true;
      }
      return false;
    };
  };
};