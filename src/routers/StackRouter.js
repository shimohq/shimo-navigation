import { StackRouter, NavigationActions } from 'react-navigation';
import createConfigGetter from './createConfigGetter';

function getScreenKey(router, routeName, params) {
  const RouteComponent = router.getComponentForRouteName(routeName);
  const { screenKey } = RouteComponent;
  let key = routeName;
  if (screenKey) {
    key = typeof screenKey === 'function' ? screenKey(routeName, params) : screenKey;
  }

  return key;
}

export default (routeConfigs, stackConfig) => {
  const router = StackRouter(routeConfigs, stackConfig);

  const originGetStateForAction = router.getStateForAction;
  router.getStateForAction = (passedAction, state) => {
    // Prevent route key conflicts.
    if (state && routeConfigs[passedAction.routeName] && (
        passedAction.type === NavigationActions.NAVIGATE
      )) {
      const key = getScreenKey(router, passedAction.routeName, passedAction.params);
      if (state.routes.some((route) => route.key === key)) {
        if (passedAction.params) {
          return router.getStateForAction(NavigationActions.setParams({
            key,
            params: passedAction.params
          }), state);
        } else {
          return {
            ...state
          };
        }
      }
    } else if (state && passedAction.type === NavigationActions.RESET) {
      const keys = {};
      const actions = [];
      let counter = 0;
      passedAction.actions.forEach((route, index) => {
        const key = getScreenKey(router, route.routeName, route.params);
        if (!keys.hasOwnProperty(key)) {
          keys[key] = counter;
          actions.push(route);
          counter++;
        }

        if (passedAction.index === index) {
          passedAction.index = keys[key];
        }
      });
      passedAction.actions = actions;
    }

    const result = originGetStateForAction(passedAction, state);

    // Override route key.
    if (result !== state) {
      return {
        ...result,
        routes: result.routes.map((route) => {
          return {
            ...route,
            key: getScreenKey(router, route.routeName, route.params)
          };
        })
      };
    } else {
      return state;
    }
  };

  router.getScreenOptions = createConfigGetter(
    routeConfigs,
    stackConfig.navigationOptions
  );

  return router;
};
