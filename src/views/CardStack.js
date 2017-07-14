import React from 'react';
import { Platform, StyleSheet, View, PanResponder, I18nManager } from 'react-native';
import { Card } from 'react-navigation';
import CardStack from 'react-navigation/src/views/CardStack';
import SceneView from 'react-navigation/src/views/SceneView';
import TransitionConfigs from 'react-navigation/src/views/TransitionConfigs';
import clamp from 'clamp';

/**
 * The max duration of the card animation in milliseconds after released gesture.
 * The actual duration should be always less then that because the rest distance
 * is always less then the full distance of the layout.
 */
const ANIMATION_DURATION = 500;

/**
 * The gesture distance threshold to trigger the back behavior. For instance,
 * `1/2` means that moving greater than 1/2 of the width of the screen will
 * trigger a back action
 */
const POSITION_THRESHOLD = 1 / 2;

/**
 * The threshold (in pixels) to start the gesture action.
 */
const RESPOND_THRESHOLD = 20;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 25;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Header is physically rendered after scenes so that Header won't be
    // covered by the shadows of the scenes.
    // That said, we'd have use `flexDirection: 'column-reverse'` to move
    // Header above the scenes.
    flexDirection: 'column-reverse'
  },
  scenes: {
    flex: 1
  },
});

function isTopMostScene(scene) {
  if (scene.isActive) {
    const { route } = scene;
    if (!route.routes || route.index === 0) {
      return true;
    }
  }

  return false;
}

export default class extends CardStack {

  constructor(props) {
    super(props);

    this.state = {
      isResponding: false
    };
  }

  _renderInnerScene(SceneComponent, scene) {
    const { navigation } = this._getScreenDetails(scene);
    const { screenProps, position, progress, transitionTargets } = this.props;
    const headerMode = this._getHeaderMode();

    const [blurFrom, focusInto] = transitionTargets;

    const sceneView = (
      <SceneView
        screenProps={screenProps}
        navigation={{
          ...navigation,
          position,
          progress,
          status: {
            isActive: scene.isActive,
            isStale: scene.isStale,
            isResponding: scene.isActive ? this.state.isResponding : false,
            isFocusing: focusInto === navigation.state.key,
            isBlurring: blurFrom === navigation.state.key
          }
        }}
        component={SceneComponent}
      />
    );

    if (headerMode === 'screen') {
      return (
        <View style={styles.container}>
          <View style={styles.scenes}>
            {sceneView}
          </View>
          {this._renderHeader(scene, headerMode)}
        </View>
      );
    }
    return sceneView;
  }

  _getSceneMode(key) {
    const options = this._screenDetails[key] ? this._screenDetails[key].options : null;

    let mode = this.props.mode;
    if (options && options.mode) {
      mode = options.mode;
    }

    return mode;
  }

  /**
   * Enable specify the mode in screen options
   */
  _renderCard = (scene) => {
    const isModal = this._getSceneMode(scene.key) === 'modal';

    const { screenInterpolator } = TransitionConfigs.getTransitionConfig(
      this.props.transitionConfig,
      {},
      {},
      isModal
    );
    const style =
      screenInterpolator && screenInterpolator({ ...this.props, scene });

    const SceneComponent = this.props.router.getComponentForRouteName(
      scene.route.routeName
    );

    return (
      <Card
        {...this.props}
        key={`card_${scene.key}`}
        style={[style, this.props.cardStyle]}
        scene={scene}
      >
        {this._renderInnerScene(SceneComponent, scene)}
      </Card>
    );
  };

  render() {
    let floatingHeader = null;
    const headerMode = this._getHeaderMode();
    if (headerMode === 'float') {
      floatingHeader = this._renderHeader(this.props.scene, headerMode);
    }
    const { navigation, position, layout, scene, scenes } = this.props;
    const mode = this._getSceneMode(scene.key);
    const { index } = navigation.state;
    const isVertical = mode === 'modal';

    const responder = PanResponder.create({
      onPanResponderTerminate: () => {
        this._isResponding = false;
        this._reset(index, 0);
        this.setState({
          isResponding: false
        });
      },
      onPanResponderGrant: () => {
        position.stopAnimation((value: number) => {
          this._isResponding = true;
          this._gestureStartValue = value;
          this.setState({
            isResponding: true
          });
        });
      },
      onMoveShouldSetPanResponder: (
        event: { nativeEvent: { pageY: number, pageX: number } },
        gesture: any
      ) => {
        if (index !== scene.index) {
          return false;
        }
        const immediateIndex = this._immediateIndex == null
          ? index
          : this._immediateIndex;
        const currentDragDistance = gesture[isVertical ? 'dy' : 'dx'];
        const currentDragPosition =
          event.nativeEvent[isVertical ? 'pageY' : 'pageX'];
        const axisLength = isVertical
          ? layout.height.__getValue()
          : layout.width.__getValue();
        const axisHasBeenMeasured = !!axisLength;

        // Measure the distance from the touch to the edge of the screen
        const screenEdgeDistance = currentDragPosition - currentDragDistance;
        // Compare to the gesture distance relavant to card or modal
        const gestureResponseDistance = isVertical
          ? GESTURE_RESPONSE_DISTANCE_VERTICAL
          : GESTURE_RESPONSE_DISTANCE_HORIZONTAL;
        // GESTURE_RESPONSE_DISTANCE is about 25 or 30. Or 135 for modals
        if (screenEdgeDistance > gestureResponseDistance) {
          // Reject touches that started in the middle of the screen
          return false;
        }

        const hasDraggedEnough =
          Math.abs(currentDragDistance) > RESPOND_THRESHOLD;

        const isOnFirstCard = immediateIndex === 0;
        const shouldSetResponder =
          hasDraggedEnough && axisHasBeenMeasured && !isOnFirstCard;
        return shouldSetResponder;
      },
      onPanResponderMove: (event: any, gesture: any) => {
        // Handle the moving touches for our granted responder
        const startValue = this._gestureStartValue;
        const axis = isVertical ? 'dy' : 'dx';
        const axisDistance = isVertical
          ? layout.height.__getValue()
          : layout.width.__getValue();
        const currentValue = I18nManager.isRTL && axis === 'dx'
          ? startValue + gesture[axis] / axisDistance
          : startValue - gesture[axis] / axisDistance;
        const value = clamp(index - 1, currentValue, index);
        position.setValue(value);
      },
      onPanResponderTerminationRequest: () =>
        // Returning false will prevent other views from becoming responder while
        // the navigation view is the responder (mid-gesture)
        false,
      onPanResponderRelease: (event: any, gesture: any) => {
        if (!this._isResponding) {
          return;
        }
        this._isResponding = false;
        this.setState({
          isResponding: false
        });

        const immediateIndex = this._immediateIndex == null
          ? index
          : this._immediateIndex;

        // Calculate animate duration according to gesture speed and moved distance
        const axisDistance = isVertical
          ? layout.height.__getValue()
          : layout.width.__getValue();
        const movedDistance = gesture[isVertical ? 'moveY' : 'moveX'];
        const defaultVelocity = axisDistance / ANIMATION_DURATION;
        const gestureVelocity = gesture[isVertical ? 'vy' : 'vx'];
        const velocity = Math.max(gestureVelocity, defaultVelocity);
        const resetDuration = movedDistance / velocity;
        const goBackDuration = (axisDistance - movedDistance) / velocity;

        // To asyncronously get the current animated value, we need to run stopAnimation:
        position.stopAnimation((value: number) => {
          // If the speed of the gesture release is significant, use that as the indication
          // of intent
          if (gestureVelocity < -0.5) {
            this._reset(immediateIndex, resetDuration);
            return;
          }
          if (gestureVelocity > 0.5) {
            this._goBack(immediateIndex, goBackDuration);
            return;
          }

          // Then filter based on the distance the screen was moved. Over a third of the way swiped,
          // and the back will happen.
          if (value <= index - POSITION_THRESHOLD) {
            this._goBack(immediateIndex, goBackDuration);
          } else {
            this._reset(immediateIndex, resetDuration);
          }
        });
      },
    });

    const { options } = this._getScreenDetails(scene);

    let gesturesEnabled = false;
    // Only the top most navigator can set handlers
    if (isTopMostScene(scene)) {
      gesturesEnabled = typeof options.gesturesEnabled === 'boolean'
        ? options.gesturesEnabled
        : Platform.OS === 'ios';
    }

    const handlers = gesturesEnabled ? responder.panHandlers : {};

    return (
      <View {...handlers} style={styles.container}>
        <View style={styles.scenes}>
          {scenes.map((s: *) => this._renderCard(s))}
        </View>
        {floatingHeader}
      </View>
    );
  }
}
