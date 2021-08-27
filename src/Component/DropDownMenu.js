import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import Colors from "App/Theme/Colors";
import Images from "App/Theme/Images";
import PropTypes from "prop-types";
import Screen from "../utils/screen";
import { H4 } from "../widget/Label";

const styles = StyleSheet.create({
  content: {
    ...Platform.select({
      ios: {
        zIndex: 999,
      },
      android: {},
    }),
  },
  menu: {
    height: Screen.moderateScale(50),
    backgroundColor: Colors.silver,
    padding: Screen.moderateScale(10),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    // height: Screen.moderateScale(44),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray,
    borderBottomColor: Colors.mainBlue,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: Screen.moderateScale(15),
    paddingLeft: Screen.moderateScale(15),
    paddingTop: Screen.moderateScale(14),
    paddingBottom: Screen.moderateScale(14),
  },
});

export default class DropDownMenu extends Component {
  static propTypes = {
    list: PropTypes.array,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    menuComponent: PropTypes.element,
    menuHeight: PropTypes.number,
  };

  static defaultProps = {
    list: [
      // 'CEU埃雷拉大學宿舍',
      // 'CEU埃雷拉大學公寓',
      // 'CEU埃雷拉大學寄宿家庭',
      // 'CEU聖保羅大學宿舍',
      // 'CEU聖保羅大學公寓',
    ],
    onSelect: () => {},
    onClose: () => {},
    onOpen: () => {},
    menuHeight: Screen.moderateScale(50),
  };

  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      target: props.list[0],
      targetIndex: 0,
    };
    this.btnClick = false;
  }

  renderListItem = ({ title, index }) => (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.listItem}
        key={index}
        onPress={() => {
          this.setState({
            target: title,
            targetIndex: index,
            showList: false,
          });
          this.props.onSelect({
            index,
            name: title,
          });
          this.props.onClose();
        }}
      >
        <H4 style={{ lineHeight: parseInt(Screen.moderateScale(16), 10) }}>
          {title}
        </H4>
      </TouchableOpacity>
      <View
        style={{
          width: "100%",
          height: StyleSheet.hairlineWidth,
          flex: 1,
          backgroundColor: Colors.mainBlue,
          position: "absolute",
          bottom: StyleSheet.hairlineWidth * 2,
        }}
      />
    </View>
  );

  renderList = () => {
    const { list, menuHeight } = this.props;
    const items = list.map((data, index) =>
      this.renderListItem({
        title: data,
        index,
      })
    );
    if (Platform === "ios") {
      if (this.state.showList) {
        return (
          <View
            style={{
              position: "absolute",
              top: 50,
              width: "100%",
              backgroundColor: "#fff",
              zIndex: 9999,
            }}
          >
            {items}
          </View>
        );
      }
      return null;
    }
    return (
      <View
        style={{
          position: "absolute",
          top: this.state.showList ? menuHeight : -1000,
          width: "100%",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        {items}
      </View>
    );
  };

  menuOnPress = () => {
    this.setState(
      {
        showList: !this.state.showList,
      },
      () => {
        if (this.state.showList) {
          this.props.onOpen();
        } else {
          this.props.onClose();
        }
      }
    );
  };

  render() {
    const { style, list, menuComponent } = this.props;
    const { target, targetIndex } = this.state;
    return (
      <View style={styles.content}>
        {this.state.showList ? (
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showList: false,
              });
            }}
            style={{
              position: "absolute",
              height: Screen.height,
              width: Screen.width,
            }}
          />
        ) : null}
        {list.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              if (!this.btnClick) {
                this.btnClick = true;
                this.menuOnPress();
                setTimeout(() => {
                  this.btnClick = false;
                }, 100);
              }
            }}
          >
            {menuComponent || (
              <View style={[styles.menu, style]}>
                <View style={styles.text}>
                  <H4 numberOfLines={1} style={{ fontWeight: "bold" }}>
                    {target}
                  </H4>
                </View>
                <Image source={Images.dropdownIcon} />
              </View>
            )}
          </TouchableOpacity>
        ) : null}
        {this.renderList()}
      </View>
    );
  }
}
