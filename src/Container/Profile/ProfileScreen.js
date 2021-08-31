import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import { Classes, Images } from '~/Theme';
import { translate as t } from '~/Helpers/I18n';
import { MainNavBar, AvatarBlock, AndroidBackKey } from '~/Component';
import DrawerContent from './DrawerContent';
import styles from './ProfileScreenStyle';

class ProfileScreen extends React.Component {
  static propTypes = {
    routeName: PropTypes.string.isRequired,
    sceneKey: PropTypes.string.isRequired,
    // user data
    memberHash: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    memberId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatarKey: PropTypes.string.isRequired,
  };

  static defaultProps = {
    nickname: 'Author',
  };

  render() {
    const { sceneKey, nickname, avatarKey } = this.props;
    return (
      <View style={Classes.fill}>
        <MainNavBar
          title={t('profile_nav_bar_title')}
          leftComponent="cancel"
          style={styles.navBar}
        />
        <AndroidBackKey sceneKey={sceneKey} backTo={Actions.hereYouAre} />
        <View style={styles.content}>
          <View style={styles.header}>
            <AvatarBlock
              name={nickname}
              avatar={Images[avatarKey ? avatarKey.toLowerCase() : 'avatar1']}
              onPress={Actions.ProfileUpdateScreen}
              editMode
            />
            <View style={styles.horizontalLine} />
          </View>

          <DrawerContent />
        </View>
      </View>
    );
  }
}

export default connect(
  (state, prams) => ({
    routeName: state.appRoute.routeName,
    sceneKey: prams.name,
    // user data
    memberHash: state.user.profile.hash,
    nickname: state.user.profile.nickname,
    memberId: state.user.profile.memberId,
    username: state.user.profile.username,
    avatarKey: state.user.profile.avatarKey,

    customLocale: state.appConfig.customLocale,
  }),
  (dispatch) => bindActionCreators({}, dispatch),
)(ProfileScreen);
