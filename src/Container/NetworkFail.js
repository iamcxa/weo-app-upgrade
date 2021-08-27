import React, { Component } from 'react';
import { StyleSheet, View, Animated, NetInfo } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { PrimaryBtn } from '../widget/Button';
import i18n, { i18nKey } from '../utils/i18n';
import IconTitle from '../widget/IconTitle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 22,
  },
});

export default class ForgetPassword extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      identity: '',
      invalid: {},
    };
    this.iosKeyboardHeight = new Animated.Value(0);
  }

  render() {
    return (
      <View style={styles.container}>
        <IconTitle
          title={i18n.t(i18nKey.networkFail)}
          logo=""
          subTitle={i18n.t(i18nKey.networkFailMsg)}
          subTitleStyle={{ paddingLeft: 0, paddingRight: 0 }}
          logoHeight={85}
          logoWidth={85}
        />
        <View style={{ flex: 0.43 }}>
          <PrimaryBtn
            onPress={async () => {
              // NetInfo.isConnected.fetch().done((isConnected) => {
              //   if (isConnected) {
              //   }
              // });
              Actions.RootTabs({
                panHandlers: null,
                type: 'replace',
              });
            }}
            text={i18n.t(i18nKey.networkFailRetry)}
          />
        </View>
      </View>
    );
  }
}
