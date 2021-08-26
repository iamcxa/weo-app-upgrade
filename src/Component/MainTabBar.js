/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

import CustomTabIcon from 'App/Components/CustomTabIcon';

import { Colors } from 'App/Theme';
import { Screen } from 'App/Helpers';

const styles = StyleSheet.create({
  container: {
    // ...Styles.ViewFlexInline,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: Screen.moderateScale(49),
    justifyContent: 'space-around',
    width: '100%',
  },
});

const component = (props) => {
  const {
    navigation: {
      state: { routes },
      index: currentIndex,
    },
  } = props;
  return (
    <View style={styles.container}>
      {routes.map((e) =>
        e.routes.map((ei) => (
          <TouchableOpacity
            index={e.index}
            key={e.key}
            style={[
              // { backgroundColor: 'blue' },
              ei.params.tabStyle,
            ]}
          >
            <CustomTabIcon key={ei.key} {...ei.params} />
            {console.log('element=>', e)}
          </TouchableOpacity>
        )),
      )}
    </View>
  );
};

component.propTypes = {
  navigation: PropTypes.object.isRequired,
};

component.defaultProps = {};

export default component;
