import React from "react";
import { Pressable, View } from "react-native";
import { Chip, Text, Tooltip } from "react-native-elements";

import { Screen, t } from "~/Helper";
import { Classes, Colors, Fonts, Metrics } from "~/Theme";

const TooltipPanel = ({
  getRef = () => {},
  onPress = () => {},
  onClose = () => {},
  onOpen = () => {},
  children,
  height = Screen.scale(120),
  width = Screen.scale(220),
  title = "",
  content = "",
  style = {},

  buttonSkipText = t("tooltip.button.skip"),
  buttonNextText = t("tooltip.button.next"),

  visible = true,
  tooltipKey = "",
  allTooltips = {},

  ...props
}) => {
  const thisRef = React.useRef({}).current;

  thisRef.visible = visible || allTooltips[tooltipKey];

  const tpIndex =
    allTooltips && tooltipKey
      ? Object.keys(allTooltips).indexOf(tooltipKey)
      : 0;

  React.useEffect(() => {
    thisRef.visible = visible;
  }, [thisRef, visible]);

  return (
    <Pressable
      pointerEvents={thisRef.visible ? "box-only" : "box-none"}
      style={style}
      onPress={() => {
        console.log("thisRef.current=>", thisRef.current);
        thisRef.tooltip.toggleTooltip();
        onPress && onPress();
      }}
    >
      <Tooltip
        ref={(ref) => {
          getRef && getRef(ref);
          thisRef.tooltip = ref;
        }}
        onClose={() => {
          onClose && onClose(tooltipKey);
        }}
        onOpen={() => {
          onOpen && onOpen(tooltipKey);
        }}
        height={height}
        width={width}
        toggleOnPress={thisRef.visible}
        backgroundColor={Colors.pureWhite}
        overlayColor={Colors.shadow}
        // closeOnlyOnBackdropPress
        containerStyle={TooltipPanel.style.containerStyle}
        popover={
          <View style={TooltipPanel.style.popoverStyle}>
            <View style={[Classes.row, Classes.mainSpaceBetween]}>
              <View style={TooltipPanel.style.textStyle}>
                <Text h4>{title}</Text>
                <Text>{content}</Text>
              </View>

              <View style={TooltipPanel.style.dotWrapperStyle}>
                {allTooltips &&
                  Object.keys(allTooltips).length > 0 &&
                  Object.keys(allTooltips).map((e, i) => {
                    return (
                      <View
                        style={[
                          TooltipPanel.style.dotStyle,
                          i === tpIndex
                            ? TooltipPanel.style.dotActiveStyle
                            : TooltipPanel.style.dotInactiveStyle,
                        ]}
                      />
                    );
                  })}
              </View>
            </View>

            <View style={TooltipPanel.style.chipWrapperStyle}>
              <Chip
                onPress={() => {
                  thisRef.tooltip.toggleTooltip();
                }}
                buttonStyle={TooltipPanel.style.leftChipStyle}
                titleStyle={TooltipPanel.style.leftChipTextStyle}
                title={buttonSkipText}
              />
              <Chip
                buttonStyle={TooltipPanel.style.rightChipStyle}
                titleStyle={TooltipPanel.style.rightChipTextStyle}
                title={buttonNextText}
              />
            </View>
          </View>
        }
      >
        <View pointerEvents={thisRef.visible ? "none" : "box-none"} />
        {children}
      </Tooltip>
    </Pressable>
  );
};

TooltipPanel.style = Screen.ScaledSheet.create({
  containerStyle: {
    // ios
    shadowColor: Colors.BLACK_20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    shadowOpacity: 1,

    // android
    elevation: 8,

    // borderStyle: 'solid',
    // borderWidth: Screen.onePixel,
    // borderColor: Colors.BLACK_20,

    paddingHorizontal: "16@s",
  },
  popoverStyle: {
    ...Classes.fillColMain,
    ...Classes.mainSpaceAround,
    // padding: '16@s',
  },
  textStyle: {
    // paddingTop: '8@s',
    // paddingBottom: '8@s',
    paddingHorizontal: "16@s",
  },
  chipWrapperStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: 'red',
    // flex:1,
    paddingHorizontal: Metrics.baseMargin,
    width: "220@s",
  },

  dotWrapperStyle: {
    // width: '100%',
    flex: 0.5,
    flexDirection: "row",
    paddingTop: Metrics.baseMargin * 1.5,
    paddingRight: Metrics.baseMargin * 2,
    // alignItems: 'flex-end',
    justifyContent: "space-between",
  },
  dotStyle: {
    backgroundColor: Colors.PRIMARY_YELLOW,
    width: Metrics.baseMargin,
    height: Metrics.baseMargin,
    borderRadius: Metrics.baseMargin,
    // lineHeight: Metrics.baseMargin*2,
  },
  dotActiveStyle: {
    backgroundColor: Colors.PRIMARY_YELLOW,
  },
  dotInactiveStyle: {
    backgroundColor: Colors.ICE_BLUE,
  },

  leftChipStyle: {
    backgroundColor: Colors.ICE_BLUE,
    minWidth: "96@s",
    minHeight: "28@s",
    width: "auto",
  },
  leftChipTextStyle: {
    color: Colors.black,
    ...Fonts.style.small600,
  },
  rightChipStyle: {
    backgroundColor: Colors.PRIMARY_YELLOW,
    minWidth: "96@s",
    minHeight: "28@s",
    width: "auto",
  },
  rightChipTextStyle: {
    color: Colors.black,
    ...Fonts.style.small600,
  },
});

export default TooltipPanel;
