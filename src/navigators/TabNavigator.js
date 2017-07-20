import React from 'react';
import { TabNavigator as ReactTabNavigator, createNavigationContainer, createNavigator } from 'react-navigation';
import TabView from 'react-navigation/src/views/TabView/TabView';
import NavigatorTypes from 'react-navigation/src/navigators/NavigatorTypes';
import TabRouter from '../routers/TabRouter';

const TabNavigator = (
  routeConfigs,
  config = {}
) => {

  // Use the look native to the platform by default
  const mergedConfig = { ...TabNavigator.Presets.Default, ...config };
  const {
    tabBarComponent,
    tabBarPosition,
    tabBarOptions,
    swipeEnabled,
    animationEnabled,
    lazy,
    ...tabsConfig
  } = mergedConfig;

  const router = TabRouter(routeConfigs, tabsConfig);

  const navigator = createNavigator(
    router,
    routeConfigs,
    config,
    NavigatorTypes.STACK
  )((props) => (
    <TabView
      {...props}
      tabBarComponent={tabBarComponent}
      tabBarPosition={tabBarPosition}
      tabBarOptions={tabBarOptions}
      swipeEnabled={swipeEnabled}
      animationEnabled={animationEnabled}
      lazy={lazy}
    />
  ));

  return createNavigationContainer(navigator, tabsConfig.containerOptions);
};

TabNavigator.Presets = ReactTabNavigator.Presets;

export default TabNavigator;