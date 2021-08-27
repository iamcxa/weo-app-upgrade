import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import InputBox from 'App/Components/InputBox';
import { Actions } from 'react-native-router-flux';
import RoundButton from 'App/Components/Button';
import { checkRequired } from '../../utils/form';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
});

export default class InputBoxPlace extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      pwd: '',
      email: '',
      phone: '',
    };
  }

  render() {
    return (
      <View style={styles.container} ref={(c) => (this.form = c)}>
        <InputBox
          label="帳號:"
          onChangeText={(id) => this.setState({ id })}
          value={this.state.id}
          placeholder="請輸入身份證字號"
          isRequire
          pattern={'^([A-Z]|[a-z])\\d{9}$'}
          onError={() => {
            console.log('id validator fail!!');
          }}
        />
        <InputBox
          label="密碼:"
          onChangeText={(pwd) => this.setState({ pwd })}
          value={this.state.pwd}
          placeholder="請輸入密碼"
          isRequire
          pattern="^.{6,}$"
          onError={() => {
            console.log('pwd validator fail!!');
          }}
        />
        <InputBox
          label="手機號碼:"
          onChangeText={(phone) => this.setState({ phone })}
          value={this.state.phone}
          placeholder="請輸入手機"
          pattern={'^09\\d{2}-?\\d{3}-?\\d{3}$'}
          onError={() => {
            console.log('phone validator fail!!');
          }}
        />
        <InputBox
          label="Email:"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          placeholder="請輸入信箱"
          pattern={
            '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
          }
          onError={() => {
            console.log('email validator fail!!');
          }}
        />
        <View>
          <InputBox
            label="Email:"
            onChangeText={(email) => this.setState({ email })}
            isRequire
            value={this.state.email}
            placeholder="請輸入信箱"
            pattern={
              '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
            }
            onError={() => {
              console.log('email validator fail!!');
            }}
          />
        </View>
        <RoundButton
          text="送出"
          onPress={() => {
            const result = checkRequired(this.form);
            console.log('checkRequired', result);
          }}
        />
      </View>
    );
  }
}
