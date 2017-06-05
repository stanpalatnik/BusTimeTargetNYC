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
      routes: [],
      upcomingRoutes: [],
      showModal: false,
      hasUpcomingRouteTimes: false,
      hasRouteTimes: false,
      loading: true
    }
  }

  getRouteTimes = async () => {
    const routes = await AsyncStorage.getItem('RouteTimes')
    if (routes !== null) {
      JSON.parse(routes).forEach(route => {
        let date = moment(route.startTime, 'h:mm a')
        console.log('start date is: ' + date)
        console.log('comparing to : ' + new Date(Date.now() + (60 * 1000)))
        if (date.isBetween(Date.now(), new Date(Date.now() + (60 * 1000)))) {
          console.log('is in between now and : ' + new Date(Date.now() + (60 * 1000)))
          this.setState({
            upcomingRoutes: this.state.upcomingRoutes.push(route),
            hasUpcomingRouteTimes: true
          })
        }
      })
      this.setState({
        hasRouteTimes: true,
        routes: JSON.parse(routes)
      })
    }
  }

  componentWillMount () {
    this.getRouteTimes().then(route => {
      this.setState({
        loading: false
      })
      if (route === null) {

      } else {

      }
    })
  }

  renderManageRoutes = () => {
    if (this.state.hasRouteTimes) {
      return (
        <View>
          <Text>You have {this.state.routes.length} configured routes.</Text>
          <RoundedButton onPress={this.manageRouteScreen}>
            Manage Routes
          </RoundedButton>
        </View>
      )
    }
  }

  manageRouteScreen = () => {
    this.componentWillMount()
  }

  renderUpcomingRoutes = () => {
    if (this.state.hasUpcomingRouteTimes) {
      return (
        <View>
          <Text>You have {this.state.upcomingRoutes.length} upcoming routes.</Text>
        </View>
      )
    }
  }

  render () {
    if (this.state.hasRouteTimes) {
      return (
        <View>
          {this.renderUpcomingRoutes()}
          {this.renderManageRoutes()}
        </View>
      )
    } else if (!this.state.loading) {
      return (
        <AlertMessage title={'No stops configured'} show />
      )
    } else {
      return (<View/>)
    }
  }
}
