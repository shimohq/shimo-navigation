import { TabNavigator } from 'shimo-navigation';

export default TabNavigator({
  notification: {
    getScreen: () => require('./Home/Notification').default
  },
  desktop: {
    screen: require('./Home/Desktop').default
  },
  recent: {
    getScreen: () => require('./Home/Recent').default
  },
  starred: {
    getScreen: () => require('./Home/Starred').default
  }
}, {
  lazy: true,
  order: ['notification', 'desktop', 'recent', 'starred'],
  initialRouteName: 'desktop',
  tabBarOptions: {
    getScreen: '#e91e63'
  },
});
