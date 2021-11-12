import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Actions } from "react-native-router-flux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import Icon from "react-native-vector-icons/FontAwesome";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import Colors from "~/Theme/Colors";
import Images from "~/Theme/Images";
import PropTypes from "prop-types";
import { Screen } from "~/Helper";
import NotifyBox from "./NotifyBox";
import { DefaultText } from "../widget/Label";

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? Screen.scale(64) : Screen.scale(54),
    flexDirection: "row",
    // paddingTop: (Platform.OS === 'ios') ? Screen.scale(20) : 0,
    // marginTop: (Platform.OS === 'ios') ? Screen.scale(-20) : 0,
    // backgroundColor: Colors.black,
    borderBottomColor: Colors.silver,
    borderBottomWidth: Screen.onePixel,
  },
  drawerContainer: {
    height: Platform.OS === "ios" ? Screen.scale(112) : Screen.scale(102),
    paddingTop: Platform.OS === "ios" ? Screen.scale(20) : 0,
    // backgroundColor: 'transparent',
    borderBottomColor: Colors.silver,
    borderBottomWidth: Screen.onePixel,
  },
  navBarItem: {
    flex: 1,
    justifyContent: "center",
    // alignItems: 'center',
  },
});

@connect(
  (state) => ({
    routes: state.appRoute,
  }),
  (dispatch) => bindActionCreators({}, dispatch)
)
class CustomNavBar extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  _renderLeft() {
    if (this.props.backTitle) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (this.props.onBack) {
              this.props.onBack();
            } else {
              Actions.pop();
            }
          }}
          style={[styles.navBarItem, { paddingLeft: 10 }]}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: this.props.textColor || Colors.whiteThree,
              fontSize: 8.5 * 2,
            }}
          >
            {this.props.backTitle}{" "}
          </Text>
        </TouchableOpacity>
      );
    }
    if (this.props.renderLeftButton) {
      return (
        <View
          style={[
            styles.navBarItem,
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            },
          ]}
        >
          {this.props.renderLeftButton()}
        </View>
      );
    }
    if (this.props.tabs || this.props.cancel) {
      return <View style={[styles.navBarItem, { paddingLeft: 10 }]} />;
    }
    if (this.props.drawer) {
      return (
        <TouchableOpacity
          hitSlop={{
            left: 15,
            right: 15,
          }}
          onPress={() => {
            if (this.props.scene.drawer == "DrawerClose") {
              Actions.drawerOpen();
            } else {
              Actions.drawerClose();
            }
          }}
          style={[
            styles.navBarItem,
            { paddingLeft: 10, flexDirection: "row", alignItems: "center" },
          ]}
        >
          {/* <Icon size={35} color={Colors.whiteThree} name="navicon" /> */}
          <Image
            source={Images.menu}
            style={{
              height: Screen.scale(17),
              width: Screen.scale(19),
            }}
          />
          <NotifyBox
            amount={0}
            color={Colors.pink}
            animated="pop"
            top={8}
            left={-3}
            max={99}
            small
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => Actions.pop()}
        style={[styles.navBarItem, { paddingLeft: 10 }]}
      >
        <Icon
          size={35}
          color={this.props.textColor || Colors.whiteThree}
          name="angle-left"
        />
      </TouchableOpacity>
    );
  }

  _renderMiddle() {
    return (
      <View style={[styles.navBarItem, { flex: 3, alignItems: "center" }]}>
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={{
            color: this.props.textColor || Colors.whiteThree,
            fontSize: Screen.scale(8.5 * 2),
            fontWeight: "600",
          }}
        >
          {this.props.title}
        </Text>
      </View>
    );
  }

  _renderRight() {
    if (this.props.rightTitle && this.props.onRight) {
      return (
        <View
          style={[
            styles.navBarItem,
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            onPress={this.props.onRight}
            style={{ paddingRight: 10 }}
          >
            <Text
              allowFontScaling={false}
              style={{
                color: this.props.textColor || Colors.whiteThree,
                fontSize: Screen.scale(8.5 * 2),
              }}
            >
              {this.props.rightTitle}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.props.renderRightButton) {
      return (
        <View
          style={[
            styles.navBarItem,
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            },
          ]}
        >
          {this.props.renderRightButton()}
        </View>
      );
    }
    if (this.props.cancel) {
      return (
        <TouchableOpacity
          onPress={this.props.onRight || (() => Actions.pop())}
          style={[
            styles.navBarItem,
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: 10,
            },
          ]}
        >
          <IoniconsIcon
            size={Screen.scale(30)}
            color={Colors.whiteThree}
            name="md-close"
          />
        </TouchableOpacity>
      );
    }
    return (
      <View
        style={[
          styles.navBarItem,
          { flexDirection: "row", justifyContent: "flex-end" },
        ]}
      >
        <Text />
      </View>
    );
  }

  _renderDrawerTitle = () => {
    if (_.isString(this.props.title)) {
      return (
        <DefaultText
          style={{
            fontSize: 34,
            color: "#fff",
            paddingLeft: 10,
            fontWeight: Platform.OS === "ios" ? "600" : "300",
          }}
        >
          {this.props.title}
        </DefaultText>
      );
    }
    return this.props.title;
  };

  render() {
    // console.log("nav", this.props);
    const dinamicStyle = {
      backgroundColor: this.props.navColor || Colors.mainYellow,
      borderBottomWidth: this.props.hideNavBorderBottom ? 0 : Screen.onePixel,
    };
    if (this.props.hideNavBar) {
      return null;
      // } else if (this.props.drawer) {
      //   return (
      //     <View style={[styles.drawerContainer, dinamicStyle ]}>
      //       <View style={{ flex: 1, flexDirection: 'row' }}>
      //         { this._renderLeft() }
      //         <View />
      //         { this._renderRight() }
      //       </View>
      //       <View style={{ flex: 1, flexDirection: 'row' }}>
      //         {this._renderDrawerTitle()}
      //       </View>
      //     </View>
      //   )
    }
    return (
      <View style={[styles.container, dinamicStyle]}>
        {this._renderLeft()}
        {this._renderMiddle()}
        {this._renderRight()}
      </View>
    );
  }
}

export default CustomNavBar;
