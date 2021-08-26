import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
// import FCM, {
//   FCMEvent,
//   RemoteNotificationResult,
//   WillPresentNotificationResult,
//   NotificationType,
// } from 'react-native-fcm';
import * as fcm from "../../utils/fcm";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default class FCMPlace extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
  }

  async componentDidMount() {
    fcm.init({
      updateAlert: () => {},
      updateNotifyAction: () => {},
    });
    this.setState({
      token: await fcm.getToken(),
    });
    // FCM.getFCMToken().then(token => {
    //     console.log(token)
    //     // store fcm token in your server
    // });
  }

  render() {
    const { token } = this.state;
    return (
      <View style={styles.container}>
        <Text>FCM</Text>
        <Text>{token}</Text>
        <TextInput style={{ width: "100%", height: 100 }} value={token} />
      </View>
    );
  }
}
