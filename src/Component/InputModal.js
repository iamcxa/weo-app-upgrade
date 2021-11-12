import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StatusBar,
  Platform,
  PixelRatio,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import _ from "lodash";
import { bindActionCreators } from "redux";
import Entypo from "react-native-vector-icons/Ionicons";
import config from "~/Config";
import Colors from "~/Theme/Colors";
import { Screen } from "~/Helper";
import { PrimaryInput } from "../widget/InputBox";
import { Title, DefaultText } from "../widget/Label";
import i18n, { i18nKey } from "../utils/i18n";
import Modal from "./BaseLightbox";

const styles = StyleSheet.create({});

@connect((state) => ({}), (dispatch) => bindActionCreators({}, dispatch))
class InputMadal extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    submitText: PropTypes.string,
    closeText: PropTypes.string,
  };

  static defaultProps = {
    onSubmit: () => {},
    submitText: "建立",
    closeText: "取消",
  };

  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  async componentDidMount() {}

  onSubmit = () => {
    if (this.state.text) {
      console.log(this.state.text);
      this.props.onSubmit(this.state.text);
    }
  };

  render() {
    const { submitText, closeText } = this.props;
    return (
      <Modal
        verticalPercent={0.3}
        horizontalPercent={0.5}
        height={200}
        onSubmit={this.onSubmit}
        submitText={submitText}
        closeText={closeText}
      >
        <View style={{ justifyContent: "center" }}>
          <Title>項目名稱: </Title>
          <PrimaryInput
            style={{}}
            onChangeText={(text) => this.setState({ text }, this.checkForm)}
            value={this.state.text}
            placeholder=""
            isRequire
            ref={(ref) => (this.textInput = ref)}
            autoFocus
          />
        </View>
      </Modal>
    );
  }
}

export default InputMadal;
