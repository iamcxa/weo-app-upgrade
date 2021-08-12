import { get } from 'lodash';
import { Alert } from 'react-native';
import {
  ServiceUnavailableAlert,
  ApiExceptionAlert,
} from '@udea-io/axios-wrapper/alert/react-native';
import { t } from '~/Helper';

export const showServiceUnavailableAlert = (response, callback) =>
  ServiceUnavailableAlert({
    btnOk: t('api.button.ok'),
    btnMore: t('api.button.more'),
    title: t('api.unavailable.title'),
    desc: t('api.unavailable.desc'),
  })(response, callback);

export const showApiExceptionAlert = (response, callback) =>
  ApiExceptionAlert({
    btnOk: t('api.button.ok'),
    btnMore: t('api.button.more'),
    title: t('api.unavailable.title'),
    desc: t('api.unavailable.des'),
  })(response, callback);

export default {
  showServiceUnavailableAlert,
  showApiExceptionAlert,
};
