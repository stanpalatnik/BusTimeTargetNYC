import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Slider, AsyncStorage } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import styles from './Styles/LaunchScreenStyles'
import appStyles from '../../App/Themes/ApplicationStyles'
import SearchStyles from './Styles/SearchStyles'
import RoundedButton from '../../App/Components/RoundedButton'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Metrics } from '../Themes/'
import { StackNavigator } from 'react-navigation'

export default class TimePicker extends Component {
  constructor (props) {
    super(props)

    this.defaultProps = {
      range: 2.5
    }

    this.state = {
      isDateTimePickerVisible: false,
      selectedTime: null,
      startTime: null,
      endTime: null,
      range: this.defaultProps.range,
      isSaveButtonVisible: false
    }

    this.saveRouteTime = this.saveRouteTime.bind(this)
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true })

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })

  _handleDatePicked = (time) => {
    console.log(this.props.navigation.state.params)
    console.log(time.getHours() + ':' + time.getMinutes())
    console.log('A time has been picked: ', time)
    this.setState({
      selectedTime: time,
      startTime: moment(time).subtract(this.state.range, 'm').format('h:mm a'),
      endTime: moment(time).add(this.state.range, 'm').format('h:mm a'),
      isSaveButtonVisible: true
    })
    this._hideDateTimePicker()
  }

  renderSaveButton = () => {
    if (this.state.isSaveButtonVisible) {
      return <RoundedButton styles={styles.btnPrimary} onPress={this.saveRouteTime}>
        Save
      </RoundedButton>
    }
  }

  _handleRangePicked = (range) => {
    let time = this.state.selectedTime
    this.setState({
      range: range,
      startTime: moment(time).subtract(this.state.range, 'm').format('h:mm a'),
      endTime: moment(time).add(this.state.range, 'm').format('h:mm a')
    })
  }

  saveRouteTime = async () => {
    const route = this.props.navigation.state.params
    const routeObj = {
      agencyId: route.agencyId,
      id: route.id
    }
    console.log('adding routetime: ' + routeObj)
    try {
      const routes = await AsyncStorage.getItem('RouteTimes')
      if (routes === null) {
        const routesList = [routeObj]
        console.log('creating first routetime: ' + routesList)
        AsyncStorage.setItem('RouteTimes', JSON.stringify(routesList))
      } else {
        const routesList = JSON.parse(routes)
        console.log('adding to existing routetime: ' + routesList)
        routesList.push(routeObj)
        console.log('combined route object: ' + routesList)
        AsyncStorage.setItem('RouteTimes', JSON.stringify(routesList))
      }
      this.props.navigation.navigate('SearchRouteScreen')
    } catch (error) {
      console.log('error saving route time: ' + error)
    }
  }

  render () {
    return (
    <View style={styles.mainContainer}>
      <View style={SearchStyles.modalHeader}/>
      <View style={appStyles.centerButton}>
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
      {this.renderSaveButton()}
    </View>
    )
  }
}
