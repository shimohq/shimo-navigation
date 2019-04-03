import { TabRouter } from 'react-navigation';
import createConfigGetter from './createConfigGetter';

export default (routeConfigs, stackConfig) => {
  const router = TabRouter(routeConfigs, stackConfig);

  router.getScreenOptions = createConfigGetter(
    routeConfigs,
    stackConfig.navigationOptions
  );
  
  getStateForAction = router.getStateForAction;

  router.getStateForAction = function (action, inputState) {
    const state = getStateForAction(action, inputState);
    if (!inputState) {
        const routes = state.routes.map((route) => {
          const { routeName } = route;
          const getDefaultParams = routeConfigs[routeName].getDefaultParams;

          return {
            ...route,
            params: getDefaultParams ? {
              ...getDefaultParams(),
              ...route.params
            } : route.params
          }
        });
      return {
        ...state,
        routes
      }
    } else {
      return state;
    }
 
  }

  return router;
}
