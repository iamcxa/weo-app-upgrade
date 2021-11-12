import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";

import { Screen, t } from "~/Helper";
import { Classes, Colors, Fonts, Images, Metrics } from "~/Theme";
import { TooltipPanel } from "~/Component";

const MapButtonLayer = ({
  tooltip = {},
  sceneKey = "",
  navigation = {},
  updateTooltipVisibility = () => {},
  moveToUserLocation = () => {},
  ...props
}) => {
  const thisRef = React.useRef({}).current;
  return (
    <>
      <TooltipPanel
        title={t("tooltip.new_feature")}
        content={t("tooltip.circle_creation")}
        visible={tooltip.mapRankingVisible}
        allTooltips={tooltip}
        tooltipKey="mapRankingVisible"
        // onPress={() => {
        //   navigation.navigate('RankingModel')
        //   // updateTooltipVisibility(sceneKey, 'mapRankingVisible', !tooltip.mapRankingVisible);
        // }}
        onClose={() => {
          // alert('onClose');
          navigation.navigate("RankingModel");
          updateTooltipVisibility(
            sceneKey,
            "mapRankingVisible",
            !tooltip.mapRankingVisible
          );
        }}
        style={{
          position: "absolute",
          top: Screen.scale(16),
          right: Screen.scale(16),
        }}
      >
        <Button
          buttonStyle={{
            height: 44,
            width: 44,
            borderRadius: 27,
            backgroundColor: "white",
          }}
          icon={<Images.SvgBtnRanking />}
          onPress={() => navigation.navigate("RankingModel")}
        />
      </TooltipPanel>
      <Button
        containerStyle={{
          position: "absolute",
          bottom: 86,
          right: 16,
        }}
        buttonStyle={{
          height: 44,
          width: 44,
          borderRadius: 27,
          backgroundColor: "white",
        }}
        icon={<Images.SvgBtnLocation />}
        onPress={moveToUserLocation}
      />

      <TooltipPanel
        title={t("tooltip.new_feature")}
        content={t("tooltip.circle_creation")}
        visible={tooltip.mapCreationVisible}
        allTooltips={tooltip}
        tooltipKey="mapCreationVisible"
        onPress={() => {
          updateTooltipVisibility(
            sceneKey,
            "mapCreationVisible",
            !tooltip.mapCreationVisible
          );
        }}
        // onOpen={() => alert('onOpen')}
        onClose={() => {
          alert("button onPress");
          updateTooltipVisibility(
            sceneKey,
            "mapCreationVisible",
            !tooltip.mapCreationVisible
          );
        }}
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        <Button
          buttonStyle={{
            height: 48,
            width: 48,
            borderRadius: 27,
            backgroundColor: Colors.mainYellow,
          }}
          icon={<Images.SvgBtnCreateCircle />}
          onPress={() => {
            alert("button onPress");
          }}
        />
      </TooltipPanel>
    </>
  );
};

MapButtonLayer.style = Screen.ScaledSheet.create({
  containerStyle: {},
});

export default MapButtonLayer;
