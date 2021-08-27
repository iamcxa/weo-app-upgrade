import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';

import { AndroidBackKey } from 'App/Components';
import { Screen, isIphoneX } from 'App/Helpers';
import { Colors } from 'App/Theme';
import IconButton from './IconButton';
import Modal from './BaseLightbox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pureWhite,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: Screen.moderateScale(6),
    shadowOpacity: Screen.moderateScale(1),
    shadowColor: Colors.black,
    marginTop: Screen.moderateScale(10),
    borderTopLeftRadius: Screen.moderateScale(10),
    borderTopRightRadius: Screen.moderateScale(10),
    elevation: 8,
  },
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Screen.moderateScale(16),
    paddingVertical: Screen.verticalScale(11),
    height: Screen.verticalScale(45),
    borderTopLeftRadius: Screen.moderateScale(10),
    borderTopRightRadius: Screen.moderateScale(10),
    backgroundColor: Colors.pureWhite,
    borderBottomWidth: Screen.moderateScale(1),
    borderColor: Colors.shadowColor,
    marginBottom: Screen.verticalScale(-5),
    // shadowOffset: {
    //   width: 0,
    //   height: 0
    // },
    // shadowRadius: Screen.moderateScale(6),
    // shadowOpacity: 1,
    elevation: 1,
  },
  headerTitle: {
    flex: 2,
    fontSize: Screen.moderateScale(17),
    fontWeight: '600',
    letterSpacing: -0.41,
    textAlign: 'center',
    justifyContent: 'center',
    color: Colors.blackThree,
  },
  childrenContainerStyle: {
    paddingTop: isIphoneX() ? Screen.verticalScale(10) : Screen.verticalScale(-30),
    paddingBottom: isIphoneX() ? Screen.verticalScale(15) : 0,
    paddingHorizontal: Screen.moderateScale(0),
    ...Platform.select({
      android: {
        height: '100%',
      },
    }),
  },
  headerWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButtonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightComponent: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
});

const ModalCard = ({ showBackButton, ...props }) => (
  <Modal
    childrenContainerStyle={styles.childrenContainerStyle}
    verticalPercent={1}
    horizontalPercent={1}
    {...props}
  >
    <AndroidBackKey onBackKeyPress={Actions.pop} />
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={styles.headerWrapper}>
          {showBackButton ? (
            <View style={styles.backButtonWrapper}>
              <IconButton
                iconName="md-close"
                iconType="Ionicons"
                iconColor={Colors.black}
                onPress={() => Actions.pop()}
              />
            </View>
          ) : (
            props.leftComponent
          )}
        </View>
        <Text style={styles.headerTitle}>{props.title}</Text>
        <View style={styles.rightComponent}>{props.rightComponent}</View>
      </View>
      {props.children}
    </View>
  </Modal>
);

ModalCard.propTypes = {
  showBackButton: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.any,
  rightComponent: PropTypes.any,
  leftComponent: PropTypes.any,
};

ModalCard.defaultProps = {
  showBackButton: true,
};

export default ModalCard;
