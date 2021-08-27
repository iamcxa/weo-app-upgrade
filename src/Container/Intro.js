import React, { Component } from 'react';
import { StyleSheet, View, Image, ScrollView, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '~/Theme/Colors';
import FooterLogo from '~/Components/FooterLogo';
import { H1, H5 } from '../widget/Label';
import Screen from '../utils/screen';
import { PrimaryBtn } from '../widget/RoundButton';

const TOTAL_PAGES = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  label: {
    fontWeight: '700',
    lineHeight: parseInt(Screen.moderateScale(36), 10),
    color: Colors.black,
    textAlign: 'center',
  },
});

export default class Intro extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      allRead: false,
    };
  }

  componentDidUpdate = (prevState, prevProps) => {
    if (this.state.currentPage === TOTAL_PAGES - 1 && !this.state.allRead) {
      this.setState({ allRead: true });
    }
  };

  onScroll(e) {
    const x = Math.floor(e.nativeEvent.contentOffset.x);
    const screenWidth = Math.floor(Screen.width);
    const currentPage = Math.floor(x / screenWidth);
    if (this.state.currentPage != currentPage) {
      this.setState({
        currentPage,
      });
    }
  }

  nextPage = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({
        x: Screen.width * (this.state.currentPage + 1),
      });
    }
  };

  continue = () => {
    Actions.privacy();
    // await setItem(Storage.FIRST_USE, false);
    // Actions.auth({ type: 'reset' });
  };

  handleButton = () => {
    if (this.state.currentPage < TOTAL_PAGES - 1 && !this.state.allRead) {
      this.nextPage();
    } else {
      this.continue();
    }
  };

  render() {
    const dot = (props) => (
      <View
        style={{
          backgroundColor: props.selected ? Colors.mainYellow : Colors.silver,
          height: Screen.moderateScale(10),
          width: Screen.moderateScale(10),
          borderRadius: Screen.moderateScale(5),
          padding: Screen.moderateScale(1),
          margin: Screen.moderateScale(10),
        }}
      />
    );

    return (
      <View style={[styles.container, {}]}>
        <StatusBar backgroundColor={Colors.paleGrey} barStyle="dark-content" />
        <ScrollView
          style={{ flex: 0.6 }}
          contentContainerStyle={{}}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={(e) => this.onScroll(e)}
          ref={(scrollView) => (this.scrollView = scrollView)}
        >
          <View
            style={{
              width: Screen.width,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: Screen.moderateScale(45),
              }}
            >
              <Image
                source={require('~/Assets/Images/intro/intro-1.png')}
                style={{
                  width: Screen.width * 0.7,
                  height: (Screen.width * 0.7 * 182) / 257,
                  marginLeft: 15,
                }}
              />
            </View>
            <View
              style={{
                paddingHorizontal: Screen.moderateScale(20),
              }}
            >
              <H1 style={styles.label}>WeO 將地球分成唔同嘅 Circle ，</H1>
              <H1 style={styles.label}>每個 Circle 都係一個獨立嘅討論區。</H1>
              <H1 style={styles.label}>外圍嘅人唔會睇到入面講緊啲乜。</H1>
            </View>
          </View>
          <View
            style={{
              width: Screen.width,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: Screen.moderateScale(45),
              }}
            >
              <Image
                source={require('~/Assets/Images/intro/intro-2.png')}
                style={{
                  width: Screen.moderateScale(284),
                  height: Screen.moderateScale(181),
                }}
              />
            </View>
            <View
              style={{
                paddingHorizontal: Screen.moderateScale(30),
              }}
            >
              <H1 style={styles.label}>WeO 令所有人都可以講真心話。 唔需要登入，更唔需要密碼，</H1>
              <H1 style={styles.label}>只要知道你喺邊，就可以玩。</H1>
            </View>
          </View>
          <View
            style={{
              width: Screen.width,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: Screen.moderateScale(45),
              }}
            >
              <Image
                source={require('~/Assets/Images/intro/intro-3.png')}
                style={{
                  width: Screen.moderateScale(241),
                  height: Screen.moderateScale(191),
                }}
              />
            </View>
            <View
              style={{
                paddingHorizontal: Screen.moderateScale(30),
                // height: Screen.moderateScale(144),
                // marginTop: Screen.moderateScale(-50)
              }}
            >
              <H1 style={styles.label}>
                WeO 絕不歡迎人身攻擊， 所以有舉報功能，幫助大家維持秩序。
              </H1>
              <H1 style={styles.label}>清楚？咁就一齊 WeO !</H1>
            </View>
          </View>
        </ScrollView>
        <View style={{ flex: 0.4, justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingBottom: Screen.moderateScale(18),
              }}
            >
              {dot({ selected: this.state.currentPage === 0 })}
              {dot({ selected: this.state.currentPage === 1 })}
              {dot({ selected: this.state.currentPage === 2 })}
            </View>
            <PrimaryBtn
              onPress={this.handleButton}
              text={this.state.allRead ? '開始傾' : '下一步'}
              style={{ width: Screen.width - Screen.moderateScale(34) }}
            />
          </View>
          <FooterLogo />
        </View>
      </View>
    );
  }
}
