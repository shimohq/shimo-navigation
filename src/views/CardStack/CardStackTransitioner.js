import React from 'react';
import CardStackTransitioner from 'react-navigation/src/views/CardStack/CardStackTransitioner';
import CardStack from './CardStack';
import Transitioner from './Transitioner';

export default class extends CardStackTransitioner {

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        style={this.props.style}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
      />
    );
  }

  _render = (props, prevProps) => {
    const {
      screenProps,
      headerMode,
      mode,
      router,
      cardStyle,
      transitionConfig,
      style,
    } = this.props;

    let transitionTargets = [];

    if (prevProps) {
      const prevActiveKey = prevProps.scenes[prevProps.index].key.replace(/scene_/, '');
      const currentActiveKey = props.scenes[props.index].key.replace(/scene_/, '');

      if (prevActiveKey !== currentActiveKey) {
        transitionTargets = [prevActiveKey, currentActiveKey]
      }
    }

    return (
      <CardStack
        screenProps={screenProps}
        headerMode={headerMode}
        mode={mode}
        router={router}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        style={style}
        transitionTargets={transitionTargets}
        {...props}
      />
    );
  };
}
