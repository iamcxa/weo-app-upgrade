import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  Platform,
  PixelRatio,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import InputBox from "../Containers/SandBox/node_modules/App/Components/InputBox";
import Colors from "../Containers/PeekTopicList/node_modules/App/Theme/Colors";
import { Screen } from "~/Helper";
import { H3, DefaultText } from "./Label";

const styles = StyleSheet.create({
  primary: {
    borderBottomColor: Colors.black,
    marginBottom: 0,
  },
  sub: {
    // paddingBottom: 5,
    // borderBottomWidth: Screen.onePixel * 2,
  },
  listContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.silver,
    borderBottomWidth: Screen.onePixel,
    paddingRight: Screen.scale(15),
    paddingLeft: Screen.scale(15),
    paddingTop: Screen.scale(5),
    paddingBottom: Screen.scale(5),
  },
  list: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  primaryInputStyle: {
    ...Platform.select({
      ios: {
        fontSize: Screen.scale(16),
      },
      android: {
        fontSize: Screen.scale(Math.floor(16 / PixelRatio.getFontScale())),
      },
    }),
    marginLeft: 0,
    textAlign: "left",
    color: Colors.black,
    ...Platform.select({
      ios: {
        height: Screen.scale(35),
      },
    }),
  },
  subInputStyle: {
    ...Platform.select({
      ios: {
        fontSize: Screen.scale(16),
      },
      android: {
        fontSize: Screen.scale(Math.floor(16 / PixelRatio.getFontScale())),
      },
    }),
    letterSpacing: -0.22,
    textAlign: "left",
    color: Colors.greyishBrown,
    ...Platform.select({
      ios: {
        height: Screen.scale(35),
      },
    }),
  },
  listInputStyle: {
    ...Platform.select({
      ios: {
        fontSize: Screen.scale(16),
      },
      android: {
        fontSize: Screen.scale(16),
      },
    }),
    marginLeft: 0,
    textAlign: "right",
    color: Colors.black,
    ...Platform.select({
      ios: {
        height: Screen.scale(35),
      },
    }),
  },
  listDisableInput: {
    flex: 1,
    paddingLeft: Screen.scale(10),
    paddingTop: Screen.scale(10),
    paddingBottom: Screen.scale(10),
  },
  listDisableInputText: {
    textAlign: "right",
    fontSize: Screen.scale(12),
    color: Colors.black,
  },
});

export class PrimaryInput extends Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = (str) => {
    if (this.input) {
      this.input.test(str);
    }
  };

  check = () => {
    if (this.input) {
      return this.input.onEnd();
    }
  };
  focus = () => {
    if (this.input) {
      return this.input.focus();
    }
  };

  render() {
    return (
      <InputBox
        ref={(ref) => {
          this.input = ref;
        }}
        {...this.props}
        inputStyle={[styles.primaryInputStyle, this.props.inputStyle]}
        style={[styles.primary, this.props.style]}
        errorTextStyle={{
          fontSize: Screen.scale(12),
          color: Colors.pink,
        }}
        errorStyle={{
          container: {
            borderBottomColor: Colors.black,
          },
          text: {
            color: Colors.black,
          },
          placeholderTextColor: Colors.silver,
        }}
      />
    );
  }
}

export class SubInput extends Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = (str) => {
    if (this.input) {
      this.input.test(str);
    }
  };

  check = () => {
    if (this.input) {
      return this.input.onEnd();
    }
  };
  focus = () => {
    if (this.input) {
      this.input.focus();
    }
  };

  render() {
    return (
      <InputBox
        ref={(ref) => {
          this.input = ref;
        }}
        labelColor={Colors.greyishBrown}
        {...this.props}
        style={[styles.sub, this.props.style]}
        inputStyle={[styles.subInputStyle, this.props.inputStyle]}
      />
    );
  }
}

export class ListInput extends Component {
  static propTypes = {};
  static defaultProps = {
    onPess: null,
    editable: true,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = (str) => {
    if (this.input) {
      this.input.test(str);
    }
  };

  check = () => {
    if (this.input) {
      return this.input.onEnd();
    }
  };
  focus = () => {
    if (this.input) {
      return this.input.focus();
    }
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.listContent}
        onPress={this.props.onPress}
        activeOpacity={this.props.onPress ? 0.2 : 1}
      >
        <View style={{ justifyContent: "center" }}>
          <H3>{this.props.title}</H3>
        </View>
        {this.props.editable ? (
          <View style={{ flex: 1, paddingLeft: Screen.scale(10) }}>
            <InputBox
              ref={(ref) => {
                this.input = ref;
              }}
              {...this.props}
              inputStyle={[styles.listInputStyle, this.props.inputStyle]}
              style={[styles.list, this.props.style]}
              errorTextStyle={{
                fontSize: Screen.scale(12),
                color: Colors.pink,
              }}
              errorStyle={{
                container: {
                  borderBottomColor: Colors.black,
                  marginBottom: 0,
                },
                text: {
                  color: Colors.black,
                },
                placeholderTextColor: Colors.silver,
              }}
            />
          </View>
        ) : (
          <View style={styles.listDisableInput}>
            <DefaultText style={styles.listDisableInputText}>
              {this.props.value}
            </DefaultText>
          </View>
        )}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 6,
          }}
        >
          {this.props.onPress ? (
            <Icon
              size={Screen.scale(20)}
              color={Colors.silver}
              name="angle-right"
            />
          ) : (
            <View
              style={{ width: Screen.scale(this.props.paddingRight ? 8 : 0) }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
