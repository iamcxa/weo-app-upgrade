import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import ListItem from "App/Components/ListItem";
import { H3, DefaultText } from "./Label";
import { Colors } from "~/Theme";
import { Screen } from "~/Helper";
import Images from "~/Theme/Images";

const styles = StyleSheet.create({
  descFont: {
    fontSize: Screen.scale(12),
    color: Colors.mainBlue,
    // color: 'red'
    marginBottom: 2,
  },
  icon: {
    height: Screen.scale(30),
    width: Screen.scale(30),
    marginLeft: Screen.scale(20),
  },
});

function RowItem(props) {
  const { left, right } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <DefaultText style={styles.descFont}>{left}</DefaultText>
      {right ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <DefaultText
            style={[
              styles.descFont,
              { fontWeight: "600", marginRight: Screen.scale(3) },
            ]}
          >
            {right}
          </DefaultText>
          <Icon
            size={Screen.scale(16)}
            color={Colors.silver}
            name="angle-right"
          />
        </View>
      ) : null}
    </View>
  );
}

function RangeThreeItem(props) {
  const { start, end } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          height: Screen.scale(12),
          width: Screen.width - Screen.scale(30),
          justifyContent: "center",
        }}
      >
        <View
          style={{ height: Screen.onePixel, backgroundColor: Colors.mainBlue }}
        />
      </View>
      <DefaultText style={[styles.descFont, { backgroundColor: "#fff" }]}>
        {start} •
      </DefaultText>
      <DefaultText style={[styles.descFont, { backgroundColor: "#fff" }]}>
        • {end}
      </DefaultText>
    </View>
  );
}

export function ThreeLineListItem({ style, ...props }) {
  const { line1, line2, line3, right, start, end } = props;
  return (
    <ListItem
      style={[
        style,
        {
          paddingBottom: Screen.scale(8),
          borderBottomColor: Colors.silver,
          borderBottomWidth: 1,
        },
      ]}
      {...props}
    >
      <H3 style={{ fontWeight: "600", marginBottom: 5 }}>{line1}</H3>
      <DefaultText style={styles.descFont}>{line2}</DefaultText>
      {start && end ? (
        <RangeThreeItem {...props} />
      ) : (
        <RowItem left={line3} right={right} />
      )}
    </ListItem>
  );
}

export function RowStatusListItm({ style, ...props }) {
  const { line1, finish, right } = props;
  return (
    <ListItem
      style={[
        style,
        {
          padding: Screen.scale(26),
          borderBottomColor: Colors.silver,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
      {...props}
    >
      <View style={{ flex: 1, paddingRight: Screen.scale(26) }}>
        <H3 style={{}}>{line1}</H3>
      </View>
      {finish ? (
        <Ionicons
          size={Screen.scale(16)}
          color={Colors.lightblue}
          name="md-checkmark"
        />
      ) : (
        <H3 style={{ fontSize: Screen.scale(17), color: Colors.gray2 }}>
          {right}
        </H3>
      )}
    </ListItem>
  );
}

export function RightIconListItm({ style, ...props }) {
  const { line1, line2, icon1, icon1OnPress, icon2, icon2OnPress } = props;
  const hitSlop = {
    top: 10,
    left: 0,
    bottom: 10,
    right: 0,
  };
  return (
    <ListItem
      style={[
        style,
        {
          paddingLeft: Screen.scale(25),
          paddingTop: Screen.scale(18),
          paddingBottom: Screen.scale(13),
          borderBottomColor: Colors.silver,
          borderBottomWidth: 1,
        },
      ]}
      {...props}
      disablePress
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <H3 style={{ fontWeight: "600" }}>{line1}</H3>
          <DefaultText style={styles.descFont}>{line2}</DefaultText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={icon1OnPress} hitSlop={hitSlop}>
            <Image style={styles.icon} resizeMode="contain" source={icon1} />
          </TouchableOpacity>
          {icon2 ? (
            <TouchableOpacity onPress={icon2OnPress} hitSlop={hitSlop}>
              <Image style={styles.icon} resizeMode="contain" source={icon2} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ListItem>
  );
}

export function TowRowListItm({ style, ...props }) {
  const { line1, line2, right, notify, descNumberOfLines } = props;
  const hitSlop = {
    top: 10,
    left: 0,
    bottom: 10,
    right: 0,
  };
  return (
    <ListItem
      style={[
        style,
        {
          paddingLeft: Screen.scale(25),
          paddingTop: Screen.scale(18),
          paddingBottom: Screen.scale(13),
          borderBottomColor: Colors.silver,
          borderBottomWidth: 1,
        },
      ]}
      {...props}
    >
      {notify ? (
        <View
          style={{
            position: "absolute",
            height: Screen.scale(24),
            width: Screen.scale(3),
            backgroundColor: Colors.pink,
            top: Screen.scale(28),
          }}
        />
      ) : null}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <H3 style={{ flex: 1 }}>{line1}</H3>
        <Icon
          size={Screen.scale(25)}
          color={Colors.silver}
          name="angle-right"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DefaultText
          style={[styles.descFont, { flex: 1, paddingRight: 20 }]}
          numberOfLines={descNumberOfLines}
        >
          {line2}
        </DefaultText>
        <DefaultText style={styles.descFont}>{right}</DefaultText>
      </View>
    </ListItem>
  );
}

export function TowRowPicListItm({ style, ...props }) {
  const { line1, line2, right, notify, descNumberOfLines } = props;
  const hitSlop = {
    top: 10,
    left: 0,
    bottom: 10,
    right: 0,
  };
  return (
    <ListItem
      style={[
        style,
        {
          paddingTop: Screen.scale(18),
          paddingBottom: Screen.scale(13),
          borderBottomColor: Colors.silver,
          borderBottomWidth: 1,
        },
      ]}
      {...props}
    >
      {notify ? (
        <View
          style={{
            position: "absolute",
            height: Screen.scale(24),
            width: Screen.scale(3),
            backgroundColor: Colors.pink,
            top: Screen.scale(28),
          }}
        />
      ) : null}
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingRight: Screen.scale(20),
          }}
        >
          <Image
            style={{ height: Screen.scale(50), width: Screen.scale(50) }}
            source={{ uri: "http://via.placeholder.com/100x100" }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: Screen.scale(10),
            }}
          >
            <H3 style={{ flex: 1 }}>{line1}</H3>
            {/* <Icon size={Screen.scale(25)} color={Colors.silver} name="angle-right" /> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DefaultText
              style={[styles.descFont, { flex: 1, paddingRight: 20 }]}
              numberOfLines={descNumberOfLines}
            >
              {line2}
            </DefaultText>
            <DefaultText style={styles.descFont}>{right}</DefaultText>
          </View>
        </View>
      </View>
    </ListItem>
  );
}
