import { TabRouter, NavigationActions } from 'react-navigation';
import createConfigGetter from './createConfigGetter';

export default (routeConfigs, stackConfig) => {
  const router = TabRouter(routeConfigs, stackConfig);

  router.getScreenOptions = createConfigGetter(
    routeConfigs,
    stackConfig.navigationOptions
  );

  return router;
}