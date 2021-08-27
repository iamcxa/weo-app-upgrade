import React, { PureComponent } from 'react';
import { TextInput, Platform } from 'react-native';
import ReactNativeVersion from 'react-native/Libraries/Core/ReactNativeVersion';

const rnVer = ReactNativeVersion.version.minor;

// https://github.com/facebook/react-native/issues/18403#issuecomment-411666696
const fixComposeInput = (Component) =>
  class MyTextInput extends PureComponent {
    state = { diffKey: 0, value: '', display: '' };

    static getDerivedStateFromProps(props, state) {
      if (!state || !state.props || props.value !== state.props.value) {
        const value = props.value || '';
        const display = (state && state.display) || '';
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

    focus = () => this.input.focus();

    blur = () => this.input.blur();

    render() {
      const { refInput, value: valueProp, onChangeText, ...inputProps } = this.props;
      const { value, diffKey } = this.state;

      return Platform.OS === 'ios' && rnVer >= 54 && rnVer <= 56 ? (
        <Component
          {...inputProps}
          key={`TextInput${diffKey}`}
          ref={(r) => {
            this.input = r;
            if (refInput) {
              refInput(r);
            }
          }}
          value={value}
          onChangeText={this.handleChange}
        />
      ) : (
        Component
      );
    }
  };

export default fixComposeInput;

// export default Platform.OS === 'ios' && rnVer >= 54 && rnVer <= 56
//   ? fixComposeInput(TextInput)
// : TextInput;

// import React from 'react';
// https://github.com/facebook/react-native/issues/18403
// https://github.com/facebook/react-native/issues/18403#issuecomment-399397308
// const withFixInputComposeWrapper = (WrappedComponent) => {
//   class HandleHandWritingTextInput extends React.PureComponent {
//     forceBlur(e) {
//       console.log('forceBlur');
//       const {
//         onChangeText,
//         onBlur,
//       } = this.props;

//       if (onChangeText) {
//         onChangeText(this.tempText);
//       }
//       if (onBlur) {
//         onBlur(e);
//       }
//     }

//     render() {
//       const { onChangeText, onBlur, ...rest } = this.props;

//       return (
//         <WrappedComponent
//           ref={(ref) => {
//             this.input = ref;
//             // eslint-disable-next-line no-unused-expressions
//             rest.getInputRef && rest.getInputRef(this.input);
//           }}
//           // getInputRef={rest.getInputRef
//           //   ? rest.getRef(this.input)
//           //   : () => {}}
//           onChangeText={(text) => {
//             this.tempText = text;
//           }}
//           onBlur={(e) => {
//             if (onChangeText) {
//               onChangeText(this.tempText);
//             }
//             if (onBlur) {
//               onBlur(e);
//             }
//           }}
//           {...rest}
//         />
//       );
//     }
//   }

//   return HandleHandWritingTextInput;
// };

// export default withFixInputComposeWrapper;
