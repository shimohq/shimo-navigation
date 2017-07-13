import { StackNavigator } from 'shimo-navigation';

export default StackNavigator({
  '/': {
    getScreen: () => require('./Home').default
  },
  '/move': {
    getScreen: () => require('./Move').default
  },
  '/document': {
    getScreen: () => require('./Document').default,
    path: 'document/:guid'
  },
  '/settings': {
    getScreen: () => require('./Settings').default
  }
}, {
  headerMode: 'screen',
  initialRouteName: '/',
  mode: 'modal'
});