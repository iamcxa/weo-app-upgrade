import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '~/Theme/Colors';
import CheckBox from 'react-native-check-box';
import Screen from '../utils/screen';
import { PrimaryInput } from '../widget/InputBox';
import { checkForm } from '../utils/form';

const styles = StyleSheet.create({
  checkBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Screen.moderateScale(21),
    height: Screen.moderateScale(21),
    // borderRadius: Screen.moderateScale(2.5 * 2),
    backgroundColor: '#fafafa',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.mainBlue,
  },
  checkBoxChecked: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Screen.moderateScale(21),
    height: Screen.moderateScale(21),
    // borderRadius: Screen.moderateScale(2.5 * 2),
    backgroundColor: Colors.pink,
    borderStyle: 'solid',
    borderWidth: Screen.onePixel,
    borderColor: Colors.pink,
  },

  inputInnerStyle: {
    color: Colors.tealish,
    paddingLeft: 0,
    marginLeft: 0,
    marginBottom: 0,
    paddingBottom: 0,
    fontSize: Screen.moderateScale(16),
  },
  inputOuterStyle: {
    flexDirection: 'row',
    marginLeft: Screen.moderateScale(22),
    marginBottom: 0,
  },
});
export default class CheckboxList extends Component {
  static propTypes = {
    rightContent: PropTypes.array,
    placeholder: PropTypes.string,
    onChanege: PropTypes.func,
  };

  static defaultProps = {
    onChanege: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      ischecked: null,
      input: '',
      isErrorCheck: true,
    };
  }

  componentDidMount() {
    this.props.rightContent.map((data) => {
      if (data.hasInput) {
        if (data.checked) {
          if (data.customText.length > 0) {
            this.setState({
              isErrorCheck: true,
            });
          } else {
            this.setState({
              isErrorCheck: false,
            });
          }
        }
      }
    });
  }

  resetChecked = () => {
    this.setState({
      ischecked: null,
      isErrorCheck: true,
    });
  };

  setClick = (i) => {
    let hasinputIndex;
    console.log('click', i);
    if (this.state.ischecked === i) {
      this.props.onChanege({
        index: -1,
        value: '',
        id: -1,
      });
      this.setState({
        ischecked: null,
        isErrorCheck: true,
      });
    } else {
      this.props.onChanege({
        index: i,
        value: this.props.rightContent[i].hasInput
          ? this.state.input
          : this.props.rightContent[i].name,
        id: this.props.rightContent[i].id,
      });
      this.setState({
        ischecked: i,
      });
      this.props.rightContent.forEach((data, index) => {
        if (data.hasInput) {
          hasinputIndex = index;
        }
      });
      if (hasinputIndex === i) {
        console.log('input', this.state.input);
        if (this.state.input) {
          this.setState({
            isErrorCheck: true,
          });
        } else {
          this.setState({
            isErrorCheck: false,
          });
        }
      } else {
        this.setState({
          isErrorCheck: true,
        });
      }
    }
  };

  check = () => this.state.isErrorCheck;

  inputOnChange = (input, i) => {
    let isErrorCheck = false;
    if (input) {
      isErrorCheck = true;
    }
    this.setState(
      {
        ischecked: i,
        input,
        isErrorCheck,
      },
      () => {
        this.props.onChanege({
          index: i,
          value: this.props.rightContent[i].hasInput
            ? this.state.input
            : this.props.rightContent[i].name,
          id: this.props.rightContent[i].id,
        });
        console.log('input', this.state.input);
      },
    );
  };

  render() {
    let result;
    const { setClick, rightContent, keyboardShow, keyboardHide } = this.props;
    const radioList = this.props.rightContent.map((data, i) => {
      const hasInputAndSelect = data.hasInput && this.state.ischecked === i;
      if (hasInputAndSelect) {
        // 有輸入框且勾選時
        console.log(this.state.isErrorCheck);
        result = (
          <PrimaryInput
            style={styles.inputOuterStyle}
            inputStyle={styles.inputInnerStyle}
            onChangeText={(input) => {
              this.inputOnChange(input, i);
            }}
            value={this.state.input || data.customText}
            placeholder={data.placeHolder}
            placeholderTextColor={Colors.greyishBrown}
            isRequire
            ref={(ref) => (this.input = ref)}
            errorText=""
            isError={!this.state.isErrorCheck}
            onFocus={() => {
              if (keyboardShow) {
                keyboardShow(this.input);
              }
            }}
            onEndEditing={() => {
              if (keyboardHide) {
                keyboardHide();
              }
            }}
          />
        );
      } else if (data.hasInput && this.state.ischecked != i) {
        // 有輸入框但未勾選時
        console.log(this.state.isErrorCheck); // 一載入都是null
        result = (
          <PrimaryInput
            style={styles.inputOuterStyle}
            inputStyle={styles.inputInnerStyle}
            onChangeText={(input) => {
              this.inputOnChange(input, i);
            }}
            value={this.state.input || data.customText}
            placeholder={data.placeHolder}
            placeholderTextColor={Colors.greyishBrown}
            maxLength={data.max}
            isRequire={false}
            isError={false}
            ref={(ref) => (this.input = ref)}
            errorText=""
            onFocus={() => {
              if (keyboardShow) {
                keyboardShow(this.input);
                // Android ScrollView 鍵盤沒有把 View 推起來的 Hack
                const str = ' ';
                const str2 = this.state.input;
                this.setState(
                  {
                    input: str,
                  },
                  () => {
                    this.setState({
                      input: str2,
                    });
                  },
                );
              }
            }}
            onEndEditing={() => {
              if (keyboardHide) {
                keyboardHide();
              }
            }}
          />
        );
      } else {
        result = null;
      }
      return (
        <View style={{}}>
          <CheckBox
            rightTextStyle={{
              fontSize: Screen.moderateScale(16),
              color: Colors.mainBlue,
              marginTop: Screen.moderateScale(7.5),
              marginBottom: Screen.moderateScale(7.5),
              marginLeft: Screen.moderateScale(10),
            }}
            onClick={() => {
              this.setClick(i);
            }}
            isChecked={this.state.ischecked !== null ? this.state.ischecked === i : data.checked}
            rightText={data.name}
            unCheckedImage={<View style={styles.checkBox} />}
            checkedImage={<View style={styles.checkBoxChecked} />}
            // unCheckedImage={<View style={styles.unCheckStyle} />}
            // checkedImage={
            //   <View style={styles.isCheckedStyle}>
            //     <IoniconsIcon
            //       name="md-checkmark"
            //       size={Screen.moderateScale(16)}
            //       color={Colors.whiteThree}
            //     />
            //   </View>
            // }
          />
          {result}
        </View>
      );
    });
    return <View style={{}}>{radioList}</View>;
  }
}
