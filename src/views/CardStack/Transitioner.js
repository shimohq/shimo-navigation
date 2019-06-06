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

  componentWillReceiveProps(nextProps) {
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

  _onTransitionEnd() {
    if (!this._isMounted) {
      return;
    }
    const prevTransitionProps = this._prevTransitionProps;
    this._prevTransitionProps = null;

    const nextState = {
      ...this.state,
      scenes: this.state.scenes.filter(isSceneNotStale),
    };

    this._transitionProps = buildTransitionProps(this.props, nextState);

    this.setState(nextState, () => {
      this.props.onTransitionEnd &&
      this.props.onTransitionEnd(this._transitionProps, prevTransitionProps);
      this._isTransitionRunning = false;
      if (this._queuedTransition) {
        this._startTransition(
          this._queuedTransition.nextProps,
          // Modified here, filter stale scene after transitionEnd.
          this._queuedTransition.nextScenes.filter(isSceneNotStale),
          this._queuedTransition.indexHasChanged
        );
        this._queuedTransition = null;
      }
    });
  }

}
