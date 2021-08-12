#!/bin/sh
# v1.0.22
# KENT <iamcxa@gmail.com>
# Building tools for React-Native app bundle

case ${1} in
  "android-bundle")
  if [ "${2}" = "dev" ];
  then
    IS_DEV=true;
  else
    IS_DEV=false;
  fi
	# node node_modules/react-native/local-cli/cli.js bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
	node node_modules/react-native/local-cli/cli.js bundle --platform android --dev $IS_DEV --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
	;;

  "ios-bundle")
  if [ "${2}" = "dev" ];
  then
    IS_DEV=true;
  else
    IS_DEV=false;
  fi
	node node_modules/react-native/local-cli/cli.js bundle --platform ios --dev $IS_DEV --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios
	;;

  "bundle")
  if test ! -z ${2}
  then
    echo "[!]MAKE: Run build tool command for the platform: [${2}] ${3}\n.";
  else
    echo "[!]MAKE: Run build tool command for the ALL platforms. ${3}\n";
  fi
  case ${2} in
    "android")
    sh ./make android-bundle ${3} && sh ./make fix android-resource-release-gradle
    ;;
    "ios")
    sh ./make ios-bundle ${3}
    ;;
    "dev")
	  sh ./make android-bundle dev && sh ./make ios-bundle dev && sh ./make fix android-resource-release-gradle
    ;;
    *)
	  sh ./make android-bundle && sh ./make ios-bundle && sh ./make fix android-resource-release-gradle
    ;;
  esac
	;;

  "fix")
  case ${2} in
    "android-resource-release-gradle")
    node ./scripts/fix-android-release-gradle.js
    ;;
    "websocket-ssl")
    node ./scripts/install-wss.js
    ;;
    "0.59-third-party-ios")
    curl -L https://git.io/fix-rn-xcode10 | bash
    ;;
    *)
    echo "Fix:\n)Option1: 'android-resource-release-gradle'\n)Option2: '0.59-third-party-ios'"
    ;;
  esac
  ;;

  "ci")
  if test ! -z ${3}
  then
    echo "[!]MAKE: Run CI command for the platform: [${2}] and [${3}] mode.\n.";
  else
    case ${2} in
    "env")
    echo "[!]MAKE: Run CI command for install the env.\n."
    ;;
    *)
    echo "[!]MAKE: Run CI command for ALL platforms in PRODUCTION mode.\n."
    ;;
    esac
  fi
  case ${2} in
    "producation")
    cd ios && bundle install && fastlane make appstore && fastlane make development && cd ../
    ;;
    "env")
    gem install cocoapods:1.8.4 && gem install bundler && gem install fastlane
    ;;
    *)
    cd ${2} && bundle install && fastlane ${3} && cd ../
    ;;
  esac
  ;;

  "versioning")
  echo "[!]Command - "${1} ${2} ${3} ${4};
    echo "$@"

  git fetch --prune --tags;

  case ${2} in
    "alpha")
    react-native-version && standard-version -a -r patch --prerelease alpha ${3} ${4} && sh ./make versioning push-tag
    ;;
    "patch")
    react-native-version && standard-version -a -r patch ${3} ${4} && sh ./make versioning push-tag
    ;;
    "miror")
    react-native-version && standard-version -a -r miror ${3} ${4} && sh ./make versioning push-tag
    ;;
    "major")
    react-native-version && standard-version -a -r major ${3} ${4} && sh ./make versioning push-tag
    ;;
    "ci")
    #Get the highest tag number
    VERSION=`git tag --sort version:refname | tail -1`;
    VERSION=${VERSION:-'0.0.0'};

    #Get number parts
    MAJOR="${VERSION%%.*}"; VERSION="${VERSION#*.}";
    MINOR="${VERSION%%.*}"; VERSION="${VERSION#*.}";
    PATCH="${VERSION%%.*}"; VERSION="${VERSION#*.}";

    #Increase version
    PATCH="${PATCH%%-*}"; PATCH=$((PATCH+1));

    # Get giving version if exists
    for i in "$@"
      do
      case $i in
        -ma=*|--major=*)
        MAJOR="${i#*=}"
        shift # past argument=value
        ;;
        -mi=*|--minor=*)
        MINOR="${i#*=}"
        shift # past argument=value
        ;;
        -pa=*|--patch=*)
        PATCH="${i#*=}"
        shift # past argument=value
        ;;
        *)
        # unknown option
        ;;
      esac
    done

    #Get current hash and see if it already has a tag
    GIT_COMMIT=`git rev-parse HEAD`;
    NEEDS_TAG=`git describe --contains $GIT_COMMIT`;

    #Create new tag
    NEW_TAG="$MAJOR.$MINOR.$PATCH";
    echo "[!]New Tag will be: '$NEW_TAG'.";

    standard-version -a -r $NEW_TAG && react-native-version -a -L && standard-version -a && git push origin $NEW_TAG --force;
    ;;
    "push-tag")
    git push origin $(git tag --sort version:refname | tail -1)
    ;;
    *)
    echo "[!]Versioning: Command for upgrade project version number automatically.\n
    - Option1: 'patch' - Update project with "PATCH" number(Auto commit).
    - Option2: 'miror' - Update project with "MIROR" number(Auto commit).
    - Option3: 'major' - Update project with "MAJOR" number(Auto commit).
    - Option4: 'ci' - Update project using standard-version default setting with CI(Auto commit).\n"
    ;;
  esac
  ;;

  "changelog")
  conventional-changelog -p angular -i CHANGELOG.md -s
  ;;

  "changelog-init")
  conventional-changelog -p angular -i CHANGELOG.md -s -r 0
  ;;

  "clear")
	watchman watch-del-all && rm -rf /tmp/metro-bundler-cache-* && rm -rf /tmp/haste-map-react-native-packager-* && react-native start --reset-cache
	;;

  "sonar")
  node ./scripts/sonar-scanner.js
  ;;

  "install-fonts")
  yarn add opentype.js --dev &&
  node ./scripts/align-font-name.js &&
  npx react-native-asset -a ./@App/Assets/Fonts
  ;;

  "postinstall")
  echo "[!]MAKE: run build tool command 'postinstall'.";
  npx jetify;
  if [ -f script/android-resource-release-gradle.js ]; then
    sh ./make fix android-resource-release-gradle;
  fi
  if [ -f node_modules/react-native-wss/scripts/postinstall.js ]; then
    node node_modules/react-native-wss/scripts/postinstall.js;
  fi
  ;;
esac
