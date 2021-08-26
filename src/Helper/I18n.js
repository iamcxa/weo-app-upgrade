import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { memoize } from 'lodash';
import { I18nManager } from 'react-native';

import Locales from '~/Locale';

// eslint-disable-next-line import/no-mutable-exports
export let languageTag = 'en';

export const translate = memoize(
  (key, config = Locales[languageTag]().DEFAULT_VALUES) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = () => {
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(Localization.isRTL);

  // find best language
  languageTag = Object.keys(Locales).find((e) => Localization.locale.includes(e)) || 'en';

  // set i18n-js config
  i18n.translations = {
    [languageTag]: Locales[languageTag](),
    en: Locales.en(),
  };
  i18n.locale = languageTag;
  i18n.fallbacks = true;

  return languageTag;
};

export default {
  setI18nConfig,
  languageTag,
  translate,
  t: translate,
};
