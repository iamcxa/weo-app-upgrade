import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { translate as t } from '~/Helper/I18n';
import { Colors, Classes } from '~/Theme';
import { StyleSheet } from '~/Helper';

const styles = StyleSheet.create({
  cancelTextStyle: { color: Colors.red },
  optionTextStyle: { ...Classes.margin },
});

export default class BaseModalSelector extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
    animationType: PropTypes.string,
  };

  static defaultProps = {
    animationType: 'fade',
    children: null,
  };

  render() {
    const { children, animationType, ...props } = this.props;
    return (
      <ModalSelector
        {...props}
        optionTextStyle={styles.optionTextStyle}
        cancelTextStyle={styles.cancelTextStyle}
        animationType={animationType}
        cancelText={t('__cancel')}
      >
        {children}
      </ModalSelector>
    );
  }
}
