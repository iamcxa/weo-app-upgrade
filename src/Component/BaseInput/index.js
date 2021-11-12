import React from "react";
import { isString } from "lodash";
import { PropTypes } from "prop-types";
import { Input } from "react-native-elements";

import { ScaledSheet } from "App/Helpers";

const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: 0,
    justifyContent: "center",
  },
});
export default class BaseInput extends React.PureComponent {
  static propTypes = {
    leftComponent: PropTypes.object,
    rightComponent: PropTypes.object,
    onChangeText: PropTypes.func,
    containerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    inputContainerStyle: PropTypes.object,
    leftIconContainerStyle: PropTypes.object,
    editable: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    unControllered: PropTypes.bool,
  };

  static defaultProps = {
    leftComponent: {},
    rightComponent: {},
    onChangeText: () => {},
    containerStyle: {},
    inputStyle: {},
    inputContainerStyle: {},
    leftIconContainerStyle: {},
    editable: true,
    placeholder: "",
    value: undefined,
    unControllered: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, unControllered } = nextProps;
    if (!unControllered && isString(value) && prevState.localeValue !== value) {
      return {
        localeValue: value,
      };
    }
    return null;
  }

  state = {
    localeValue: "",
  };

  setValue = (value) => {
    this.setState(
      {
        localeValue: value,
      },
      () => this.props.onChangeText(value)
    );
  };

  render() {
    const {
      leftComponent,
      rightComponent,
      containerStyle,
      inputStyle,
      inputContainerStyle,
      leftIconContainerStyle,
      editable,
      placeholder,
      value,
    } = this.props;
    const { localeValue } = this.state;
    return (
      <Input
        {...this.props}
        inputContainerStyle={[styles.container, inputContainerStyle]}
        leftIconContainerStyle={leftIconContainerStyle}
        inputStyle={inputStyle}
        containerStyle={containerStyle}
        leftIcon={leftComponent}
        rightIcon={rightComponent}
        editable={editable}
        value={localeValue}
        onChangeText={this.setValue}
        placeholder={placeholder}
      />
    );
  }
}
