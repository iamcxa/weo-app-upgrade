import Constants from "expo-constants";
import React from "react";
import { Platform, SafeAreaView, Text, TextInput, View } from "react-native";
import { Button, SearchBar } from "react-native-elements";

import { Screen } from "~/Helper";
import { Classes, Colors, Images, Metrics } from "~/Theme";

const PrimarySearchBar = (props) => {
  const [text, setText] = React.useState("");
  const [showMic, setShowMic] = React.useState(true);

  console.log("props=>", props);
  return (
    <SafeAreaView style={SearchBar.style.container}>
      <SearchBar
        // ref={(ref) => (this.searchBar = ref)}
        placeholder="Type Here..."
        // round
        // showCancel
        // showLoading
        platform={Platform.OS}
        containerStyle={SearchBar.style.wrapper}
        onChangeText={setText}
        value={text}
        onFocus={() => setShowMic(false)}
        onBlur={() => setShowMic(true)}
        // rightIconContainerStyle={{ flex: 1 }}
      />
      {showMic && (
        <Button
          type="clear"
          style={SearchBar.style.btnVoice}
          icon={{
            type: "font-awesome",
            name: "microphone",
            // name: 'close',
            size: 24,
            color: "black",
          }}
        />
      )}
    </SafeAreaView>
  );
};

SearchBar.style = Screen.ScaledSheet.create({
  container: {
    // position: 'relative',
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    marginTop: Constants.statusBarHeight,
    justifyContent: "center",
    alignItems: "center",
    // position: 'absolute',
    // height: '72@s',
    // marginBottom: Metrics.baseMargin * 2,
    // left: -Screen.width / 2,
    // width: Screen.width - Metrics.baseMargin * 4,
    // paddingHorizontal: Metrics.baseMargin * 2,
    // marginBottom: Metrics.baseMargin * 2,
    // backgroundColor: Colors.BLUE_GREY_10,
  },
  wrapper: {
    marginLeft: Metrics.baseMargin,
    // borderRadius: 10,
    // padding: Metrics.baseMargin,
    flex: 1,
    backgroundColor: Colors.transparent,
    // flex: 1,
    // height: '48@s',
    // width: Screen.width - Metrics.baseMargin * 6,
  },
  btnVoice: {
    marginRight: Metrics.baseMargin,
  },
  textInput: {
    paddingHorizontal: Metrics.baseMargin,
    // margin: 0,
    height: "36@s",
    borderWidth: 0,
  },
});

export default PrimarySearchBar;
