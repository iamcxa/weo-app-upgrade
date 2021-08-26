import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Screen from '../utils/screen';
import Colors from 'App/Theme/Colors';
import { H4 } from '../widget/Label';
import Images from 'App/Theme/Images';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    // width: Screen.moderateScale(120),
    // width: '31%',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: Screen.moderateScale(15),
    // width: Screen.width * 0.3,
    paddingBottom: Screen.moderateScale(13),
    paddingTop: Screen.moderateScale(13),
    // backgroundColor: 'red',
    // paddingRight: Screen.moderateScale(10),
    // paddingLeft: Screen.moderateScale(10),
  },
  item: {
    height: Screen.moderateScale(50),
    width: Screen.moderateScale(50),
    borderRadius: Screen.moderateScale(50) / 2,
    borderColor: Colors.mainBlue,
    borderWidth: Screen.moderateScale(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    // backgroundColor: 'red'
  },
});

export default class HomeActionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.btnClick = false;
  }

  render() {
    return (
      <TouchableOpacity
        style={[
          this.props.style,
          styles.container,
          this.props.isActive ? { backgroundColor: Colors.backgroundColor } : {},
        ]}
        onPress={() => {
          if (!this.btnClick) {
            this.btnClick = true;
            if (this.props.onPress) {
              this.props.onPress();
            }
            setTimeout(() => {
              this.btnClick = false;
            }, 1000);
          }
        }}
      >
        <View style={styles.item}>
          <Image
            style={{
              height: Screen.moderateScale(30),
              width: Screen.moderateScale(30),
              tintColor: Colors.subBlue,
            }}
            source={this.props.image}
          />
        </View>
        <View style={{ paddingRight: 2, paddingLeft: 2 }}>
          <H4 style={{ textAlign: 'center' }}>{this.props.title}</H4>
        </View>
      </TouchableOpacity>
    );
  }
}

HomeActionItem.propTypes = {
  title: PropTypes.string,
  image: PropTypes.any,
  onPress: PropTypes.func,
  isActive: PropTypes.bool,
};

HomeActionItem.defaultProps = {
  title: '',
  onPress: () => {},
};
