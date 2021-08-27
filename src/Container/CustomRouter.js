import React, { Component } from 'react';
import {
  Router,
  Reducer,
  Scene,
  ActionConst,
  Actions,
  // Drawer,
  Lightbox,
  Stack,
} from 'react-native-router-flux';
import { connect } from 'react-redux';

class CustomRouter extends Component {
  onStateChange = (data) => {
    // console.log('onStateChange data=>', data);
  };

  reducerCreate = (params) => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  };

  render() {
    return (
      <Router
        onStateChange={this.onStateChange}
        createReducer={this.reducerCreate}
        {...this.props}
        sceneStyle={{
          flex: 1,
          backgroundColor: 'transparent',
          shadowColor: null,
          shadowOffset: null,
          shadowOpacity: null,
          shadowRadius: null,
        }}
      />
    );
  }
}

export default connect()(CustomRouter);
