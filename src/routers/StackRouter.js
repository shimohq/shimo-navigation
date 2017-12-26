import { StackRouter, NavigationActions } from 'react-navigation';
import createConfigGetter from './createConfigGetter';
import getScreenForRouteName from 'react-navigation/src/routers/getScreenForRouteName';
import StateUtils from 'react-navigation/src/StateUtils';

export default (routeConfigs, stackConfig) => {
  const router = StackRouter(routeConfigs, stackConfig);

  const childRouters = {};
  const routeNames = Object.keys(routeConfigs);

  // Loop through routes and find child routers
  routeNames.forEach((routeName) => {
    const screen = getScreenForRouteName(routeConfigs, routeName);
    if (screen && screen.router) {
      // If it has a router it's a navigator.
      childRouters[routeName] = screen.router;
    } else {
      // If it doesn't have router it's an ordinary React component.
      childRouters[routeName] = null;
    }
  });
  const initialRouteName = stackConfig.initialRouteName || routeNames[0];
  const { initialRouteParams } = stackConfig;
  const initialChildRouter = childRouters[initialRouteName];

  function getScreenKey(routeName, params) {
    const routeConfig = routeConfigs[routeName];
    let key = routeName;
    if (routeConfig) {
      let screen = routeConfig.screen;
      if (!screen && typeof routeConfig.getScreen === 'function') {
        screen = routeConfig.getScreen();
      }
      const screenKey = screen ? screen.screenKey : null;
      if (screenKey) {
        key = typeof screenKey === 'function' ? screenKey(routeName, params) : screenKey;
      }
    }

    return key;
  }

  router.getStateForAction = (passedAction, state) => {
    const action = NavigationActions.mapDeprecatedActionAndWarn(passedAction);

    // Set up the initial state if needed
    if (!state) {
      let route = {};
      if (
        action.type === NavigationActions.NAVIGATE &&
        childRouters[action.routeName] !== undefined
      ) {
        return {
          index: 0,
          routes: [
            {
              ...action,
              type: undefined,
              key: getScreenKey(action.routeName, action.params),
            },
          ],
        };
      }
      if (initialChildRouter) {
        route = initialChildRouter.getStateForAction(
          NavigationActions.navigate({
            routeName: initialRouteName,
            params: initialRouteParams,
          })
        );
      }
      const params = (route.params ||
        action.params ||
        initialRouteParams) && {
          ...(route.params || {}),
          ...(action.params || {}),
          ...(initialRouteParams || {}),
        };
      route = {
        ...route,
        routeName: initialRouteName,
        ...(params ? { params } : {}),
      };
      route.key = getScreenKey(route.routeName, route.params);
      // eslint-disable-next-line no-param-reassign
      state = {
        index: 0,
        routes: [route],
      };
    }

    // Check if a child scene wants to handle the action as long as it is not a reset to the root stack
    if (action.type !== NavigationActions.RESET || action.key !== null) {
      let keyIndex = action.key
        ? StateUtils.indexOf(state, action.key)
        : -1;

      const childIndex = keyIndex >= 0 ? keyIndex : state.index;
      const childRoute = state.routes[childIndex];
      const childRouter = childRouters[childRoute.routeName];
      if (childRouter) {
        const route = childRouter.getStateForAction(action, childRoute);
        if (route === null) {
          return state;
        }
        if (route && route !== childRoute) {
          return StateUtils.replaceAt(state, childRoute.key, route);
        }
      }
    }

    // Handle explicit push navigation action
    if (
      action.type === NavigationActions.NAVIGATE &&
      childRouters[action.routeName] !== undefined
    ) {
      const childRouter = childRouters[action.routeName];
      let route;
      if (childRouter) {
        const childAction =
          action.action || NavigationActions.init({ params: action.params });
        route = {
          params: action.params,
          ...childRouter.getStateForAction(childAction),
          routeName: action.routeName,
        };
      } else {
        route = {
          params: action.params,
          routeName: action.routeName,
        };
      }
      let key = getScreenKey(route.routeName, route.params);
      route.key = key;
      const index = StateUtils.indexOf(state, key);
      if (index !== -1) {
        if (route.routeName === initialRouteName && initialRouteParams && !index) {
          route.params = {
            ...initialRouteParams,
            ...route.params
          };
        }

        return StateUtils.replaceAt(state, key, route);
      } else {
        return StateUtils.push(state, route);
      }
    }

    // Handle navigation to other child routers that are not yet pushed
    if (action.type === NavigationActions.NAVIGATE) {
      const childRouterNames = Object.keys(childRouters);
      for (let i = 0; i < childRouterNames.length; i++) {
        const childRouterName = childRouterNames[i];
        const childRouter = childRouters[childRouterName];
        if (childRouter) {
          // For each child router, start with a blank state
          const initChildRoute = childRouter.getStateForAction(
            NavigationActions.init()
          );
          // Then check to see if the router handles our navigate action
          const navigatedChildRoute = childRouter.getStateForAction(
            action,
            initChildRoute
          );
          let routeToPush = null;
          if (navigatedChildRoute === null) {
            // Push the route if the router has 'handled' the action and returned null
            routeToPush = initChildRoute;
          } else if (navigatedChildRoute !== initChildRoute) {
            // Push the route if the state has changed in response to this navigation
            routeToPush = navigatedChildRoute;
          }
          if (routeToPush) {
            let route = {
              ...routeToPush,
              routeName: childRouterName
            };
            const key = getScreenKey(route.routeName, route.params);
            route.key = key;
            const index = StateUtils.indexOf(state, key);
            if (index !== -1) {
              if (route.routeName === initialRouteName && initialRouteParams && !index) {
                route.params = {
                  ...initialRouteParams,
                  ...route.params
                };
              }
              return StateUtils.replaceAt(state, key, route);
            } else {
              return StateUtils.push(state, route);
            }
          }
        }
      }
    }

    if (action.type === NavigationActions.SET_PARAMS) {
      const lastRoute = state.routes.find(
        /* $FlowFixMe */
        (route) => route.key === action.key
      );
      if (lastRoute) {
        const params = {
          ...lastRoute.params,
          ...action.params,
        };
        const routes = [...state.routes];
        routes[state.routes.indexOf(lastRoute)] = {
          ...lastRoute,
          params,
        };
        return {
          ...state,
          routes,
        };
      }
    }

    if (action.type === NavigationActions.RESET) {
      const resetAction = action;

      return {
        ...state,
        routes: resetAction.actions.map(
          (childAction) => {
            const childRouter = childRouters[childAction.routeName];
            if (childRouter) {
              const route = {
                ...childAction,
                ...childRouter.getStateForAction(childAction),
                routeName: childAction.routeName
              };
              route.key = getScreenKey(route.routeName, route.params);
              return route;
            }
            const route = {
              ...childAction,
              key: getScreenKey(childAction.routeName, childAction.params)
            };
            delete route.type;
            return route;
          }
        ),
        index: action.index,
      };
    }

    if (action.type === NavigationActions.BACK) {
      let backRouteIndex = null;
      if (action.key) {
        const backRoute = state.routes.find(
          /* $FlowFixMe */
          (route) => route.key === action.key
        );
        /* $FlowFixMe */
        backRouteIndex = state.routes.indexOf(backRoute);
      }
      if (backRouteIndex == null) {
        return StateUtils.pop(state);
      }
      if (backRouteIndex > 0) {
        return {
          ...state,
          routes: state.routes.slice(0, backRouteIndex),
          index: backRouteIndex - 1,
        };
      }
    }
    return state;
  };

  router.getScreenOptions = createConfigGetter(
    routeConfigs,
    stackConfig.navigationOptions
  );

  return router;
};
