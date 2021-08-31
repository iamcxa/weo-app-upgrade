import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ModalCard from '~/Components/ModalCard';
import Colors from '~/Theme/Colors';
import { AppStateActions } from '~/Store';
import AvoidingView from '~/Components/DismissKeyboardView';
import { translate as t } from '~/Helpers/I18n';
import { ReportActions } from '~/Stores/index';
import { fetchAPI, apiAction, apiHandler } from '../utils/api';
import RadioButton from '../widget/RadioButton';
import Screen from '../utils/screen';
import { PrimaryBtn } from '../widget/RoundButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Screen.moderateScale(22),
    paddingBottom: Screen.moderateScale(28),
    paddingHorizontal: Screen.moderateScale(17),
  },
  optionList: {
    padding: Screen.moderateScale(11),
    height: Screen.moderateScale(160),
    marginBottom: Screen.moderateScale(0),
  },
  reasonContainer: {
    flex: 1,
    padding: Screen.moderateScale(11),
  },
  reasonLabel: {
    fontSize: Screen.moderateScale(24),
    marginBottom: Screen.moderateScale(14),
    fontWeight: '600',
    color: Colors.black,
  },
  reasonInput: {
    fontSize: Screen.moderateScale(18),
    color: Colors.pinkishGrey,
  },
});

class Report extends Component {
  static propTypes = {
    postType: PropTypes.string.isRequired,
    updateLoading: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    fetchReportPost: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {
    category: '這是詐騙內容',
    reason: '',
  };

  isActive = (label) => label === this.state.category;

  updateCategory = (category) => {
    this.setState({ category });
  };

  submit = async () => {
    const { fetchReportPost, id, postType } = this.props;
    const { category, reason } = this.state;
    if (postType) {
      const data = {
        category,
        reason,
      };
      fetchReportPost(postType, id, data);
    }
  };

  onChangeText = (text) => {
    this.setState({ reason: text });
  };

  render() {
    return (
      <ModalCard title={t('report_nav_bar_title')}>
        <View style={styles.container}>
          <AvoidingView keyboardVerticalOffset={Screen.moderateScale(100)}>
            <View style={styles.optionList}>
              <RadioButton
                label={t('report_category_option1')}
                active={this.isActive(t('report_category_option1'))}
                onPress={this.updateCategory}
              />
              <RadioButton
                label={t('report_category_option2')}
                active={this.isActive(t('report_category_option2'))}
                onPress={this.updateCategory}
              />
              <RadioButton
                label={t('report_category_option3')}
                active={this.isActive(t('report_category_option3'))}
                onPress={this.updateCategory}
              />
              <RadioButton
                label={t('report_category_option4')}
                active={this.isActive(t('report_category_option4'))}
                onPress={this.updateCategory}
              />
            </View>
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>{t('report_report_reason')}</Text>
              <AutoGrowingTextInput
                ref={(ref) => {
                  this.input = ref;
                }}
                onChangeText={this.onChangeText}
                multiline
                underlineColorAndroid="transparent"
                enableScrollToCaret
                placeholder={t('report_report_leave_reason')}
                style={styles.reasonInput}
              />
            </View>
          </AvoidingView>
          <PrimaryBtn
            onPress={this.submit}
            text="Report"
            style={{
              alignSelf: 'center',
              width: Screen.width - Screen.moderateScale(34),
            }}
          />
        </View>
      </ModalCard>
    );
  }
}

export default connect(
  (state, props) => {
    return {};
  },
  (dispatch) =>
    bindActionCreators(
      {
        fetchReportPost: ReportActions.fetchReportPost,
        updateLoading: AppStateActions.onLoading,
      },
      dispatch,
    ),
)(Report);
