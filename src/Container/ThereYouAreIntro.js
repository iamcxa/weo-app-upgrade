import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { Alert, Text, View, StyleSheet, SafeAreaView } from 'react-native';

import { MainNavBar, IconButton } from '~/Component';
import { translate as t } from '~/Helpers/I18n';
import { Screen, Dialog } from '~/Helper';
import { Colors } from '~/Theme';

// import { setItem } from '../utils/asyncStorage';
import { PrimaryBtn } from '../widget/RoundButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Screen.moderateScale(10),
    paddingBottom: Screen.moderateScale(49),
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: Screen.moderateScale(30),
    paddingBottom: Screen.moderateScale(49),
    paddingTop: Screen.moderateScale(55),
  },
  titleWrapper: {
    // height: 20,
    // borderBottomWidth: Screen.moderateScale(11),
    // borderColor: Colors.mainYellow
  },
  title: {
    fontSize: Screen.moderateScale(24),
    fontWeight: '800',
    color: Colors.greyishBrown,
    // textDecorationLine: 'underline',
    // textDecorationColor: Colors.mainYellow
  },
  desc: {
    marginTop: Screen.moderateScale(40),
    fontSize: Screen.moderateScale(16),
    lineHeight: parseInt(Screen.moderateScale(21), 10),
    width: Screen.moderateScale(260),
    color: Colors.black,
  },
});

class ThereYouAreIntro extends React.Component {
  static propTypes = {
    userCircle: PropTypes.object.isRequired,
  };

  static defaultProps = {
    userCircle: {},
  };

  confirm = () => {
    const { userCircle } = this.props;
    if (userCircle.id) {
      Dialog.choseHomeCircleAlert(userCircle);
    } else {
      Alert.alert(t('there_you_are_intro_alert_not_in_circle'));
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MainNavBar
          leftComponent={
            <IconButton iconName="md-close" iconType="Ionicons" onPress={Actions.hereYouAre} />
          }
        />
        <View style={styles.content}>
          <View>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>{t('there_you_are_intro_title')}</Text>
            </View>
            <Text style={styles.desc} numberOfLines={15}>
              {t('there_you_are_intro_description')}
            </Text>
          </View>
          <PrimaryBtn onPress={this.confirm} text={t('there_you_are_intro_chose_now_circle')} />
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    routeName: state.appRoute.routeName,
    userCircle: state.circle.userCircle,
  }),
  (dispatch) => bindActionCreators({}, dispatch),
)(ThereYouAreIntro);
