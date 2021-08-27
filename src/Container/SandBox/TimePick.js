import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  DatePickerIOS,
  Platform,
  TimePickerAndroid,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class TimePick extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {}

  onDateChange = (date) => {
    this.setState({ date });
  };

  _formatTime = (hour, minute) => `${hour}:${minute < 10 ? `0${minute}` : minute}`;

  showPicker = async (stateKey, options) => {
    try {
      const { action, minute, hour } = await TimePickerAndroid.open(options);
      // var newState = {};
      // if (action === TimePickerAndroid.timeSetAction) {
      //   newState[stateKey + 'Text'] = _formatTime(hour, minute);
      //   newState[stateKey + 'Hour'] = hour;
      //   newState[stateKey + 'Minute'] = minute;
      // } else if (action === TimePickerAndroid.dismissedAction) {
      //   newState[stateKey + 'Text'] = 'dismissed';
      // }
      // this.setState(newState);
    } catch ({ code, message }) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{moment(this.state.date).format('HH:mm')}</Text>
        {Platform.OS === 'ios' ? (
          <DatePickerIOS
            date={this.state.date}
            mode="time"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onDateChange}
            minuteInterval={10}
          />
        ) : (
          <TouchableOpacity
            onPress={async () => {
              await TimePickerAndroid.open({
                hour: 10,
                minute: 10,
                is24Hour: false,
              });
              {
                /* await this.showPicker('isoFormat', {
                hour: 0,
                minute: 0,
                is24Hour: true,
                }); */
              }
            }}
          >
            <Text>Open</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
