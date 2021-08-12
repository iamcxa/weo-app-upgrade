import { get } from 'lodash';
import { Alert } from 'react-native';
import { ReactNativeAlert } from '@udea-io/axios-wrapper';
import { translate as t } from '~/Helper/I18n';

export const showServiceUnavailableAlert = (response, callback) =>
  ReactNativeAlert.ServiceUnavailableAlert({
    btnOk: t('api.button.ok'),
    btnMore: t('api.button.more'),
    title: t('api.unavailable.title'),
    desc: t('api.unavailable.desc'),
  })(response, callback);

export const showApiExceptionAlert = (response, callback) =>
  ReactNativeAlert.ApiExceptionAlert({
    btnOk: t('api.button.ok'),
    btnMore: t('api.button.more'),
    title: t('api.unavailable.title'),
    desc: t('api.unavailable.des'),
  })(response, callback);

export default {
  showServiceUnavailableAlert,
  showApiExceptionAlert,
};
