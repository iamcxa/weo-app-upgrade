import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import Image from 'react-native-image-cache-wrapper';

import { Screen } from '~/Helper';
import { Classes, Colors } from '~/Theme';
import { Badge } from '~/widget/RoundButton';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Screen.scale(8),
    height: Screen.scale(55),
  },
  author: {
    fontSize: Screen.scale(20),
    fontWeight: '500',
    marginLeft: Screen.scale(20),
    color: Colors.blackTwo,
  },
  avatarCircle: {},
  hash: {
    color: Colors.gray2,
  },
  avatar: {
    borderRadius: Screen.scale(61 / 2),
    borderWidth: Screen.scale(7),
    borderColor: Colors.silverThree,
    width: Screen.scale(61),
    height: Screen.scale(61),
  },
});

const AvatarBlock = ({ avatar, name, hash, editMode, onPress }) => (
  <View style={styles.wrapper}>
    <View style={styles.avatarCircle}>
      <Image source={avatar} style={styles.avatar} />
    </View>
    <View style={Classes.fill}>
      <Text style={styles.author} numberOfLines={2}>
        {name}
        <Text style={styles.hash} numberOfLines={2}>
          {hash ? `#${hash}` : ''}
        </Text>
      </Text>
      {editMode && (
        <Badge
          text="Edit"
          style={{
            marginLeft: Screen.scale(20),
            marginTop: Screen.scale(4),
          }}
          onPress={onPress}
        />
      )}
    </View>
  </View>
);

AvatarBlock.propTypes = {
  name: PropTypes.string.isRequired,
  hash: PropTypes.string,
  avatar: PropTypes.any.isRequired,
  editMode: PropTypes.bool,
  onPress: PropTypes.func,
};

AvatarBlock.defaultProps = {
  hash: '',
  editMode: false,
  onPress: () => {},
};

export default AvatarBlock;
