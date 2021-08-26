import React from "react";
import {
  Image,
  Text,
  View,
  Platform,
  Keyboard,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { bindActionCreators } from "redux";
import { debounce, throttle, isEmpty } from "lodash";

import Config from "App/Config";
import { ifIphoneX } from "App/Helpers";
import { SearchActions } from "App/Stores";
import { translate as t } from "App/Helpers/I18n";
import { Classes, Colors, Images, Metrics } from "App/Theme";
import {
  ModalCard,
  SearchListItem,
  ComposedTextInput,
  DismissKeyboardView,
} from "App/Components";

import styles from "./SearchScreenStyle";

const { ON_END_REACHED_THROTTLE } = Config;

class SearchScreen extends React.Component {
  static propTypes = {
    fetchGetPopularKeywords: PropTypes.func.isRequired,
    fetchGetSearchResult: PropTypes.func.isRequired,
    updateSearchStore: PropTypes.func.isRequired,
    belongsTo: PropTypes.string.isRequired,
    poplarKeyWords: PropTypes.array,
    searchResult: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    poplarKeyWords: [],
    searchResult: [],
  };

  state = {
    search: "",
    refreshTextInput: false,
  };

  componentDidMount() {
    const { fetchGetPopularKeywords, belongsTo } = this.props;
    fetchGetPopularKeywords({ belongsTo });

    if (this.searchField) {
      this.searchField.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { belongsTo, updateSearchStore } = this.props;

    if (belongsTo !== prevProps.belongsTo) {
      updateSearchStore({
        searchResult: [],
      });
    }
  }

  sendSearchAPI = debounce(() => {
    const { fetchGetSearchResult, belongsTo } = this.props;
    const { search } = this.state;
    if (!isEmpty(search)) {
      fetchGetSearchResult({ belongsTo, keyword: search });
    }
  }, 600);

  onResultListEndReached = throttle(() => {
    console.log("on end reached");
  }, ON_END_REACHED_THROTTLE);

  onChangeText = (text) => {
    // pattern 為所謂的特殊字元
    const pattern = new RegExp(
      "[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}    【】‘；：”“'。，、？]"
    );
    console.log("text, =>", text);
    if (pattern.test(text)) {
      text = "";
      return false;
    }
    this.setState({ search: text }, () => {
      const { updateSearchStore } = this.props;
      if (isEmpty(text)) {
        updateSearchStore({
          searchResult: [],
        });
      } else {
        this.sendSearchAPI();
      }
    });
  };

  onKeywordPress = (text) => {
    this.setState({ refreshTextInput: true, search: text }, () => {
      this.sendSearchAPI();
      setTimeout(() => {
        this.setState({ refreshTextInput: false });
      }, 700);
    });
  };

  onResultListScroll = () => {
    Keyboard.dismiss();
  };

  popularKeyExtractor = (item, index) => index;

  searchResultKeyExtractor = (item) => item.id;

  renderListEmptyComponent = () => (
    <View style={styles.listEmptyContainer}>
      <Text style={styles.listEmptyMessage}>{t("search_list_empty")}</Text>
    </View>
  );

  render() {
    const { poplarKeyWords, searchResult, belongsTo, isLoading } = this.props;
    const { search, refreshTextInput } = this.state;
    return (
      <ModalCard title={`${t("search_nav_bar_title")}`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          // style={Classes.fill}
          style={styles.content}
          keyboardVerticalOffset={Platform.select({
            ios: ifIphoneX(Metrics.baseMargin * 2, 0),
            android: 0,
          })}
        >
          <View style={styles.inputWrapper}>
            <Image source={Images.search} style={styles.searchIcon} />
            {
              <ComposedTextInput
                ref={(ref) => {
                  this.searchField = ref;
                }}
                value={search}
                autoCapitalize="none"
                placeholder="Search"
                onChangeText={this.onChangeText}
                placeholderTextColor={Colors.pinkishGrey}
                style={styles.searchInput}
                underlineColorAndroid="transparent"
              />
            }
          </View>
          {search.length === 0 && (
            <FlatList
              style={styles.hotSearchList}
              data={poplarKeyWords}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.hotSearchListItem}
                  onPress={() => {
                    this.onKeywordPress(item);
                  }}
                  hitSlop={{
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                  }}
                >
                  <Text style={styles.hotSearchKeyword}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          {search.length > 0 && (
            <FlatList
              style={styles.hotSearchList}
              data={searchResult}
              keyExtractor={this.searchResultKeyExtractor}
              onEndReached={this.onResultLisEndReached}
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                !isLoading && !refreshTextInput && this.renderListEmptyComponent
              }
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={this.onRefresh}
                />
              }
              renderItem={({ item }) =>
                !isLoading && (
                  <SearchListItem
                    searchWords={[search]}
                    itemData={item}
                    belongsTo={belongsTo}
                  />
                )
              }
              onScrollBeginDrag={this.onResultListScroll}
            />
          )}
        </KeyboardAvoidingView>
      </ModalCard>
    );
  }
}

export default connect(
  (state, props) => ({
    isLoading: state.appState.isLoading,
    poplarKeyWords: state.search.poplarKeyWords,
    searchResult: state.search.searchResult,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchGetPopularKeywords: SearchActions.fetchGetPopularKeywords,
        fetchGetSearchResult: SearchActions.fetchGetSearchResult,
        updateSearchStore: SearchActions.updateSearchStore,
      },
      dispatch
    )
)(SearchScreen);
