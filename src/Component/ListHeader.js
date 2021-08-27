import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Image, TouchableOpacity, ActivityIndicator, Text, View, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import PickerModal from 'react-native-picker-modal-view';

import { ifIphoneX, Screen, StyleSheet } from '~/Helpers';
import { Metrics, Colors, Images, Classes } from '~/Theme';
import { translate as t } from '~/Helpers/I18n';
import Config from '~/Config';
import ImageButton from './ImageButton';
import MainNavBar from './MainNavBar';

const { CIRCLE_TYPE } = Config;

const styles = StyleSheet.create({
  headerWrapper: {
    flex: 1,
  },
  searchButton: {
    padding: 2,
    marginRight: Screen.scale(16),
  },
  imageButton: {
    // marginHorizontal: Screen.scale(8),
  },
  mainNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOptionRow: {
    marginTop: Metrics.baseVerticalMargin,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sortOption: {
    paddingHorizontal: Screen.scale(28),
    alignItems: 'center',
    flexDirection: 'row',
  },
  sortOptionText: {
    fontSize: Screen.scale(14),
    fontWeight: '500',
    letterSpacing: -0.34,
    color: Colors.warmGreyTwo,
    marginLeft: Screen.scale(11),
    marginRight: Screen.scale(11),
  },
  activeOptionText: {
    color: Colors.black,
    fontWeight: 'bold',
  },
  activeOptionTextForPeek: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    flex: 1,
    // marginLeft: Screen.scale(-Metrics.baseMargin * 5),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        paddingTop: Screen.scale(-Metrics.baseMargin / 2),
      },
    }),
  },
  favCircle: {
    marginLeft: Screen.scale(-20),
  },
  titleWrapper: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    paddingTop: Screen.verticalScale(Metrics.baseMargin),
    paddingHorizontal: Screen.verticalScale(Metrics.baseMargin * 2),
  },
  titleCircle: {
    color: Colors.black,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: Screen.scale(18),
    width: '100%',
    ...Platform.select({
      android: {
        marginTop: Screen.scale(-Metrics.baseMargin / 4),
      },
    }),
    // flex: 1,
  },
  icon: {
    width: Screen.scale(26),
    height: Screen.verticalScale(26),
  },
  titleComponentPickerListItem: {
    borderBottomWidth: 1,
    // borderColor: '#ddd',
    borderColor: Colors.silverThree,
  },
  titleComponentPickerListItemText: {
    padding: 15,
  },
});

const TitleComponent = ({ insideCircles = [], selectedCircle = {}, onSwitchCircle }) => {
  return (
    <View style={styles.pickerWrapper}>
      {!isEmpty(selectedCircle) ? (
        <PickerModal
          renderSelectView={(disabled, selected, showModal) => (
            <TouchableOpacity onPress={showModal} style={styles.titleWrapper}>
              <Text style={styles.titleCircle} numberOfLines={1}>
                {'📍'}
                {selectedCircle.name}
              </Text>
              <Icon name="ios-arrow-down" size={20} style={styles.icon} />
            </TouchableOpacity>
          )}
          renderListItem={(selectedItem, item) => (
            <View style={styles.titleComponentPickerListItem}>
              <Text
                style={[
                  styles.titleComponentPickerListItemText,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontWeight: selectedItem.Name === item.Name ? 'bold' : '100',
                  },
                ]}
              >
                {item.Name}
                {selectedItem.Name === item.Name ? '✅' : ''}
              </Text>
            </View>
          )}
          onSelected={onSwitchCircle}
          items={insideCircles.map((e) => ({
            Name: e.name,
            Value: e.id,
            Id: e.id,
            rawCircleData: e,
          }))}
          selected={selectedCircle.id}
          searchPlaceholderText="Pick a circle"
          requireSelection={false}
          autoSort={false}
        />
      ) : null}
    </View>
  );
};

TitleComponent.propTypes = {
  insideCircles: PropTypes.array,
  selectedCircle: PropTypes.object,
  onSwitchCircle: PropTypes.func.isRequired,
};

TitleComponent.defaultProps = {
  insideCircles: [],
  selectedCircle: {},
};

export const SortOptionRow = ({ showNewest, showHottest, active, dark }) => (
  <View style={styles.sortOptionRow}>
    <TouchableOpacity style={styles.sortOption} onPress={showNewest}>
      <Image
        source={active === 'newest' ? Images.herePin_active : Images.herePin}
        style={{
          width: Screen.scale(19),
          height: Screen.scale(30),
        }}
      />
      <Text
        style={[
          styles.sortOptionText,
          active === 'newest' && styles.activeOptionText,
          dark && active === 'newest' && styles.activeOptionTextForPeek,
        ]}
      >
        {t('topic_list_label_newest')}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.sortOption} onPress={showHottest}>
      <Text
        style={[
          styles.sortOptionText,
          active === 'hottest' && styles.activeOptionText,
          dark && active === 'hottest' && styles.activeOptionTextForPeek,
        ]}
      >
        {t('topic_list_label_hottest')}
      </Text>
      <Image
        source={active === 'hottest' ? Images.herePin_active : Images.herePin}
        style={{
          width: Screen.scale(19),
          height: Screen.scale(30),
        }}
      />
    </TouchableOpacity>
  </View>
);

SortOptionRow.propTypes = {
  insideCircles: PropTypes.array,
  selectedCircle: PropTypes.object,
  showNewest: PropTypes.func.isRequired,
  showHottest: PropTypes.func.isRequired,
  active: PropTypes.string,
  dark: PropTypes.bool,
};

SortOptionRow.defaultProps = {
  insideCircles: [],
  selectedCircle: {},
  dark: false,
};

const ListHeader = ({
  belongsTo,
  insideCircles,
  selectedCircle,
  homeCircle,
  onSwitchCircle,
  showHottest,
  showNewest,
  active,
  isLoading,
}) => {
  // console.log('belongsTo=>', belongsTo);
  return (
    <View style={styles.headerWrapper}>
      <MainNavBar
        titleComponent={
          belongsTo === 'HERE_YOU_ARE'
            ? TitleComponent({
                insideCircles,
                selectedCircle,
                onSwitchCircle,
              })
            : belongsTo === 'THERE_YOU_ARE' && (
                <Text style={[styles.titleCircle, styles.favCircle]}>
                  {`❤️ ${homeCircle && homeCircle.name}`}
                </Text>
              )
        }
        rightComponent={
          <>
            {((!isEmpty(selectedCircle) && belongsTo === CIRCLE_TYPE.HERE_YOU_ARE) ||
              (!isEmpty(homeCircle) && belongsTo === CIRCLE_TYPE.THERE_YOU_ARE)) && (
              <ImageButton
                key="btnSearch"
                onPress={() =>
                  Actions.SearchScreen({
                    belongsTo,
                  })
                }
                style={styles.searchButton}
                source={Images.search}
                imageStyle={[styles.icon]}
              />
            )}
            <ImageButton
              key="btnPeek"
              style={styles.imageButton}
              onPress={Actions.peekMapView}
              source={Images.navEye}
              imageStyle={[styles.icon]}
            />
          </>
        }
        leftComponent={
          <>
            <ImageButton
              key="btnVoice"
              style={styles.imageButton}
              onPress={Actions.voiceView}
              source={Images.navMic}
              imageStyle={[styles.icon]}
            />
            {Platform.OS === 'ios' && (
              <ActivityIndicator
                style={{ marginLeft: Metrics.baseMargin }}
                color="black"
                size="small"
                animating={isLoading}
              />
            )}
          </>
        }
        style={styles.mainNavBar}
      />
      {(!isEmpty(selectedCircle) || !isEmpty(homeCircle)) && (
        <SortOptionRow active={active} showHottest={showHottest} showNewest={showNewest} />
      )}
    </View>
  );
};

ListHeader.propTypes = {
  insideCircles: PropTypes.array,
  selectedCircle: PropTypes.object,
  onSwitchCircle: PropTypes.func.isRequired,
  belongsTo: PropTypes.string.isRequired,
  showHottest: PropTypes.func.isRequired,
  showNewest: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
  homeCircle: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
};

ListHeader.defaultProps = {
  insideCircles: [],
  selectedCircle: {},
  homeCircle: {},
};

export default ListHeader;
