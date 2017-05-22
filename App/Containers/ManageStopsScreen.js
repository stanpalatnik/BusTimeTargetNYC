import React from 'react'
import { View, Modal, Text, TouchableOpacity, AsyncStorage } from 'react-native'
import RoundedButton from '../../App/Components/RoundedButton'
import SearchRouteScreen from './SearchRouteScreen'
import { Images } from '../Themes'
import AlertMessage from '../../App/Components/AlertMessage'
import moment from 'moment'

export default class ManageStopsScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false,
      hasRouteTimes: false
    }
  }

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal})
  }

  getRouteTimes = async () => {
    const routes = await AsyncStorage.getItem('RouteTimes')
    if (routes !== null) {
      routes.forEach(route => {
        let date = moment(route.startTime, 'h:mm a')
        console.log('start date is: ' + date)
        console.log('comparing to : ' + new Date(Date.now() + (60 * 1000)))
        if (date.isBetween(Date.now(), new Date(Date.now() + (60 * 1000)))) {
          console.log('in between now and : ' + new Date(Date.now() + (60 * 1000)))
          this.setState({
            hasRouteTimes: true
          })
        }
      })
    }
  }

  componentWillMount () {
    this.getRouteTimes().then(route => {
      if (route === null) {

      } else {

      }
    })
  }

  render () {
    if (this.state.hasRouteTimes) {
      return (
        <View><Text>Found routes!</Text></View>
      )
    } else {
      return (
        <AlertMessage title={'No stops configured'} show />
      )
    }
  }
}
