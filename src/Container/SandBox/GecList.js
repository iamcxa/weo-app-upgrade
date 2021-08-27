import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '~/Theme/Colors';
import Images from '~/Theme/Images';
import {
  ThreeLineListItem,
  RowStatusListItm,
  RightIconListItm,
  TowRowListItm,
} from '../../widget/ListItem';
import CheckBox from '../../widget/CheckBox';
import Screen from '../../utils/screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    // padding: 30
  },
});

export default class Gec3 extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      checked: false,
    };
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <ThreeLineListItem
          line1="居留返鄉證_申請"
          line2="案件編號：00105"
          line3="2017/9/30"
          right="所需文件"
        />
        {/* <ThreeLineListItem
          line1={'國外就學役男返台協助'}
          line2={'案件編號：00105'}
          line3={'2017/9/30'}
          disablePress
        /> */}
        <ThreeLineListItem
          line1="國外就學役男返台協助"
          line2="案件編號：00105"
          start="2017/9/30"
          end="2017/10/30"
        />
        <RowStatusListItm
          line1="護照影本護照影本護照影本護照影本護照影本護照影本"
          right="代收件"
          finish={false}
        />
        <RowStatusListItm finish line1="舊護照" right="" />
        {/* <RightIconListItm
          line1={'Clinical and Provincial Hospital of Barcelona'}
          line2={'Carrer de Villarroel, 170, 08036 Barcelona, Spain '}
          icon1={Images.gps}
          icon1OnPress={() => {}}
          icon2={Images.phone}
          icon2OnPress={() => {}}
        /> */}
        <RightIconListItm
          line1="Hospital QuirónSalud Valencia Emergency (General/ Pediatric/ Obstetrics and gynaecology/ Ophhalmology/ Traumatology)/ General Medical (General Hospital)"
          line2="Avenida de Las Lagunas, 4, 28981 Parla, Madrid, Comunidad de Madrid, España"
          icon1={Images.gps}
          icon1OnPress={() => {}}
          icon2={Images.phone}
          icon2OnPress={() => {}}
        />
        <RightIconListItm
          line1="馬德里 1"
          line2="Plaça de Cisneros,46003 València"
          icon1={Images.gps}
          icon1OnPress={() => {}}
        />
        <TowRowListItm
          notify
          line1="Military"
          line2="Still have to turn in 3 papers Still have to turn in 3 papers Still have to turn in 3 papers Still have to turn in 3 papers"
          right="2017/9/28"
        />
        <TowRowListItm line1="Military" line2="Still have to turn in 3 papers" right="2017/9/28" />
      </ScrollView>
    );
  }
}
