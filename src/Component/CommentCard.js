import PropTypes from "prop-types";
import React, { PureComponent } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import Share from "react-native-share";

import Colors from "~/Theme/Colors";
import config from "~/Config";
import { Screen } from "~/Helper";
import CommentCardHeader from "./CommentCardHeader";
import CommentCardImage from "./CommentCardImage";
import CommentCardContent from "./CommentCardContent";
import CommentCardFooter from "./CommentCardFooter";
import VoteBox from "./VoteBox";

const styles = StyleSheet.create({
  container: {
    paddingTop: Screen.scale(14),
    paddingBottom: Screen.scale(8),
    paddingHorizontal: Screen.scale(12),
  },
  content: {
    flex: 1,
    marginVertical: Screen.scale(8),
  },
  imageContainer: {
    marginBottom: Screen.scale(10),
  },
  image: {
    backgroundColor: Colors.paleGrey,
    width: "100%",
    height: "auto",
  },
});

const listItemStyles = StyleSheet.create({
  avatar: {
    borderColor: Colors.silverFour,
  },
});

const topicListHeaderStyles = StyleSheet.create({
  avatar: {
    borderColor: Colors.lightGrey,
  },
});

const postListHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Screen.scale(16),
    paddingBottom: Screen.scale(14),
    borderLeftWidth: Screen.scale(1),
  },
});

const replyListItemHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Screen.scale(16),
    paddingBottom: Screen.scale(14),
  },
});

const CONSTANT_BELONGS_TO = ["HERE_YOU_ARE", "THERE_YOU_ARE", "BROWSE"];

const CONSTANT_TYPE = ["TOPIC", "POST", "REPLY"];

@connect(
  (state) => ({
    userCircle: state.circle.userCircle,
  }),
  (dispatch) => bindActionCreators({}, dispatch)
)
class CommentCard extends PureComponent {
  static propTypes = {
    belongsTo: PropTypes.oneOf(CONSTANT_BELONGS_TO).isRequired,
    onMoreBtnPress: PropTypes.func.isRequired,
    userCircle: PropTypes.object,
    homeCircle: PropTypes.object,
    id: PropTypes.string.isRequired,
    onPressPopupOriginPost: PropTypes.func,
    onReplyPress: PropTypes.func,
    type: PropTypes.oneOf(CONSTANT_TYPE),
    repliesLength: PropTypes.number,
    listHeader: PropTypes.bool,
    isPeekMode: PropTypes.bool,
    isHideFooter: PropTypes.bool,
    replyAuthorName: PropTypes.string,
    replyPostId: PropTypes.string,
    authorName: PropTypes.string,
    authorHash: PropTypes.string,
    createdAt: PropTypes.string,
    mediaUrl: PropTypes.any,
    content: PropTypes.string,
    avatar: PropTypes.string,
    topic: PropTypes.object,
    style: PropTypes.any,
  };

  static defaultProps = {
    onPressPopupOriginPost: () => {},
    replyAuthorName: "",
    isHideFooter: false,
    onReplyPress: null,
    listHeader: false,
    isPeekMode: false,
    repliesLength: 0,
    userCircle: {},
    homeCircle: {},
    type: "TOPIC",
    replyPostId: "",
    authorHash: "",
    authorName: "",
    createdAt: "",
    mediaUrl: "",
    content: "",
    avatar: "",
    style: {},
    topic: {},
  };

  state = {
    imageContainerWidth: 1,
    imageRatio: 1,
  };

  onShareBtnPress = async () => {
    const circle =
      this.props.belongsTo === "HERE_YOU_ARE"
        ? this.props.userCircle
        : this.props.homeCircle;
    // const { content, title } = this.props;
    const topicUrl = `${config.shareAPI_BASE_URL}/${this.props.topic.id}`;
    // const encodeUrl = encodeURIComponent(topicUrl);
    // const longDynamicLink = `https://weo.page.link/?link=${encodeUrl}&apn=hk.com.weo.app&ibi=app.weo.com.hk`;
    // console.log(encodeUrl);
    // console.log(longDynamicLink);
    // const shortUrlAPI = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${config.FIREBASE_DYNAMIC_LINK_KEY}`;
    // const result = await fetch(shortUrlAPI, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     longDynamicLink
    //   })
    // });
    // const resultJSON = await result.json();
    // const shareUrl = resultJSON.shortLink;
    // console.log('result', result);

    const shareOptions = {
      title: "WeO 開始傾",
      message: `喺 【${circle.name}】有人話：【${this.props.topic.title}】
`,
      // url: `${config.domain}/share/${_.lowerCase(this.props.type)}/${
      //   this.props.id
      // }`,
      url: topicUrl,
      // url: (Platform.OS === 'ios') ? config.iosDownloadLink : config.androidDownloadLink,
      // (我) 喺 (${Circle名}) 同人傾緊：(${topic標題})。想一齊傾？立即下戴WeO, 喺Poly先玩到嘅Forum。(${app store 連結})
      subject: "Share from WeO", //  for email
    };
    Share.open(shareOptions);
  };

  getSpecificStyle = (key) => [
    styles[key],
    this.props.type === "TOPIC" && this.props.listHeader
      ? topicListHeaderStyles[key]
      : listItemStyles[key],
    this.props.type === "POST" &&
      this.props.listHeader &&
      postListHeaderStyles[key],
    this.props.type === "REPLY" &&
      !this.props.listHeader &&
      replyListItemHeaderStyles[key],
  ];

  render() {
    const {
      isPeekMode,
      style,
      belongsTo,
      id,
      type,
      avatar,
      listHeader,
      authorName,
      authorHash,
      createdAt,
      replyPostId,
      replyAuthorName,
      content,
      mediaUrl,
      repliesLength,
      onMoreBtnPress,
      onReplyPress,
      isHideFooter,
    } = this.props;
    return (
      <View style={[this.getSpecificStyle("container"), style]}>
        <CommentCardHeader
          belongsTo={belongsTo}
          id={id}
          type={type}
          avatar={avatar}
          listHeader={listHeader}
          authorName={authorName}
          createdAt={createdAt}
          isPeekMode={isPeekMode}
        >
          <VoteBox
            id={id}
            disabled={isPeekMode}
            type={type}
            belongsTo={belongsTo}
          />
        </CommentCardHeader>

        <CommentCardContent
          onPressPopupOriginPost={() => {
            const { onPressPopupOriginPost } = this.props;
            onPressPopupOriginPost(replyPostId);
          }}
          replyPostId={replyPostId}
          replyAuthorName={replyAuthorName}
          content={content}
          isPeekMode={isPeekMode}
        />

        {typeof mediaUrl === "object" &&
          mediaUrl instanceof Array &&
          mediaUrl.length > 0 &&
          mediaUrl.map(
            (m, i) =>
              m.url && (
                <CommentCardImage
                  key={`image-${i}`}
                  getImageContainerSize={this.getImageContainerSize}
                  imageContainerWidth={this.state.imageContainerWidth}
                  imageRatio={this.state.imageRatio}
                  mediaUrl={m.url}
                />
              )
          )}

        {!isHideFooter && (
          <CommentCardFooter
            onShareBtnPress={this.onShareBtnPress}
            onMoreBtnPress={onMoreBtnPress}
            onReplyPress={onReplyPress}
            repliesLength={repliesLength}
            isPeekMode={isPeekMode}
          />
        )}
      </View>
    );
  }
}

export default CommentCard;
