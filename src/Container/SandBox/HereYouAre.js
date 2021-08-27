import React, { Component } from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from 'App/Theme/Colors';
import MainNavBar from 'App/Components/MainNavBar';
import TopicCard from 'App/Components/TopicCard';
import CollapsibleHeader from 'App/Components/CollapsibleHeader';
import Screen from '../../utils/screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortOptionRow: {
    flexDirection: 'row',
    marginTop: Screen.moderateScale(8),
    height: Screen.moderateScale(30),
  },
  sortOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sortOptionText: {
    fontSize: Screen.moderateScale(14),
    fontWeight: '500',
    letterSpacing: -0.34,
    color: Colors.warmGreyTwo,
    marginLeft: Screen.moderateScale(11),
    marginRight: Screen.moderateScale(11),
  },
  activeOptionText: {
    color: Colors.black,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: Screen.moderateScale(16),
    backgroundColor: 'transparent',
    shadowColor: '#00000019',
    shadowOffset: {
      width: 0,
      height: Screen.moderateScale(-1),
    },
    shadowRadius: Screen.moderateScale(6),
    shadowOpacity: 1,
    borderRadius: Screen.moderateScale(4),
    elevation: 1,
  },
  listContent: {
    paddingHorizontal: Screen.moderateScale(15),
    paddingVertical: Screen.moderateScale(10),
    borderRadius: Screen.moderateScale(4),
    backgroundColor: '#ffffff',
    zIndex: 99999,
  },
  separatorContainer: {
    width: '100%',
    height: Screen.moderateScale(3),
    justifyContent: 'center',
  },
  separator: {
    height: Screen.moderateScale(3),
    marginTop: Screen.moderateScale(-2),
    borderBottomWidth: Screen.moderateScale(1),
    borderColor: Colors.silverTwo,
  },
  listHeader: {},
});

const ListHeader = () => (
  <View style={styles.listHeader}>
    <MainNavBar
      title="最多靚人嗰付近"
      rightComponent={[
        <TouchableOpacity>
          <Icon
            name="ios-search"
            size={26}
            style={[styles.icon, { marginRight: Screen.moderateScale(12) }]}
          />
        </TouchableOpacity>,
        <TouchableOpacity>
          <Icon name="md-add" size={26} style={styles.icon} />
        </TouchableOpacity>,
      ]}
    />
    <View style={styles.sortOptionRow}>
      <TouchableOpacity style={styles.sortOption}>
        <Image
          source={{ uri: 'https://via.placeholder.com/19x30?text=i' }}
          style={{ width: 19, height: 30 }}
        />
        <Text style={[styles.sortOptionText, styles.activeOptionText]}>NEW TOPIC</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sortOption}>
        <Text style={styles.sortOptionText}>HOT TOPIC</Text>
        <Image
          source={{ uri: 'https://via.placeholder.com/19x30?text=i' }}
          style={{ width: 19, height: 30 }}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const Separator = () => <View style={styles.separator} />;

export default class HereYouAre extends Component {
  renderItem = ({ item, index }) => <TopicCard key={`TopicCard${index}`} {...item} />;

  render() {
    return (
      <CollapsibleHeader
        max={80}
        min={false}
        renderHeader={<ListHeader />}
        renderContent={
          <View style={styles.listContainer}>
            <FlatList
              // style={styles.listContainer}
              contentContainerStyle={styles.listContent}
              // ListEmptyComponent={}
              ItemSeparatorComponent={Separator}
              _keyExtractor={(item, index) => index}
              renderItem={this.renderItem}
              data={[
                {
                  title: '[片單] AAAAAAAAA',
                  time: '2018/05/23 03:02PM',
                  desc: '想請問有埋藏希臘神話梗在其中的電影，以希臘神話來暗喻或借代一部分的劇情，不是整...',
                  likeNumber: 10912,
                  onPress: () => {},
                },
                {
                  title: '[片單] BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
                  time: '2018/05/23 03:02PM',
                  desc: '想請問有埋藏希臘神話梗在其中的電影，以希臘神話來暗喻或借代一部分的劇情，不是整...',
                  likeNumber: 10912,
                  onPress: () => {},
                },
                {
                  title: '[片單] 有借代或暗喻希臘神話在其中的影片',
                  time: '2018/05/23 03:02PM',
                  desc: '想請問有埋藏希臘神話梗在其中的電影，以希臘神話來暗喻或借代一部分的劇情，不是整...',
                  likeNumber: 10912,
                  onPress: () => {},
                },
                {
                  title: '[片單] 有借代或暗喻希臘神話在其中的影片',
                  time: '2018/05/23 03:02PM',
                  desc: '想請問有埋藏希臘神話梗在其中的電影，以希臘神話來暗喻或借代一部分的劇情，不是整...',
                  likeNumber: 10912,
                  onPress: () => {},
                },
              ]}
            />
          </View>
        }
      />
    );
  }
}
