import Constants from "expo-constants";
import React, { useState } from "react";
import { ListItem } from "react-native-elements";

import { User } from "~/Api";
import { ResultPanel } from "~/Component";
import { Screen } from "~/Helper";

const ApiPanel = ({
  title,
  list,
  dispatch,
  handleRequest,
  action,
  payload,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");

  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (
    <>
      <ListItem.Accordion
        content={
          <>
            {/* <Icon name="place" size={30} /> */}
            <ListItem.Content>
              <ListItem.Title>{title}</ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        {list.map((l, i) => (
          <ListItem
            key={l.name}
            onPress={() => {
              setRequestUrl(l.name);
              toggleOverlay();
              // handleRequest(l.name);
              dispatch(action[l.name](payload[l.name]));
            }}
            bottomDivider
          >
            <ListItem.Content style={{ paddingLeft: 16 }}>
              <ListItem.Title>{l.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </ListItem.Accordion>

      {!!requestUrl && (
        <ResultPanel
          // payload={}
          visible={visible}
          toggleOverlay={toggleOverlay}
          url={User[requestUrl]()}
          handler={() => dispatch(action[l.name](payload[l.name]))}
        />
      )}
    </>
  );
};

ApiPanel.style = Screen.ScaledSheet.create({
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

export default ApiPanel;
