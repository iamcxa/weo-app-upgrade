import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import DeviceInfo from "react-native-device-info";
import DropdownAlert from "react-native-dropdownalert";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import config from "App/Config";
import RoundButton from "App/Components/Button";
import { updateAlert } from "App/Stores/AppAlert/Actions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

@connect(
  (state) => ({}),
  (dispatch) =>
    bindActionCreators(
      {
        updateAlert,
      },
      dispatch
    )
)
class Index extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      pushToken: "",
    };
  }

  componentWillMount() {
    console.log(DeviceInfo.getUniqueID());
  }

  iosOnly = () => {
    if (Platform.OS === "ios") {
      return [];
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Icon name="rocket" size={30} color="#900" />
        <Text>{DeviceInfo.getUniqueID()}</Text>
        <Text>{this.state.pushToken}</Text>
        <Text>{config.domain}</Text>
        <RoundButton
          onPress={Actions.sandBoxHereYouAre}
          text="HereYouAre List"
        />
        <RoundButton onPress={Actions.gec} text="GEC 通用元件 drawer" />
        <RoundButton onPress={Actions.gec} text="GEC 通用元件" />
        <RoundButton onPress={Actions.gec3} text="GEC 通用元件3" />
        <RoundButton onPress={Actions.text} text="Private text" />
        <RoundButton onPress={Actions.inputBoxPlace} text="Input Box Place" />
        <RoundButton onPress={Actions.fcmPlace} text="FCM" />
        <RoundButton onPress={Actions.animateList} text="AnimateList" />
        <RoundButton onPress={Actions.tabbar} text="Tabbar" />
        {this.iosOnly()}
        <RoundButton
          onPress={() => {
            setTimeout(() => {
              this.props.updateAlert({
                title: "Good",
                desc: "XXX 正在關心",
                status: "show",
              });
            }, 5000);
          }}
          text="alert"
        />
        <RoundButton onPress={Actions.pop} text="Back" />
        <DropdownAlert
          ref={(ref) => (this.dropdown = ref)}
          onClose={(data) => {}}
          onPress={() => {
            console.log("!!!!!!!!!!!");
          }}
        />
      </ScrollView>
    );
  }
}

export default Index;
