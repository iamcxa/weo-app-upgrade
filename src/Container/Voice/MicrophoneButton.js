// @flow
import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

import Images from "~/Theme/Images";
import ImageButton from "~/Component/ImageButton";
import Screen from "../../utils/screen";

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  microphone: {
    width: Screen.scale(152),
    height: Screen.scale(158),
    marginTop: 101,
  },
});

const MicrophoneButton = ({ onPress }) => (
  <View style={styles.container}>
    <Animatable.View
      animation="pulse"
      easing="ease-out"
      iterationCount="infinite"
    >
      <ImageButton
        source={Images.voice.microphone}
        style={styles.microphone}
        onPress={onPress}
      />
    </Animatable.View>
  </View>
);

MicrophoneButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default MicrophoneButton;
