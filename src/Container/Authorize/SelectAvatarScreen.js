import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Screen } from 'App/Helpers';
import { BaseModal } from 'App/Components';
import { Colors, Images } from 'App/Theme';
import { AppStateActions } from 'App/Stores';

const styles = StyleSheet.create({
  container: {
    height: Screen.verticalScale(400),
    backgroundColor: Colors.pureWhite,
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentContainer: {
    zIndex: 51,
    paddingVertical: Screen.moderateScale(20),
    paddingHorizontal: Screen.moderateScale(23),
    // paddingTop: Screen.moderateScale(62),
  },
  header: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Screen.moderateScale(10),
    height: Screen.moderateScale(60),
  },
});

@connect(
  (state) => ({
    services: state.services,
    banner: state.banner,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateLoading: AppStateActions.onLoading,
      },
      dispatch,
    ),
)
class SelectAvatarScreen extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onSelect: () => {},
    onClose: () => {},
  };

  componentDidMount() {
    Keyboard.dismiss();
  }

  renderAvatars = () => {
    const avatars = _.times(12, (num) => (
      <TouchableOpacity
        key={num}
        style={{ marginBottom: Screen.moderateScale(12) }}
        onPress={() => {
          const avatarId = num + 1;
          this.props.onSelect({
            avatarId,
            avatarSource: Images[`avatar${avatarId}`],
          });
        }}
      >
        <Image
          source={Images[`avatar${num + 1}`]}
          style={{
            width: Screen.moderateScale(77),
            height: Screen.moderateScale(83),
          }}
        />
      </TouchableOpacity>
    ));
    return <View style={styles.avatarContainer}>{avatars}</View>;
  };

  render() {
    return (
      <BaseModal height="50%" rightComponent="CANCEL" rightIconColor="black">
        <ScrollView style={{}} contentContainerStyle={styles.contentContainer}>
          {this.renderAvatars()}
        </ScrollView>
      </BaseModal>
    );
  }
}

export default SelectAvatarScreen;
