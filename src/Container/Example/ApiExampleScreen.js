import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, Button, Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { translate as t } from '~/Helper/I18n';
import { ExampleActions } from '~/Store/Actions';
import { ExampleSelectors } from '~/Store/Selectors';
import { Classes, Colors, Fonts, Images } from '~/Theme';

import Style from './ApiExampleScreenStyle';

/**
 * This is an example of a container component.
 *
 * This screen displays a little help message and information about a fake user.
 * Feel free to remove it.
 */

class ApiExampleScreen extends React.Component {
  componentDidMount() {
    __DEV__ && console.log('@Mount ApiExampleScreen!');
  }

  render() {
    const { userErrorMessage, user, liveInEurope, fetchUser, createPost, userIsLoading } =
      this.props;
    return (
      <View style={Style.container}>
        <View>
          <View style={Style.logoContainer}>
            <Image style={Style.logo} source={Images.logo} resizeMode="contain" />
          </View>
          <Text style={Style.text}>{t('example.api.title')}</Text>
          {userErrorMessage ? (
            <Text style={Style.error}>{userErrorMessage}</Text>
          ) : (
            <View style={Classes.center}>
              <Text style={Fonts.style.regular}>
                {
                  t('example.api.username')
                  // "I'm a fake user, my name is "
                }
                {user.name}
              </Text>
              <Text style={Fonts.style.regular}>
                {
                  liveInEurope
                    ? t('example.api.live_in_eu') // 'I live in Europe !'
                    : t('example.api.not_live_in_eu') // "I don't live in Europe."
                }
              </Text>
            </View>
          )}
          <Button onPress={fetchUser} title={t('example.api.refresh')} />
          <Button onPress={createPost} title={t('example.api.create')} />
        </View>
        <ActivityIndicator size="large" color={Colors.primary} animating={userIsLoading} />
      </View>
    );
  }
}

ApiExampleScreen.propTypes = {
  user: PropTypes.object,
  userIsLoading: PropTypes.bool,
  userErrorMessage: PropTypes.string,
  fetchUser: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  liveInEurope: PropTypes.bool.isRequired,
};

ApiExampleScreen.defaultProps = {
  user: {},
  userIsLoading: false,
  userErrorMessage: '',
};

export default connect(
  (state) => ({
    user: state.example.user,
    userIsLoading: state.example.userIsLoading,
    userErrorMessage: state.example.userErrorMessage,
    liveInEurope: ExampleSelectors.liveInEurope(state),
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchUser: ExampleActions.fetchUser,
        createPost: ExampleActions.createPost,
      },
      dispatch,
    ),
)(ApiExampleScreen);
