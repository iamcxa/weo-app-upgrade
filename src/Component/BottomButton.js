import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import RoundButton from '~/Components/Button';
import Colors from '~/Theme/Colors';
import Screen from '../utils/screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBtnContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: Screen.width,
    height: Screen.moderateScale(45),
    backgroundColor: Colors.turquoise,
  },
  text: {
    fontSize: Screen.moderateScale(18),
    fontWeight: 'bold',
    letterSpacing: -0.06,
  },
  hr: {
    height: Screen.moderateScale(35),
    width: 1,
    borderLeftWidth: Screen.onePixel * 1,
    borderColor: Colors.whiteThree,
  },
});

const defaultProps = {};
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  btnArray: PropTypes.array,
};

const BottomButton = (props) => {
  const { style, btnArray } = props;
  const btn = [];
  btnArray.forEach((btnProps, i) => {
    btn.push(
      <View style={styles.container} key={`bottomBtm${i}`}>
        <RoundButton
          onPress={btnProps.onPress}
          text={btnProps.text}
          textColor={Colors.white}
          textStyle={btnProps.textStyle}
          btnColor={Colors.turquoise}
          btnStyle={{ width: Screen.width / btnArray.length }}
        />
      </View>,
    );
    if (i < btnArray.length - 1) {
      btn.push(<View key={`hr${i}`} style={styles.hr} />);
    }
  });
  return <View style={[styles.bottomBtnContainer, style]}>{btn}</View>;
};

BottomButton.propTypes = propTypes;
BottomButton.defaultProps = defaultProps;
export default BottomButton;
