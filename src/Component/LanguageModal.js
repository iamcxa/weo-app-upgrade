import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import Config from 'App/Config';
import { translate as t } from 'App/Helpers/I18n';
import { Fonts, Colors, Classes } from 'App/Theme';
import { BaseModalSelector, BaseButton, IconButton } from 'App/Components';

const SUPPORT_LANGUAGES = () =>
  [{ key: 0, label: t('drawer_content_select_prefer_locale'), section: true }].concat(
    Config.UI_SUPPORT_LANGUAGES.map((lang) => ({
      label: t(`__support_language_${lang}`),
      key: lang,
    })),
  );

class LanguageModal extends React.PureComponent {
  state = {
    languageModalShow: false,
  };

  handleUserLanguageChanged = (option) => {
    const { onUserLocaleChange } = this.props;
    onUserLocaleChange(option.key);
  };

  render() {
    const { customLocale = 'zh_HK', fontSize = 'h4' } = this.props;
    const { languageModalShow } = this.state;
    return (
      <BaseModalSelector
        visible={languageModalShow}
        data={SUPPORT_LANGUAGES()}
        onChange={this.handleUserLanguageChanged}
      >
        <BaseButton style={Classes.fillRowCenter} transparent>
          <IconButton iconName="language" iconType="MaterialIcons" iconColor={Colors.black} />
          <Text style={[Fonts.style.bold, Fonts.style[fontSize]]}>
            {t('drawer_content_setting_language')}({t(`__support_language_${customLocale}`)})
          </Text>
        </BaseButton>
      </BaseModalSelector>
    );
  }
}

LanguageModal.propTypes = {
  fontSize: PropTypes.string,
  customLocale: PropTypes.string.isRequired,
  onUserLocaleChange: PropTypes.func.isRequired,
};

LanguageModal.defaultProps = {};

export default LanguageModal;
