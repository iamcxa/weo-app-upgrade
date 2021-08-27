import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Text, StyleSheet, View, FlatList } from "react-native";

import { translate as t } from "App/Helpers/I18n";
import { MainNavBar, AndroidBackKey } from "App/Components";
import { Screen } from "App/Helpers";
import { Classes, Colors, Metrics } from "App/Theme";

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: Colors.pureWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: Screen.moderateScale(30),
    paddingVertical: Screen.moderateScale(12),
    backgroundColor: Colors.paleGrey,
  },
  listItem: {
    marginBottom: Metrics.baseMargin * 2,
  },
  question: {
    fontSize: Screen.moderateScale(16),
    color: Colors.greyishBrownTwo,
    fontWeight: "600",
  },
  answer: {
    fontSize: Screen.moderateScale(14),
    color: Colors.greyishBrownTwo,
  },
  separator: {
    marginRight: Metrics.baseMargin,
    width: Screen.moderateScale(6),
    height: Screen.moderateScale(6),
    backgroundColor: Colors.mainYellow,
    marginVertical: Screen.moderateScale(15),
  },
});

const Separator = (props) => <View style={styles.separator} />;

class FaqScreen extends React.PureComponent {
  static propTypes = {
    sceneKey: PropTypes.string.isRequired,
  };

  state = {
    data: [
      {
        question: t("faq_question_1"),
        answer: t("faq_question_1_answer"),
      },
      {
        question: t("faq_question_2"),
        answer: t("faq_question_2_answer"),
      },
      {
        question: t("faq_question_3"),
        answer: t("faq_question_3_answer"),
      },
      {
        question: t("faq_question_4"),
        answer: t("faq_question_4_answer"),
      },
      {
        question: t("faq_question_5"),
        answer: t("faq_question_5_answer"),
      },
    ],
  };

  renderItem = ({ item }) => {
    // console.log('data', item);
    return (
      <View style={styles.listItem}>
        <View style={Classes.rowCross}>
          <Separator />
          <Text style={styles.question}>{item.question}</Text>
        </View>
        <Text style={styles.answer}>{item.answer}</Text>
      </View>
    );
  };

  render() {
    const { sceneKey } = this.props;
    return (
      <View style={Classes.fill}>
        <MainNavBar
          showLeftBlock
          title={t("faq_freq_question")}
          style={styles.navBar}
        />
        <AndroidBackKey backTo="profile_view" sceneKey={sceneKey} />
        <FlatList
          contentContainerStyle={styles.content}
          // ItemSeparatorComponent={Separator}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
          data={this.state.data}
        />
      </View>
    );
  }
}

export default connect((state, param) => ({
  //       routeName: state.appRoute.routeName,
  sceneKey: param.name,
}))(FaqScreen);