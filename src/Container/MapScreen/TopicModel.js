import PropTypes from "prop-types";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { Button, Card, Icon, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { BaseModal } from "~/Component";
import { Permission, t } from "~/Helper";
import { CircleActions } from "~/Store/Actions";
import { Classes, Images } from "~/Theme";

class TopicModel extends React.Component {
  _mounted = false;

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    __DEV__ && console.log("@Enter TopicModel!");
    this._mounted = true;

    const { fetchGetCircleRanking } = this.props;

    fetchGetCircleRanking();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { ranking, navigation } = this.props;
    // const Card =
    return (
      <BaseModal
        title={t("mirror_device")}
        isShowBack
        height="100%"
        showLoadingIndicator={false}
        // onBackPress={this.onBackPress}
        // onCloseModal={mdnsStop}
        rightComponent={
          <Button
            type="clear"
            icon={{
              // type:'font-awesome',
              name: "close",
              size: 24,
              color: "black",
            }}
            onPress={navigation.goBack}
          />
        }
      >
        <Text>123</Text>
      </BaseModal>
    );
  }
}

TopicModel.propTypes = {};

export default connect(
  (state, params) => ({
    navigation: params.navigation,
    ranking: state.circle.ranking,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchGetCircleRanking: CircleActions.fetchGetCircleRanking,
      },
      dispatch
    )
)(TopicModel);
