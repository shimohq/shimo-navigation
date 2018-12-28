const NavigationActions = require('react-navigation').NavigationActions;


const REMOVE = 'Navigation/REMOVE';

const createAction = (type) => (payload) => ({
  type,
  ...payload,
});

const remove = createAction(REMOVE);

export default {
  ...NavigationActions,
  REMOVE,
  remove
}
