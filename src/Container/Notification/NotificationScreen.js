import React from "react";
import PropTypes from "prop-types";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { isEqual, isEmpty, throttle } from "lodash";
import { FlatList, RefreshControl, Text, View } from "react-native";

import {
  ListSeparator,
  NotifyCard,
  MainNavBar,
  AndroidBackKey,
} from "App/Components";
import { Config } from "App/Config";
import { NotificationActions } from "App/Stores";
import { translate as t } from "App/Helpers/I18n";
import { Notification, StyleSheet } from "App/Helpers";
import { Colors, Classes, Fonts } from "App/Theme";

const { ON_END_REACHED_THROTTLE } = Config;

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: Colors.pureWhite,
  },
  listContent: {},
  emptyListTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: "16@s",
    flex: 1,
  },
  emptyListText: {
    textAlign: "center",
    color: Colors.steel,
    fontSize: Fonts.size.regular,
  },
  txtNotEnableNotificationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  txtNotEnableNotification: {
    textAlign: "center",
    color: Colors.steel,
    fontSize: Fonts.size.medium,
  },
});

class NotificationScreen extends React.Component {
  static propTypes = {
    sceneKey: PropTypes.string.isRequired,
    routeName: PropTypes.string.isRequired,
    fcmToken: PropTypes.string,

    byId: PropTypes.object.isRequired,
    allIds: PropTypes.array.isRequired,
    paging: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    userCircle: PropTypes.object,
    homeCircle: PropTypes.object,
    config: PropTypes.object.isRequired,

    fetchGetNotifications: PropTypes.func.isRequired,
    fetchSetNotificationRead: PropTypes.func.isRequired,
    updateNotificationByKey: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userCircle: null,
    homeCircle: null,
    fcmToken: "",
  };

  state = {
    curPage: 1,
    perPage: 50,
    sort: "DESC",
  };

  componentDidMount() {
    setTimeout(() => {
      this.handleRefresh();
    }, 3000);

    // setTimeout(async () => {
    //   const badgeCount = await firebase.notifications().getBadge();
    //   if (badgeCount > 0) {
    //     await firebase.notifications().setBadge(0);
    //   }
    // }, 60);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { routeName } = this.props;
    if (
      nextProps.routeName !== routeName &&
      nextProps.sceneKey.includes(nextProps.routeName)
    ) {
      this.handleRefresh();
    }
    return (
      nextProps.sceneKey.includes(nextProps.routeName) &&
      (!isEqual(this.state, nextState) || !isEqual(this.props, nextProps))
    );
  }

  onNotifyPress = (id) => async () => {
    const { fetchSetNotificationRead, updateNotificationByKey, byId } =
      this.props;

    // check is this notification already read.
    if (!byId[id].isRead) {
      // reduce notification badge when an item is clicked.
      const badgeCount = await firebase.notifications().getBadge();
      if (badgeCount > 0) {
        await firebase.notifications().setBadge(badgeCount - 1);
      }

      // set clicked notification to read
      updateNotificationByKey({
        key: id,
        data: {
          ...byId[id],
          isRead: true,
        },
      });
      fetchSetNotificationRead(id);
    }

    // jump to target page
    return Notification.jumpToScreen(byId[id]);
  };

  handleRefresh = (
    {
      sort = this.state.sort,
      curPage = this.state.curPage,
      perPage = this.state.perPage,
    } = this.state
  ) => {
    const { fetchGetNotifications, fcmToken } = this.props;
    if (!isEmpty(fcmToken)) {
      fetchGetNotifications({
        sort,
        curPage,
        perPage,
      });
      this.setState({
        sort,
        curPage,
      });
    }
  };

  handleListReachEnd = throttle(() => {
    const { paging, isFetching } = this.props;
    const { curPage, perPage, sort } = this.state;
    if (!isFetching && curPage > 0 && paging.lastPage > curPage) {
      this.handleRefresh({
        sort,
        perPage,
        curPage: curPage + 1,
      });
    }
  }, ON_END_REACHED_THROTTLE);

  renderItem = ({ item: id }) => {
    const { byId } = this.props;
    return (
      <NotifyCard
        title={byId[id].title}
        time={byId[id].createdAt}
        desc={byId[id].message}
        onPress={this.onNotifyPress(id)}
        isRead={byId[id].isRead}
      />
    );
  };

  render() {
    const { isFetching, allIds, fcmToken, sceneKey } = this.props;
    return (
      <View style={Classes.fill}>
        <AndroidBackKey sceneKey={sceneKey} backTo={Actions.hereYouAre} />
        <MainNavBar
          title={t("notify_list_nav_bar_title")}
          leftComponent={null}
          style={styles.navBar}
        />
        <FlatList
          style={{
            backgroundColor: Colors.paleGrey,
          }}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
          data={allIds}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={this.handleListReachEnd}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={this.handleRefresh}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyListTextWrapper}>
              <Text style={styles.emptyListText}>{t("notify_list_empty")}</Text>
            </View>
          }
          ListFooterComponent={
            isEmpty(fcmToken) && (
              <View style={styles.txtNotEnableNotificationWrapper}>
                <Text style={styles.txtNotEnableNotification}>
                  {t("notify_list_empty_cuz_disabled_notification")}
                </Text>
              </View>
            )
          }
        />
      </View>
    );
  }
}

export default connect(
  (state, props) => ({
    sceneKey: props.name,
    routeName: state.appRoute.routeName,
    userCircle: state.circle.userCircle,
    homeCircle: state.circle.homeCircle,
    allIds: state.notification.allIds,
    byId: state.notification.byId,
    paging: state.notification.paging,
    isFetching: state.notification.isFetching,
    config: state.user.config,
    fcmToken: state.user.fcmToken,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchGetNotifications: NotificationActions.fetchGetNotifications,
        fetchSetNotificationRead: NotificationActions.fetchSetNotificationRead,
        updateNotificationByKey: NotificationActions.updateNotificationByKey,
      },
      dispatch
    )
)(NotificationScreen);
