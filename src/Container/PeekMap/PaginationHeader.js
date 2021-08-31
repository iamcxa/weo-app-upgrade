import React from 'react';
import { View, Text, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

import { Screen, StyleSheet } from '~/Helper';
import { Colors, Metrics, Classes } from '~/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '70@s',
    backgroundColor: Colors.blackFour,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    width: '100%',
    paddingHorizontal: Screen.scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: '100%',
    // marginBottom: Screen.scale(16),
    // backgroundColor: 'red',
  },
  exitButton: {
    // position: 'absolute',
    // left: Screen.scale(0),
    // top: Screen.scale(14),
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  circleTitle: {
    fontSize: Screen.scale(16),
    paddingLeft: Screen.scale(10),
    fontWeight: '600',
    alignSelf: 'center',
    color: Colors.pureWhite,
    minWidth: 'auto', // Screen.scale(120),
    maxWidth: Screen.scale(260),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Metrics.baseMargin * 2,
    // width: '80%',
  },
  icon: {
    marginTop: Screen.scale(0),
    marginLeft: Screen.scale(24),
    marginRight: Screen.scale(8),
  },
});

const PaginationHeader = (props) => {
  const { entries, activeSlide, backToMap, isFetching } = props;

  // const SLIDER_WIDTH = 340;
  // const ITEM_WIDTH = 340;
  // const PAGINATION_PAD_SIZE = 2;
  // const PAGINATION_SIZE = (PAGINATION_PAD_SIZE + 1) * 2 + 1;

  // const activeIndex = entries[activeSlide] ? entries[activeSlide].index : null;
  // let padSize = 0;
  // if (activeIndex !== null) {
  //   padSize =
  //     activeIndex <= PAGINATION_PAD_SIZE
  //       ? PAGINATION_PAD_SIZE * 2 + 1 - activeIndex
  //       : PAGINATION_PAD_SIZE;
  // }
  // if (entries.length < PAGINATION_SIZE) {
  //   padSize = Math.ceil(entries.length / 2);
  // }
  // padSize = entries.slice(activeSlide, activeSlide + 8);
  // const activeDotIndex = padSize.indexOf(entries[activeSlide]);
  // // console.log('entries[activeSlide]=>', entries[activeSlide]);
  // console.log('activeSlide=>', activeSlide);
  // console.log('activeDotIndex=>', activeDotIndex);
  // console.log('padSize=>', padSize);
  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.exitButton} onPress={backToMap}>
            <IoniconIcon name="md-close" size={30} color={Colors.pureWhite} />
          </TouchableOpacity>

          <View style={Classes.rowCenter}>
            <MaterialIcon
              name="eye-outline"
              size={26}
              color={Colors.pureWhite}
              style={styles.icon}
            />
            <Text style={styles.circleTitle} numberOfLines={2} ellipsizeMode="tail">
              {entries[activeSlide].name}
            </Text>
            {Platform.OS === 'ios' && isFetching && (
              <ActivityIndicator size="small" animating={isFetching} />
            )}
          </View>
        </View>
        {/* <Pagination
          dotsLength={entries.length}
          activeDotIndex={4}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.dot}
        /> */}
      </View>
    </View>
  );
};

PaginationHeader.propTypes = {
  entries: PropTypes.array.isRequired,
  activeSlide: PropTypes.number.isRequired,
  backToMap: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default PaginationHeader;
