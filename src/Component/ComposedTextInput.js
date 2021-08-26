import React, { PureComponent } from "react";
import { TextInput, Platform } from "react-native";
import ReactNativeVersion from "react-native/Libraries/Core/ReactNativeVersion";

export function fixComposeInput(Component) {
  return class MyTextInput extends PureComponent {
    state = { diffKey: 0, value: "", display: "" };

    static getDerivedStateFromProps(props, state) {
      if (!state || !state.props || props.value !== state.props.value) {
        const value = props.value || "";
        const display = (state && state.display) || "";
        if (value !== display) {
          const diffKey = ((state && state.diffKey) >>> 0) + 1;
          return {
            props,
            value,
            display: value,
            diffKey,
          };
        }
      }

      return { props };
    }

    handleChange = (text) => {
      // keep track of the display value
      this.setState({ display: text }, () => {
        const { onChangeText } = this.props;
        onChangeText && onChangeText(text);
      });
    };

    render() {
      const {
        refInput,
        value: valueProp,
        onChangeText,
        ...inputProps
      } = this.props;
      const { value, diffKey } = this.state;

      return (
        <Component
          {...inputProps}
          key={`TextInput${diffKey}`}
          ref={refInput}
          value={value}
          onChangeText={this.handleChange}
        />
      );
    }
  };
}

const rnVer = ReactNativeVersion.version.minor;

export default Platform.OS === "ios" && rnVer >= 54 && rnVer <= 56
  ? fixComposeInput(TextInput)
  : TextInput;
