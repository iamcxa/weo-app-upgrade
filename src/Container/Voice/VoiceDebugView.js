// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    position: "absolute",
    top: 0,
  },
  replyBar: {
    position: "absolute",
    // left: 0,
    bottom: 0,
    backgroundColor: "white",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
});

class VoiceDebugView extends Component {
  static propTypes = {
    Voice: PropTypes.any,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  state = {
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isListening: false,
  };

  render() {
    const {
      end,
      raw,
      pitch,
      error,
      started,
      results,
      sentence,
      recognized,
      isListening,
      partialResults,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Press the button and start speaking.
        </Text>
        <Text style={styles.stat}>{`Started: ${started}`}</Text>
        <Text style={styles.stat}>{`Recognized: ${recognized}`}</Text>
        <Text style={styles.stat}>{`isListening: ${isListening}`}</Text>
        <Text style={styles.stat}>{`Pitch: ${pitch}`}</Text>
        <Text style={styles.stat}>{`Error: ${error}`}</Text>

        <Text style={styles.stat}>
          Results(
          {results.length}
          )(
          {results.toString().replace(",", "").length})
        </Text>
        <Text style={styles.stat}>{JSON.stringify(results)}</Text>
        {/* {results.map((result, index) => (
          <Text key={`result-${index}`} style={styles.stat}>
            {result}
          </Text>
        ))} */}
        <Text style={styles.stat}>Partial Results</Text>
        {/* {partialResults.map((result, index) => (
          <Text key={`partial-result-${index}`} style={styles.stat}>
            {result}
          </Text>
        ))} */}
        <Text style={styles.stat}>{JSON.stringify(partialResults)}</Text>
        <Text style={styles.stat}>sentence</Text>
        {!!sentence &&
          typeof sentence === "object" &&
          sentence.map((result, index) => (
            <Text key={`sentence-${index}`} style={styles.stat}>
              {result}
            </Text>
          ))}
        <Text style={styles.stat}>raw</Text>
        {!!sentence &&
          typeof sentence === "object" &&
          raw.map((result, index) => (
            <Text key={`raw-${index}`} style={styles.stat}>
              {result}
            </Text>
          ))}
        <Text style={styles.stat}>{`End: ${end}`}</Text>
      </View>
    );
  }
}

export default VoiceDebugView;
