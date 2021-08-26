import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import Colors from "App/Theme/Colors";
import { Title } from "../../widget/Label";
import DropDownMenu from "App/Components/DropDownMenu";
import { PrimaryBtn, LineBtn } from "../../widget/Button";
import { PrimaryInput, ListInput } from "../../widget/InputBox";
import CheckBox from "../../widget/CheckBox";
import Screen from "../../utils/screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    padding: 30,
  },
});

export default class Gec extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      checked: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <DropDownMenu
          list={[
            "測試",
            "測試2",
            "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦",
          ]}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title>Welcome to GEC.</Title>
          <PrimaryInput
            style={{ marginBottom: 10 }}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            pattern="^[0-9]*$"
            placeholder="帳戶 ID"
            isRequire
            ref={(ref) => (this.pwdInput = ref)}
            errorText="帳戶 ID 或密碼輸入錯誤"
          />
          <ListInput
            onChangeText={(password) => this.setState({ password })}
            title="請輸入密碼"
            value={this.state.password}
            placeholder="密碼"
            isRequire
            ref={(ref) => (this.pwdInput = ref)}
            secureTextEntry
            showSecureBtn={false}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CheckBox
            onClick={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
            isChecked={this.state.checked}
            rightText="我已詳細閱讀且同意隱私權條款和使用者條款"
          />
          <CheckBox
            onClick={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
            isChecked={this.state.checked}
            rightText={[
              "我已詳細閱讀且同意",
              <LineBtn text="隱私條款" onPress={() => {}} />,
              "和",
              <LineBtn text="使用者條款" onPress={() => {}} />,
            ]}
          />
          <PrimaryBtn
            onPress={Actions.drawer}
            text="下一步"
            //style={{ width: Screen.width - Screen.moderateScale(90) }}
          />
          <LineBtn text="忘記密碼" onPress={() => {}} />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}
