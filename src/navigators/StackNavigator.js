import React from 'react';
import { createNavigator } from 'react-navigation';
import NavigatorTypes from 'react-navigation/src/navigators/NavigatorTypes';

import StackRouter from '../routers/StackRouter';
import CardStackTransitioner from '../views/CardStack/CardStackTransitioner';
import createNavigationContainer from '../createNavigationContainer';

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

  return createNavigationContainer(navigator, stackConfig.containerOptions);
};