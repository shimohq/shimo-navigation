import { Transitioner } from 'react-navigation';

import NavigationScenesReducer from '../ScenesReducer';


function buildTransitionProps(props, state) {
  const { navigation } = props;

  const { layout, position, progress, scenes } = state;

  const scene = scenes.find(isSceneActive);

  return {
    layout,
    navigation,
    position,
    progress,
    scenes,
    scene,
    index: scene.index,
  };
}

function isSceneActive(scene) {
  return scene.isActive;
}

function isSceneNotStale(scene) {
  return !scene.isStale;
}

export default class extends Transitioner {

  componentWillReceiveProps(nextProps): void {
    const nextScenes = NavigationScenesReducer(
      this.state.scenes,
      nextProps.navigation.state,
      this.props.navigation.state
    );


    if (nextScenes === this.state.scenes) {
      return;
    }

    const indexHasChanged =
      nextProps.navigation.state.index !== this.props.navigation.state.index;
    if (this._isTransitionRunning) {
      this._queuedTransition = { nextProps, nextScenes, indexHasChanged };
      return;
    }


    this._startTransition(nextProps, nextScenes, indexHasChanged);
  }
  
  _startTransition(nextProps, nextScenes, indexHasChanged) {
    const nextState = {
      ...this.state,
      scenes: nextScenes
    };

    const { position, progress } = nextState;
    const currentNavigationState = this.props.navigation.state;
    const nextNavigationState = nextProps.navigation.state;
    const shouldPerformTransition = currentNavigationState.routes[currentNavigationState.index].key !== nextNavigationState.routes[nextNavigationState.index].key;

    /**
     * disable reset transition if active card is not changed.
     */

    if (!shouldPerformTransition && !this._isTransitionRunning) {
      progress.setValue(0);

      this._prevTransitionProps = this._transitionProps;
      this._transitionProps = buildTransitionProps(nextProps, nextState);

      // replace state without performing transition.
      nextState.scenes = nextState.scenes.filter(isSceneNotStale);

      this.setState(nextState, () => {
        position.setValue(nextNavigationState.index);
        progress.setValue(1);
        this._queuedTransition = null;
        this._onTransitionEnd();
      });
    } else {
      super._startTransition(nextProps, nextScenes, indexHasChanged);
    }
  }

}
