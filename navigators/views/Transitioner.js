import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Transitioner } from 'react-navigation';


const styles = StyleSheet.create({
  main: {
    flex: 1
  }
});


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

    if (!shouldPerformTransition) {
      progress.setValue(0);

      this._prevTransitionProps = this._transitionProps;
      this._transitionProps = buildTransitionProps(nextProps, nextState);

      // replace state without performing transition.
      nextState.scenes = nextState.scenes.filter(isSceneNotStale);

      this.setState(nextState, () => {
        position.setValue(nextNavigationState.index);
        progress.setValue(1);
      });
    } else {
      super._startTransition(nextProps, nextScenes, indexHasChanged);
    }
  }

}
