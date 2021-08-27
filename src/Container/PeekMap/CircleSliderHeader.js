import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Carousel from "react-native-snap-carousel";
import Screen from "App/utils/screen";
import Colors from "App/Theme/Colors";
import PropTypes from "prop-types";
import { SortOptionRow } from "App/Components/ListHeader";
import Pagination from "react-native-pagination";
import { Actions } from "react-native-router-flux";

const PAGINATION_DOT_ICON_NAME = "checkbox-blank-circle";

const SLIDER_WIDTH = 250;
const ITEM_WIDTH = 250;
const PAGINATION_PAD_SIZE = 2;
const PAGINATION_SIZE = (PAGINATION_PAD_SIZE + 1) * 2 + 1;

const renderItem = ({ item, index }) => (
  <View style={styles.slide}>
    <MaterialIcon
      name="eye-outline"
      size={26}
      color={Colors.pureWhite}
      style={{ marginTop: Screen.moderateScale(3) }}
    />
    <Text style={styles.slideTitle}>{item.name}</Text>
  </View>
);

const CircleSliderHeader = (props) => {
  const {
    sort,
    showNewest,
    showHottest,
    entries,
    activeSlide,
    onSnapToItem,
    onViewableItemsChanged,
    paginationVisibleItems,
    backToMap,
    getCarousel,
  } = props;

  const activeIndex = paginationVisibleItems[0]
    ? paginationVisibleItems[0].index
    : null;
  let padSize = 0;
  if (activeIndex !== null) {
    padSize =
      activeIndex <= PAGINATION_PAD_SIZE
        ? PAGINATION_PAD_SIZE * 2 + 1 - activeIndex
        : PAGINATION_PAD_SIZE;
  }
  if (entries.length < PAGINATION_SIZE) {
    padSize = Math.ceil(entries.length / 2);
  }
  return (
    <View style={[styles.container, { height: props.max }]}>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={(c) => {
            this._carousel = c;
            if (getCarousel) {
              getCarousel(c);
            }
          }}
          data={entries}
          renderItem={renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          onSnapToItem={onSnapToItem}
          onViewableItemsChanged={onViewableItemsChanged}
        />
        <Pagination
          horizontal
          pagingEnabled
          dotsContainerStyle={styles.paginationContainer}
          listRef={this.refs} // to allow React Native Pagination to scroll to item when clicked  (so add "ref={r=>this.refs=r}" to your list)
          paginationVisibleItems={paginationVisibleItems} // needs to track what the user sees
          paginationItems={entries} // pass the same list as data
          paginationItemPadSize={padSize} // num of items to pad above and below your visible items
          dotThemeLight
          startDotIconName={PAGINATION_DOT_ICON_NAME}
          endDotIconName={PAGINATION_DOT_ICON_NAME}
          dotIconNameEmpty={PAGINATION_DOT_ICON_NAME}
          dotIconNameNotActive={PAGINATION_DOT_ICON_NAME}
          dotIconNameActive={PAGINATION_DOT_ICON_NAME}
          dotTextHide
          startDotIconSize={5}
          endDotIconSize={5}
          edgeDotIconNotActiveSize={5}
          startDotIconHide={
            activeIndex === null || activeIndex <= PAGINATION_PAD_SIZE
          }
          endDotIconHide={
            activeIndex === null ||
            entries.length - activeIndex <= PAGINATION_PAD_SIZE + 1
          }
          // debugMode
          dotEmptyHide
          dotIconSizeNotActive={7}
          dotIconSizeActive={12}
          dotIconSizeEmpty={7}
          dotIconColorActive={Colors.mainYellow}
          dotIconColorNotActive={Colors.warmGrey}
          dotIconColorEmpty={Colors.warmGrey}
        />
        <TouchableOpacity style={styles.exitButton} onPress={backToMap}>
          <IoniconIcon name="md-close" size={30} color={Colors.pureWhite} />
        </TouchableOpacity>
      </View>
      <View>
        <SortOptionRow
          dark
          active={sort}
          showNewest={showNewest}
          showHottest={showHottest}
        />
      </View>
    </View>
  );
};

CircleSliderHeader.propTypes = {
  entries: PropTypes.array.isRequired,
  activeSlide: PropTypes.number.isRequired,
  onSnapToItem: PropTypes.func.isRequired,
  onViewableItemsChanged: PropTypes.func.isRequired,
  paginationVisibleItems: PropTypes.array.isRequired,
  showNewest: PropTypes.func.isRequired,
  showHottest: PropTypes.func.isRequired,
  backToMap: PropTypes.func.isRequired,
};

export default CircleSliderHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.black,
  },
  carouselContainer: {
    // flex: 1,
    width: "100%",
    height: Screen.moderateScale(77),
    backgroundColor: Colors.blackFour,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingTop: Screen.moderateScale(5),
    marginBottom: Screen.moderateScale(5),
  },
  paginationContainer: {
    paddingTop: Screen.moderateScale(5),
    width: "40%",
    alignSelf: "center",
  },
  exitButton: {
    position: "absolute",
    right: Screen.moderateScale(24),
    top: Screen.moderateScale(14),
  },
  dotContainer: {
    padding: 0,
    margin: 0,
    marginHorizontal: Screen.moderateScale(2),
  },
  dot: {
    // width: Screen.moderateScale(10),
    // height: Screen.moderateScale(10),
    borderRadius: 3,
    marginHorizontal: 0,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  slide: {
    width: "100%",
    height: Screen.moderateScale(40),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Screen.moderateScale(12),
  },
  slideTitle: {
    fontSize: Screen.moderateScale(16),
    paddingLeft: Screen.moderateScale(10),
    fontWeight: "600",
    alignSelf: "center",
    color: Colors.pureWhite,
  },
});
