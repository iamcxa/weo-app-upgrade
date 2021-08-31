/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/**
 * Images should be stored in the `App/Images` directory and referenced using variables defined here.
 */
const PREFIX_PATH = '~/Asset/Images/';

const imagePath = {
  logo: require(`${PREFIX_PATH}gec/logo.png`),
  drawerLogo: require(`${PREFIX_PATH}gec/logo/logo.png`),
  big_logo: require(`${PREFIX_PATH}gec/big_logo.png`),
  menu: require(`${PREFIX_PATH}gec/icon/menu.png`),
  call: require(`${PREFIX_PATH}gec/icons/services/call.png`),
  location: require(`${PREFIX_PATH}gec/icons/services/location.png`),
  bk_lightgray: require(`${PREFIX_PATH}gec/bk/lightgray.png`),
  phone: require(`${PREFIX_PATH}gec/icon/phonecall.png`),
  gps: require(`${PREFIX_PATH}gec/icon/servicelocation.png`),
  dropdownIcon: require(`${PREFIX_PATH}gec/icon/dropdown.png`),

  backToTop: require(`${PREFIX_PATH}backToTop.png`),
  hamburger: require(`${PREFIX_PATH}hamburger.png`),
  mapPin: require(`${PREFIX_PATH}mapPin.png`),
  mapPin_active: require(`${PREFIX_PATH}mapPin-active.png`),
  collection: require(`${PREFIX_PATH}collection.png`),
  collection_active: require(`${PREFIX_PATH}collection-active.png`),
  bell: require(`${PREFIX_PATH}bell.png`),
  bell_new: require(`${PREFIX_PATH}bell-new.png`),
  bell_active: require(`${PREFIX_PATH}bell-active.png`),
  search: require(`${PREFIX_PATH}search.png`),
  plus: require(`${PREFIX_PATH}plus.png`),
  herePin: require(`${PREFIX_PATH}herePin.png`),
  herePin_active: require(`${PREFIX_PATH}herePin-active.png`),
  share: require(`${PREFIX_PATH}share.png`),
  reply: require(`${PREFIX_PATH}reply.png`),
  more: require(`${PREFIX_PATH}more.png`),
  arrowLeft: require(`${PREFIX_PATH}arrowLeft.png`),
  avatar1: require(`${PREFIX_PATH}avatar/Avatar1.png`),
  avatar2: require(`${PREFIX_PATH}avatar/Avatar2.png`),
  avatar3: require(`${PREFIX_PATH}avatar/Avatar3.png`),
  avatar4: require(`${PREFIX_PATH}avatar/Avatar4.png`),
  avatar5: require(`${PREFIX_PATH}avatar/Avatar5.png`),
  avatar6: require(`${PREFIX_PATH}avatar/Avatar6.png`),
  avatar7: require(`${PREFIX_PATH}avatar/Avatar7.png`),
  avatar8: require(`${PREFIX_PATH}avatar/Avatar8.png`),
  avatar9: require(`${PREFIX_PATH}avatar/Avatar9.png`),
  avatar10: require(`${PREFIX_PATH}avatar/Avatar10.png`),
  avatar11: require(`${PREFIX_PATH}avatar/Avatar11.png`),
  avatar12: require(`${PREFIX_PATH}avatar/Avatar12.png`),
  splashBackground: require(`${PREFIX_PATH}splash/appIcon-background.png`),
  splashLogo: require(`${PREFIX_PATH}splash/appIcon.png`),
  userLocation: require(`${PREFIX_PATH}userLocation.png`),
  markerPin: require(`${PREFIX_PATH}map-pin.png`),
  eye: require(`${PREFIX_PATH}eye.png`),

  voice: {
    microphone: require(`${PREFIX_PATH}voice-view/microphone.png`),
    background: require(`${PREFIX_PATH}voice-view/background.png`),
    welcome: require(`${PREFIX_PATH}voice-view/welcome.png`),
    weo: require(`${PREFIX_PATH}voice-view/weo.png`),
  },

  navBackRight: require(`${PREFIX_PATH}nav-back-right.png`),
  navBackLeft: require(`${PREFIX_PATH}nav-back-left.png`),
  navAccount: require(`${PREFIX_PATH}nav-account.png`),
  navAccount_active: require(`${PREFIX_PATH}nav-account-active.png`),
  navMic: require(`${PREFIX_PATH}nav-mic.png`),
  navEye: require(`${PREFIX_PATH}nav-eye.png`),
  navAdd: require(`${PREFIX_PATH}nav-add.png`),
  navAdd_active: require(`${PREFIX_PATH}nav-add.png`),
  navHereYouAre: require(`${PREFIX_PATH}nav-here-you-are.png`),
  navHereYouAre_active: require(`${PREFIX_PATH}nav-here-you-are-active.png`),
  navThereYouAre: require(`${PREFIX_PATH}nav-there-you-are.png`),
  navThereYouAre_active: require(`${PREFIX_PATH}nav-there-you-are-active.png`),
};

export default imagePath;
