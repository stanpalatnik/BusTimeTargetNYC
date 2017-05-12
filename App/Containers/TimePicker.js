import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Slider } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import styles from './Styles/LaunchScreenStyles'
import SearchStyles from './Styles/SearchStyles'
import RoundedButton from '../../App/Components/RoundedButton'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Metrics } from '../Themes/'

export default class TimePicker extends Component {
  defaultProps = {
    range: 2.5
  }

  state = {
    isDateTimePickerVisible: false,
    selectedTime: null,
    startTime: null,
    endTime: null,
    range: this.defaultProps.range
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (time) => {
    console.log(time.getHours() + ':' + time.getMinutes())
    console.log('A time has been picked: ', time)
    this.setState({
      selectedTime: time,
      startTime: moment(time).subtract(this.state.range, 'm').format('h:mm a'),
      endTime: moment(time).add(this.state.range, 'm').format('h:mm a')
    })
    this._hideDateTimePicker()
  };

  _handleRangePicked = (range) => {
    let time = this.state.selectedTime
    this.setState({
      range: range,
      startTime: moment(time).subtract(this.state.range, 'm').format('h:mm a'),
      endTime: moment(time).add(this.state.range, 'm').format('h:mm a')
    })
  }

  render () {
    return (
    <View style={styles.mainContainer}>
      <View style={SearchStyles.modalHeader}/>
      <View style={styles.centerButton}>
        <TouchableOpacity onPress={this._showDateTimePicker}>
          <Icon name='clock-o' size={Metrics.icons.xxl} />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>{this.state.startTime} - {this.state.endTime}</Text>
      <Slider
        value={this.defaultProps.range}
        step={0.5}
        minimumValue={1}
        maximumValue={7}
        onValueChange={(value) => this._handleRangePicked(value)} />
      <DateTimePicker
        mode="time"
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this._handleDatePicked}
        onCancel={this._hideDateTimePicker}
      />
      <RoundedButton styles={styles.btnPrimary} onPress={this._showDateTimePicker}>
        Save
      </RoundedButton>
    </View>
    )
  }
}
