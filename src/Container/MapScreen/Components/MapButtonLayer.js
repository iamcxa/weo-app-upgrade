import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";

import { TooltipPanel } from "~/Component";
import { Screen, t } from "~/Helper";
import { Classes, Colors, Fonts, Images, Metrics } from "~/Theme";

const MapButtonLayer = ({
  tooltip = {},
  sceneKey = "",
  navigation = {},
  updateTooltipVisibility = () => {},
  moveToUserLocation = () => {},
  ...props
}) => {
  const thisRef = React.useRef({}).current;
  const [visibleTooltip, setVisibleTooltip] = React.useState("");

  const handlers = {
    tpGetRef: (key) => (ref) => {
      thisRef[key] = ref;
    },
    tpOnOpen: (key) => {
      setVisibleTooltip(key);
    },
    tpOnClose: (key) => {
      setVisibleTooltip("");
      updateTooltipVisibility(sceneKey, key, false);
    },

    btnCircleRanking: () => {
      navigation.navigate("RankingModel");
    },
    btnCreateCircle: () => {
      // alert('button onPress');
    },
  };

  React.useEffect(() => {
    for (const tp of Object.keys(tooltip)) {
      if (tooltip[tp] && !visibleTooltip) {
        setTimeout(thisRef[tp].toggleTooltip, 250);
        break;
      }
    }
  }, [thisRef, tooltip, visibleTooltip]);

  return (
    <>
      <TooltipPanel
        getRef={handlers.tpGetRef("mapRankingVisible")}
        title={t("tooltip.new_feature")}
        content={t("tooltip.circle_creation")}
        onOpen={handlers.tpOnOpen}
        onClose={handlers.tpOnClose}
        style={MapButtonLayer.style.btnCircleRankingWrapper}
        visible={tooltip.mapRankingVisible}
        allTooltips={tooltip}
        tooltipKey="mapRankingVisible"
      >
        <Button
          buttonStyle={MapButtonLayer.style.btnCircleRanking}
          icon={<Images.SvgBtnRanking />}
          onPress={handlers.btnCircleRanking}
        />
      </TooltipPanel>

      <Button
        containerStyle={MapButtonLayer.style.btnMyLocationWrapper}
        buttonStyle={MapButtonLayer.style.btnMyLocation}
        icon={<Images.SvgBtnLocation />}
        onPress={moveToUserLocation}
      />

      <TooltipPanel
        getRef={handlers.tpGetRef("mapCreationVisible")}
        title={t("tooltip.new_feature")}
        content={t("tooltip.circle_creation")}
        onOpen={handlers.tpOnOpen}
        onClose={handlers.tpOnClose}
        style={MapButtonLayer.style.btnCreateCircleWrapper}
        visible={tooltip.mapCreationVisible}
        allTooltips={tooltip}
        tooltipKey="mapCreationVisible"
      >
        <Button
          buttonStyle={MapButtonLayer.style.btnCreateCircle}
          icon={<Images.SvgBtnCreateCircle />}
          onPress={handlers.btnCreateCircle}
        />
      </TooltipPanel>
    </>
  );
};

MapButtonLayer.style = Screen.ScaledSheet.create({
  containerStyle: {},

  btnCircleRankingWrapper: {
    position: "absolute",
    top: "16@s",
    right: "16@s",
  },
  btnCircleRanking: {
    height: "44@s",
    width: "44@s",
    borderRadius: "22@s",
    backgroundColor: "white",
  },

  btnMyLocationWrapper: {
    position: "absolute",
    bottom: "86@s",
    right: "16@s",
  },
  btnMyLocation: {
    height: "44@s",
    width: "44@s",
    borderRadius: "22@s",
    backgroundColor: "white",
  },

  btnCreateCircleWrapper: {
    position: "absolute",
    bottom: "16@s",
    right: "16@s",
  },
  btnCreateCircle: {
    height: "48@s",
    width: "48@s",
    borderRadius: "27@s",
    backgroundColor: Colors.mainYellow,
  },
});

export default MapButtonLayer;
