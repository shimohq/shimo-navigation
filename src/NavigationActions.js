const NavigationActions = require('react-navigation').NavigationActions;


const REMOVE = 'Navigation/REMOVE';
const REPLACE = 'Navigation/REPLACE';

const createAction = (type) => (payload) => ({
  type,
  ...payload,
});

const remove = createAction(REMOVE);
const replace = createAction(REPLACE);

export default {
  ...NavigationActions,
  REMOVE,
  remove,
  REPLACE,
  replace
}
