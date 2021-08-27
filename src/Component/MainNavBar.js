import React from "react";
import PropTypes from "prop-types";
import {
  ViewPropTypes,
  SafeAreaView,
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Actions } from "react-native-router-flux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Colors, Images, Metrics } from "App/Theme";
import { Screen } from "App/Helpers";
import { BaseIconButton, BaseButton } from "App/Components";

const hitSlop = {
  top: 8,
  left: 8,
  right: 8,
  bottom: 8,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // paddingHorizontal: Screen.scale(16),
    paddingTop: 0,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        minHeight: Metrics.navBarHeight + Screen.verticalScale(16),
        maxHeight: Metrics.navBarHeight + Screen.verticalScale(72),
      },
      android: {
        minHeight: Metrics.navBarHeight,
      },
    }),
    // maxHeight: Metrics.navBarHeight + Screen.verticalScale(72),
    width: "100%",
  },
  title: {
    fontSize: Screen.scale(18),
    fontWeight: "600",
    letterSpacing: -0.43,
    color: Colors.black,
    // lineHeight: parseInt(Screen.scale(24), 10),
  },
  navButton: {
    paddingHorizontal: Screen.scale(16),
    marginHorizontal: 0,
    width: "auto",
    zIndex: 100,
  },
  centerBlock: {
    flex: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height:
      Platform.OS === "ios"
        ? "100%"
        : Metrics.navBarHeight + Screen.verticalScale(16),
    maxHeight: Metrics.navBarHeight + Screen.verticalScale(72),
  },
  leftBlock: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: Screen.scale(16),
  },
  rightBlock: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: Screen.scale(16),
  },
  icon: {
    // padding: Screen.scale(3),
  },
});

@connect(
  (state) => ({
    routes: state.appRoute,
    scene: state.appRoute.scene,
    loading: state.loading,
  }),
  (dispatch) => bindActionCreators({}, dispatch)
)
class MainNavBar extends React.PureComponent {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    numberOfLines: PropTypes.number,
    leftComponent: PropTypes.any,
    rightComponent: PropTypes.any,
    titleComponent: PropTypes.any,
    rightOnPress: PropTypes.func,
    leftOnPress: PropTypes.func,
    title: PropTypes.string,
    style: ViewPropTypes.style,
    titleStyle: Text.propTypes.style,
  };

  static defaultProps = {
    title: "",
    leftComponent: "BACK",
    rightComponent: null,
    titleComponent: null,
    rightOnPress: undefined,
    leftOnPress: undefined,
    numberOfLines: 1,
    style: {},
    titleStyle: {},
  };

  onMenuPress = () => {
    const {
      routes: {
        scene: { drawer },
      },
    } = this.props;
    if (drawer === "DrawerClose") {
      Actions.drawerOpen();
    } else {
      Actions.drawerClose();
    }
  };

  renderLeftComponent = (leftComponent, onPress) => {
    const {
      leftIconName,
      leftIconType,
      leftIconSize,
      leftIconColor,
      leftIconText,
    } = this.props;
    if (typeof leftComponent === "string") {
      switch (leftComponent.toLocaleLowerCase()) {
        case "back":
          return this.renderLeftBack(onPress);
        case "drawer":
          return this.renderDrawerIcon();
        case "voice":
          return this.renderDrawerIcon();
        case "cancel":
          return (
            <BaseIconButton
              onPress={onPress || (() => Actions.pop())}
              style={styles.navButton}
              iconName="md-close"
              iconType={leftIconType}
              iconSize={leftIconSize}
              iconColor={leftIconColor}
            />
          );
        default:
          return null;
      }
    }
    return leftComponent;
  };

  renderRightComponent = (rightComponent, onPress) => {
    if (typeof rightComponent === "string") {
      switch (rightComponent.toLocaleLowerCase()) {
        case "next":
          return this.renderRightBack(onPress);
        default:
          return null;
      }
    }
    return rightComponent;
  };

  renderLeftBack = (onPress) => (
    <BaseButton
      style={styles.navButton}
      onPress={() => (onPress ? onPress() : Actions.pop())}
      hitSlop={hitSlop}
      transparent
    >
      <Image source={Images.navBackLeft} style={styles.icon} />
    </BaseButton>
  );

  renderRightBack = (onPress) => (
    <BaseButton
      style={styles.navButton}
      onPress={() => requestAnimationFrame(onPress || (() => Actions.pop()))}
      hitSlop={hitSlop}
      transparent
    >
      <Image source={Images.navBackRight} style={styles.icon} />
    </BaseButton>
  );

  renderDrawerIcon = () => (
    <BaseButton
      style={styles.navButton}
      onPress={() => requestAnimationFrame(Actions.tabVoiceView)}
      hitSlop={hitSlop}
      transparent
    >
      <Image source={Images.hamburger} style={styles.icon} />
    </BaseButton>
  );

  renderVoiceViewButton = () => (
    <BaseButton
      style={styles.navButton}
      onPress={() => requestAnimationFrame(Actions.tabVoiceView)}
      hitSlop={hitSlop}
      transparent
    >
      <Icon name="md-mic" size={26} />
    </BaseButton>
  );

  render() {
    const {
      titleComponent,
      rightComponent,
      leftComponent,
      rightOnPress,
      leftOnPress,
      titleStyle,
    } = this.props;

    return (
      <SafeAreaView
        style={[
          styles.container,
          this.props.style,
          this.props.title.length <= 13 && {
            height: Metrics.navBarHeight,
            marginBottom: 0,
          },
        ]}
      >
        <View style={styles.leftBlock}>
          {this.renderLeftComponent(leftComponent, leftOnPress)}
        </View>
        <View style={styles.centerBlock}>
          {titleComponent || (
            <Text
              numberOfLines={this.props.numberOfLines}
              style={[styles.title, titleStyle]}
            >
              {this.props.title}
            </Text>
          )}
        </View>
        <View style={styles.rightBlock}>
          {this.renderRightComponent(rightComponent, rightOnPress)}
        </View>
      </SafeAreaView>
    );
  }
}

export default MainNavBar;
