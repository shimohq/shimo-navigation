const reactNavigation = require('react-navigation');

module.exports = {
  // Core
  get createNavigationContainer() {
    return require('./createNavigationContainer').default;
  },
  get StateUtils() {
    return reactNavigation.StateUtils;
  },
  get addNavigationHelpers() {
    return reactNavigation.addNavigationHelpers;
  },
  get NavigationActions() {
    return reactNavigation.NavigationActions;
  },

  // Navigators
  get createNavigator() {
    return reactNavigation.createNavigator;
  },
  get StackNavigator() {
    return require('./navigators/StackNavigator').default;
  },
  get TabNavigator() {
    return require('./navigators/TabNavigator').default;
  },
  get DrawerNavigator() {
    return reactNavigation.DrawerNavigator;
  },

  // Routers
  get StackRouter() {
    return require('./routers/StackRouter').default;
  },
  get TabRouter() {
    return require('./routers/TabRouter').default;
  },

  // Views
  get Transitioner() {
    return require('./views/CardStack/Transitioner').default;
  },
  get CardStack() {
    return require('./views/CardStack/CardStack').default;
  },
  get Card() {
    return reactNavigation.Card;
  },

  // Header
  get Header() {
    return reactNavigation.Header;
  },
  get HeaderTitle() {
    return reactNavigation.HeaderTitle;
  },
  get HeaderBackButton() {
    return reactNavigation.HeaderBackButton;
  },

  // DrawerView
  get DrawerView() {
    return reactNavigation.DrawerView;
  },
  get DrawerItems() {
    return reactNavigation.DrawerItems;
  },

  // TabView
  get TabView() {
    return reactNavigation.TabView;
  },
  get TabBarTop() {
    return reactNavigation.TabBarTop;
  },
  get TabBarBottom() {
    return reactNavigation.TabBarBottom;
  },

  // HOCs
  get withNavigation() {
    return reactNavigation.withNavigation;
  },
};
