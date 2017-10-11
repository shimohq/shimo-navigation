import React from 'react';
import Header from 'react-navigation/src/views/Header/Header';

import { Platform } from 'react-native';
import HeaderStyleInterpolator from 'react-navigation/src/views/Header/HeaderStyleInterpolator';

export default class extends Header {
  _renderTitle(props, options) {
    const style = {};
    const details = this.props.getScreenDetails(props.scene);
    const { titleCenter } = details.options;

    if (Platform.OS === 'android' && !titleCenter) {
      if (!options.hasLeftComponent) {
        style.left = 0;
      }
      if (!options.hasRightComponent) {
        style.right = 0;
      }
    }

    return this._renderSubView(
      { ...props, style },
      'title',
      this._renderTitleComponent,
      HeaderStyleInterpolator.forCenter
    );
  }
}

