import Constants from "expo-constants";
import { get } from "lodash";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button, Input, Overlay, Text } from "react-native-elements";
import JSONTree from "react-native-json-tree";

import { ApiStore } from "~/Api/ApiHandler/Store";
import { Screen } from "~/Helper";

const RenderComponent = ({ data, name, onChange }) => (
  <View style={{}}>
    <Text>
      {name} - {typeof data[name]}
    </Text>
    {getInputComponent(data, name, onChange)}
  </View>
);

const getInputComponent = (data, e, onChange) => {
  switch (typeof data[e]) {
    case "object":
      return (
        <View style={{ padding: 16, flex: 1 }}>
          {Object.keys(data[e]).map((p) => (
            <>
              <Text>
                {p} - {typeof data[e][p]}
              </Text>
              <Input
                placeholder={p}
                value={data[e][p]}
                onChangeText={(val) => {
                  console.log("e=>", e);
                  console.log("p=>", p);
                  onChange(e)({ ...data[e], [p]: val });
                }}
              />
            </>
          ))}
        </View>
      );
    default:
    case "string":
    case "number":
      return (
        <Input placeholder={e} value={data[e]} onChangeText={onChange(e)} />
      );
  }
};

const RequestPanel = ({ data, onChange, ...props }) => {
  return (
    <>
      {Object.keys(data).map((e) => (
        <RenderComponent name={e} data={data} onChange={onChange} />
      ))}
    </>
  );
};

const ResultPanel = ({ url, ...props }) => {
  const thisRef = React.useRef();
  const [bodyData, setBodyData] = React.useState({});
  // visible, toggleOverlay, handler

  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    const unsubscribe = ApiStore.subscribe(() => {
      thisRef.current = get(ApiStore.getState(), "appApi");

      if (thisRef.current.request.url === url) {
        forceUpdate();
        setBodyData(getRequestBody(thisRef.current));
      }
    });

    return () => unsubscribe();
  }, [url]);

  const getRequestBody = (data) => {
    try {
      return JSON.parse(get(data, "request.data", {}));
    } catch (e) {
      // console.warn('getRequestBody failed, content may not be json string! ', e);
      return get(data, "request.data", {});
    }
  };
  const getState = (key, defaultValue = undefined) => {
    return get(thisRef.current, key, defaultValue);
  };
  return (
    <Overlay
      fullScreen
      isVisible={props.visible}
      onBackdropPress={props.toggleOverlay}
      overlayStyle={ResultPanel.style.container}
    >
      <ScrollView
      // style={{ flext: 1 }}
      >
        <View style={ResultPanel.style.loadingWrapper}>
          <Text h3 style={ResultPanel.style.txtTitle}>
            Request Url
          </Text>
          <ActivityIndicator size="small" animating={getState("isFetching")} />
        </View>
        <Text>
          {getState("request.baseURL")}
          {getState("request.url")}
        </Text>

        <Text h3 style={ResultPanel.style.txtTitle}>
          Request Params
        </Text>
        <JSONTree data={getState("request.params")} />

        <Text h3 style={ResultPanel.style.txtTitle}>
          Request Body
        </Text>
        <JSONTree data={bodyData} />
        <RequestPanel
          data={bodyData}
          onChange={(key) => (value) => {
            console.log("key=>", key);
            console.log("value=>", value);
            setBodyData({ ...bodyData, [key]: value });
          }}
        />

        <Text h3 style={ResultPanel.style.txtTitle}>
          {getState("error") !== null
            ? "Response - Error"
            : "Response - Success"}
        </Text>
        {getState("error") !== null ? (
          <JSONTree data={getState("error")} />
        ) : (
          <JSONTree data={getState("response.data")} />
        )}

        <Button
          loading={getState("isFetching")}
          title="Retry"
          onPress={props.handler}
        />
        <Button
          title="Close"
          onPress={props.toggleOverlay}
          type="clear"
          style={ResultPanel.style.btnClose}
        />
      </ScrollView>
    </Overlay>
  );
};

ResultPanel.style = Screen.ScaledSheet.create({
  container: {
    height: "auto",
    // width: '95%',
    padding: "16@s",
    marginTop: Constants.statusBarHeight,
    marginBottom: Constants.statusBarHeight,
  },
  loadingWrapper: {
    marginTop: "16@s",
    flexDirection: "row",
    // alignItems: 'center',
    justifyContent: "space-between",
  },
  txtTitle: {
    marginTop: "8@s",
  },
  btnClose: {
    marginBottom: "8@s",
  },
});

export default ResultPanel;
