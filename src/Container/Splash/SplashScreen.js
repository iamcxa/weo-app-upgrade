import React from 'react';
// import { connect } from 'react-redux';
import { Text, View } from 'react-native';
// import { bindActionCreators } from 'redux';

// const styles = {};
import styles from './SplashScreenStyle';

// import StartupActions from '@/Store/Startup/Actions';

class SplashScreen extends React.Component {
  componentDidMount() {
    __DEV__ && console.log('@Enter SplashScreen!');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          {/* You will probably want to insert your logo here */}
          <Text>LOGO</Text>
        </View>
      </View>
    );
  }
}

export default SplashScreen;
// export default connect(
//   (state) => ({
//     isLoading: state.appState.isLoading,
//   }),
//   (dispatch) => ({
//     // startup: () => dispatch(
//     //   StartupActions.startup()
//     // ),
//   }),
// )(SplashScreen);
