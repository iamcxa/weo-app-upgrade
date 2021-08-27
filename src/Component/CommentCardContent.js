import React from 'react';
import PropTypes from 'prop-types';
import { isString, isEmpty } from 'lodash';
import { View, Text, TouchableOpacity } from 'react-native';

import { Colors } from '~/Theme';
import { StyleSheet } from '~/Helpers';
import HyperlinkWrapper from '../widget/HyperlinkWrapper';

const styles = StyleSheet.create({
  contentText: {
    color: Colors.greyishBrownTwo,
    paddingBottom: 16,
    paddingTop: 8,
  },
  peekModeContentText: {
    color: Colors.white,
  },
  clickableAuthorName: {
    paddingBottom: 8,
    paddingRight: 10,
  },
  highlightAuthorName: {
    color: Colors.blue,
  },
  peekModeHighlightAuthorName: {
    color: Colors.lightblue,
  },
});

const CommentCardContent = ({
  onPressPopupOriginPost,
  replyAuthorName,
  replyPostId,
  content,
  isPeekMode,
}) => (
  <View style={styles.content}>
    {replyPostId ? (
      <TouchableOpacity style={styles.clickableAuthorName} onPress={onPressPopupOriginPost}>
        <Text
          style={[
            styles.authorName,
            styles.highlightAuthorName,
            isPeekMode && styles.peekModeHighlightAuthorName,
          ]}
        >
          {'@'}
          {replyAuthorName}
        </Text>
      </TouchableOpacity>
    ) : null}

    {isString(content) && !isEmpty(content.trim()) && (
      <HyperlinkWrapper>
        <Text style={[styles.contentText, isPeekMode && styles.peekModeContentText]}>
          {content}
        </Text>
      </HyperlinkWrapper>
    )}
  </View>
);

CommentCardContent.propTypes = {
  onPressPopupOriginPost: PropTypes.func,
  replyAuthorName: PropTypes.string,
  replyPostId: PropTypes.string,
  content: PropTypes.string,
  isPeekMode: PropTypes.bool,
};

CommentCardContent.defaultProps = {
  onPressPopupOriginPost: () => {},
  replyAuthorName: '',
  replyPostId: null,
  content: '',
  isPeekMode: false,
};

export default CommentCardContent;
