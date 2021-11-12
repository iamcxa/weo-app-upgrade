import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { Screen } from "~/Helper";
import { BaseModal } from "~/Component";
import { Colors, Images } from "~/Theme";
import { AppStateActions } from "~/Store";

const styles = StyleSheet.create({
  container: {
    height: Screen.verticalScale(400),
    backgroundColor: Colors.pureWhite,
  },
  avatarContainer: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contentContainer: {
    zIndex: 51,
    paddingVertical: Screen.scale(20),
    paddingHorizontal: Screen.scale(23),
    // paddingTop: Screen.scale(62),
  },
  header: {
    alignSelf: "stretch",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: Screen.scale(10),
    height: Screen.scale(60),
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
      dispatch
    )
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
        style={{ marginBottom: Screen.scale(12) }}
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
            width: Screen.scale(77),
            height: Screen.scale(83),
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
