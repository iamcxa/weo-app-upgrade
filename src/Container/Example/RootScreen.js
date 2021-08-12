import PropTypes from 'prop-types';
import React from 'react';
import { Button, Platform, Text, View, DevSettings, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { t, Logger as l } from '~/Helper';

import styles from './RootScreenStyle';

const Separator = () => {
  return <View style={styles.separator} />;
};

class RootScreen extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      test: __DEV__,
    };

    if (Platform.OS !== 'web') {
      DevSettings.addMenuItem('--> Show RootScreen <--', () => {
        Alert.alert('Change me at the RootScreen');
        this.props.navigation.navigate('RootScreen');
      });
    }
  }

  componentDidMount() {
    __DEV__ && l.debug('@Mount RootScreen!');
  }

  onPressOpenApiExample = () => {
    // Run the startup saga when the application is starting
    // this.props.startup();ApiExampleScreen

    this.props.navigation.navigate('ApiExampleScreen');
  };

  onPressOpenFcmExample = () => {
    // Run the startup saga when the application is starting
    // Actions.FcmExampleScreen();
    this.props.navigation.navigate('FcmExampleScreen');
  };

  render() {
    const instructions = Platform.select({
      ios: t('example.api.instructions_ios'),
      // 'Press Cmd+R to reload,\nCmd+D or shake for dev menu.',
      android: t('example.api.instructions_android'),
      // 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu.',
    });
    return (
      <View style={styles.container}>
        <View style={styles.bodyWrapper}>
          <Text style={styles.title}>{t('example.root.hello_world')}</Text>
          <Text style={styles.greeting}>{t('example.root.greeting')}</Text>
          <Text style={styles.text}>{t('example.root.description')}</Text>

          <Text style={styles.text}>{instructions}</Text>
          <View>
            <Button
              style={styles.button}
              onPress={this.onPressOpenApiExample}
              title={t('example.root.btnOpenApiExample')}
            />
            <Separator />
            <Button
              style={styles.button}
              onPress={this.onPressOpenFcmExample}
              title={t('example.root.btnOpenFcmExample')}
            />
          </View>
        </View>
      </View>
    );
  }
}

RootScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(
  (state, param) => ({
    navigation: param.navigation,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        // startup: StartupActions.startup,
      },
      dispatch,
    ),
)(RootScreen);
