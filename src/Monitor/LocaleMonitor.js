import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Localization from 'expo-localization';
import { AppState } from 'react-native';
import { setI18nConfig } from '~/Helper/I18n';
import { AppStateActions } from '~/Store/Actions';

// kick-off i18n config
const currentUsedLanguageTag = setI18nConfig();

export default () => {
  const dispatch = useDispatch();

  const forceUpdate = React.useReducer((boolean) => !boolean)[1];

  const latestAppState = React.useRef(AppState.currentState);

  const { locale: savedLocale } = useSelector((state) => state.appState.localization);

  const handleLocaleChange = async (locale) => {
    const localization = await Localization.getLocalizationAsync();

    if (savedLocale !== localization.locale) {
      localization.currentUsedLanguageTag = locale || setI18nConfig();
      dispatch(AppStateActions['app/onLocaleUpdate'](localization));
      forceUpdate();
    }
  };

  const handleAppStateChange = async (newState) => {
    if (latestAppState.current.match(/inactive|background/) && newState === 'active') {
      // console.log('LocaleMonitor: App has come to the foreground!')
      await handleLocaleChange();
    } else {
      // console.log('LocaleMonitor: App has gone to the background!')
      // do something in background
    }
  };

  React.useEffect(() => {
    handleLocaleChange(currentUsedLanguageTag);

    AppState.addEventListener('change', handleAppStateChange);

    return () => AppState.removeEventListener('change', handleAppStateChange);
  });
  return null;
};
