import { StyleSheet } from 'react-native';
import { Colors, Styles } from '~/Theme';

export default StyleSheet.create({
  container: {
    ...Styles.screen.container,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 70,
    backgroundColor: 'white',
  },
});
