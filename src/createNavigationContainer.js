import { createNavigationContainer } from 'react-navigation';

export default function(Component) {
  const NavigationContainer = createNavigationContainer(Component);

  return class extends NavigationContainer {
    _nav = null;

    // dispatch synchronously
    dispatch = (action) => {
      if (!this._isStateful()) {
        return false;
      }

      if (!this._nav) {
        this._nav = this.state.nav;
      }

      const nav = Component.router.getStateForAction(action, this._nav);

      if (nav && nav !== this._nav) {
        this.setState({ nav }, () =>
          this._onNavigationStateChange(this._nav, nav, action)
        );
        this._nav = nav;
        return true;
      }
      return false;
    };
  };
}
