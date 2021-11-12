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

class RankingModel extends React.Component {
  _mounted = false;

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    __DEV__ && console.log("@Enter RankingModel!");
    this._mounted = true;

    const { fetchGetCircleRanking } = this.props;

    fetchGetCircleRanking();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <ListItem
        bottomDivider
        onPress={() => navigation.navigate("TopicModel", item)}
      >
        {item.ranking === 1 ? (
          <Images.SvgBtnRanking />
        ) : (
          <Text>{item.ranking}</Text>
        )}

        <ListItem.Content
        // style={[Classes.fillRow, Classes.mainStart]}
        >
          <ListItem.Title>
            {item.isInside ? (
              <Images.SvgMapPinYellow />
            ) : (
              <Images.SvgMapPinGray />
            )}
            {item.name}
          </ListItem.Title>
        </ListItem.Content>

        <Button
          // style={{ right: 0, top: 0 }}
          type="clear"
          icon={
            item.isSubscribed ? (
              <Images.SvgBtnFavYellow />
            ) : (
              <Images.SvgBtnFavGrey />
            )
          }
        />

        <Button
          // style={{ right: 0, top: 0 }}
          type="clear"
          icon={<Images.SvgBtnMore />}
        />
        {/* <ListItem.Chevron type="font-awesome" name="ellipsis-v" /> */}
      </ListItem>
    );
  };

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
        <FlatList
          keyExtractor={this.keyExtractor}
          data={ranking}
          renderItem={this.renderItem}
          contentContainerStyle={[Classes.padding]}
        />
      </BaseModal>
    );
  }
}

RankingModel.propTypes = {};

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
)(RankingModel);
