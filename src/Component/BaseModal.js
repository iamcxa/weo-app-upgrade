import {
  IconButton,
  LoadingIndicator,
  NavBar,
} from "@ublocks-react-native/component";
import { throttle } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import {
  BackHandler,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";

import { ScaledSheet, Screen } from "~/Helper";
import { navigationRef } from "~/Navigator";
import { Colors, Fonts, Metrics } from "~/Theme";

const styles = ScaledSheet.create({
  container: {
    backgroundColor: "white",
    position: "absolute",
    width: "100%",
    flex: 1,
    paddingBottom: Platform.OS === "ios" ? "30@vs" : 0,
    paddingTop: Screen.scale(32),
    bottom: 0,
    zIndex: 10,
  },
  navBar: {
    height: "44@vs",
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.shadow,
    paddingHorizontal: Metrics.baseMargin * 2,
  },
  loadingIndicatorWrapper: {
    position: "absolute",
    top: "44@vs",
    height: "88%",
    width: "100%",
    zIndex: 100,
  },
  title: {
    ...Fonts.style.regular500,
  },
  border: {
    borderTopLeftRadius: Screen.scale(8),
    borderTopRightRadius: Screen.scale(8),
    borderWidth: Screen.onePixel * 2,
    borderColor: Colors.shadow || "#00000019",
  },
  shadow: {
    shadowColor: Colors.shadow || "#00000019",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 100,
  },
  rightBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    right: Platform.select({
      ios: Metrics.baseMargin,
      android: Metrics.baseMargin * 1.5,
    }),
  },
  darkBackground: {
    top: 0,
    height: "100%",
    width: "100%",
    position: "absolute",
    flex: 1,
    // opacity: 0.1,
    backgroundColor: Colors.shadow || "#00000019",
  },
  leftStyle: {
    justifyContent: "flex-start",
    position: "absolute",
    left: Platform.select({
      ios: Metrics.baseMargin,
      android: Metrics.baseMargin * 1.5,
    }),
  },
});

class BaseModal extends React.PureComponent {
  componentDidMount() {
    // Android "Back" button trigger event listener
    if (Platform.OS === "android") {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.onAndroidBackButtonPressed
      );
    }
  }

  /**
   * You must unregister listeners when your component unmount
   */
  componentWillUnmount() {
    // Android "Back" button trigger event listener
    if (Platform.OS === "android") {
      this.backHandler.remove();
    }
  }

  handleClose = throttle(() => {
    const { onClose, closeAnimation, navigation, duration } = this.props;
    this.viewModel[closeAnimation](duration / 2).then((endState) => {
      // console.log(endState.finished ? 'bounce finished' : 'bounce cancelled');
      // return typeof onClose === 'function' ? onClose() : navigation.goBack();
    });

    this.viewBg["fadeOut"](duration / 4).then(() => {
      return typeof onClose === "function" ? onClose() : navigation.goBack();
    });
  }, 0);

  onAndroidBackButtonPressed = () => {
    const { onClose } = this.props;
    if (typeof onClose === "function") {
      onClose();
      return true;
    }
    return false;
  };

  render() {
    const {
      title,
      children,
      animation,
      maskAnimation,
      isLoading = false,
      onPressLeft,
      onPressRight,
      headerComponent,
      leftComponent,
      leftIconText,
      leftIconType,
      leftIconSize,
      leftIconColor,
      leftIconName,
      rightComponent,
      rightIconText,
      rightIconType,
      rightIconSize,
      rightIconColor,
      rightIconName,
      style,
      headerStyle,
      titleStyle,
      height,
      duration,
    } = this.props;
    return (
      <>
        <TouchableWithoutFeedback onPress={this.handleClose}>
          <Animatable.View
            ref={(ref) => (this.viewBg = ref)}
            style={styles.darkBackground}
            animation={maskAnimation}
            duration={duration}
            delay={duration}
            useNativeDriver
          />
        </TouchableWithoutFeedback>
        <Animatable.View
          ref={(ref) => (this.viewModel = ref)}
          style={[
            styles.container,
            styles.shadow,
            styles.border,
            { height },
            style,
          ]}
          animation={animation}
          duration={duration}
          useNativeDriver
        >
          {headerComponent || (
            <NavBar
              rightComponent={rightComponent}
              rightIconColor={rightIconColor}
              rightIconText={rightIconText}
              rightIconType={rightIconType}
              rightIconSize={rightIconSize}
              rightIconName={rightIconName}
              style={[styles.navBar, headerStyle]}
              title={title}
              titleStyle={[styles.title, titleStyle]}
              leftComponent={leftComponent}
              leftIconColor={leftIconColor}
              leftIconText={leftIconText}
              leftIconType={leftIconType}
              leftIconSize={leftIconSize}
              leftIconName={leftIconName}
              onPressLeft={onPressLeft}
              onPressRight={onPressRight || this.handleClose}
            />
          )}
          {children}
          {isLoading && (
            <View style={styles.loadingIndicatorWrapper}>
              <LoadingIndicator
                height="100%"
                width="100%"
                cover={false}
                open={isLoading}
              />
            </View>
          )}
        </Animatable.View>
      </>
    );
  }
}

BaseModal.propTypes = {
  title: PropTypes.string,
  animation: PropTypes.string,
  closeAnimation: PropTypes.string,
  maskAnimation: PropTypes.string,
  children: PropTypes.object,
  isLoading: PropTypes.bool,
  headerStyle: PropTypes.any,
  headerComponent: PropTypes.object,
  titleStyle: PropTypes.any,
  style: PropTypes.any,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.number,
  onClose: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  leftComponent: PropTypes.object,
  leftIconText: PropTypes.string,
  leftIconType: PropTypes.string,
  leftIconSize: PropTypes.number,
  leftIconColor: PropTypes.string,
  leftIconName: PropTypes.string,
  rightComponent: PropTypes.object,
  rightIconText: PropTypes.string,
  rightIconType: PropTypes.string,
  rightIconSize: PropTypes.number,
  rightIconColor: PropTypes.string,
  rightIconName: PropTypes.string,
};

BaseModal.defaultProps = {
  onClose: undefined,
  onPressLeft: undefined,
  onPressRight: undefined,
  animation: "slideInUp",
  closeAnimation: "slideOutDown",
  maskAnimation: "fadeIn",
  isLoading: false,
  style: {},
  height: "50%",
  duration: 400,
  headerComponent: null,
  leftComponent: null,
  leftIconText: undefined,
  leftIconType: undefined,
  leftIconSize: undefined,
  leftIconColor: undefined,
  leftIconName: undefined,
  rightComponent: null,
  rightIconText: undefined,
  rightIconType: undefined,
  rightIconSize: undefined,
  rightIconColor: undefined,
  rightIconName: undefined,
};

export default connect((state, params) => ({
  isLoading: state.appState ? state.appState.isLoading : false,
  navigation: params.navigation || navigationRef,
}))(BaseModal);
