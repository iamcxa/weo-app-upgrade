import React from 'react';
import { Text, View } from 'react-native';

import styles from './SplashScreenStyle';

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
