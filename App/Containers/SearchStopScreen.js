import React from 'react'
import { ScrollView, ListView, Text, Image, View, LayoutAnimation, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Images } from '../Themes'
import AlertMessage from '../../App/Components/AlertMessage'
import BusTimeAPI from '../../App/Services/BusTimeApi'
import SearchBar from '../Components/SearchBar'
import { connect } from 'react-redux'
import StopActions from '../Redux/StopRedux'
import { StackNavigator } from 'react-navigation'
import TimePicker from './TimePicker'
import { filter, union, curry } from 'ramda'
import { AsyncStorage } from 'react-native'

// Styles
import styles from './Styles/LaunchScreenStyles'
import SearchStyles from './Styles/SearchStyles'

export default class SearchStopScreen extends React.Component {
  constructor (props) {
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    super(props)
    this.state = {
      stops: [],
      showSearchBar: true,
      dataSource: ds.cloneWithRows([])
    }
    this.renderRow = this.renderRow.bind(this)
  }

  onSearch = () => {
    this.props.navigation.navigate('ListViewExample')
    console.log('searching: ' + this.props.searchTerm)
    this.props.performSearch(this.props.searchTerm)
    this.state.dataSource = this.state.dataSource.cloneWithRows(this.props.results)
  }

  componentWillMount () {
    const route = this.props.navigation.state.params
    console.log('getting stops for route: ' + route.id)
    this.getStops(this.props.navigation.state.params.id).then(foundStops => {
      console.log('found stops!!: ' + foundStops)
      this.setState({
        stops: foundStops,
        dataSource: this.state.dataSource.cloneWithRows(foundStops)
      })
    })
  }

  getStops = async (routeId) => {
    console.log('getting stops for route: ' + routeId)
    try {
      const routeStops = await AsyncStorage.getItem(`RouteStops:${routeId}`)
      if (routeStops !== null) {
        console.log('found stops in cache')
        return JSON.parse(routeStops)
      } else {
        const api = BusTimeAPI.create()
        console.log('fetching routes through api')
        const routeStops = await api.getRouteStops(routeId)
        console.log(routeStops.data.data)
        console.log('fetched route stops: ' + routeStops.data.data.references.stops)
        AsyncStorage.setItem(`RouteStops:${routeId}`, JSON.stringify(routeStops.data.data.references.stops))
        return routeStops.data.data.references.stops
      }
    } catch (error) {
      console.log(error)
    }
  }

  cancelSearch = () => {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.stops)
    })
  }

  filterRoute = curry(function (subString, stop) {
    if (stop === null) return false
    if (stop.name.toUpperCase().includes(subString.toUpperCase())) return true
    return false
  })

  selectStop = (stopData) => {
    this.cancelSearch()
    this.props.navigation.navigate('TimePicker', stopData)
  }

  searchStops = (term) => {
    console.log(term)
    const filteredRoutes = filter(this.filterRoute(term), this.state.stops)
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredRoutes)
    })
  }

  renderMiddle () {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (this.state.showSearchBar) {
      return <View style={SearchStyles.iBox}>
        <ScrollView>
          <SearchBar onChange={(e) => this.searchStops(e) } onSearch={(e) => this.onSearch()}
                     searchTerm={this.props.searchTerm} />
        </ScrollView>
      </View>
    } else {
      return (
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          pageSize={15}
        />
      )
    }
  }

  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  renderRow (rowData) {
    if (rowData !== null && rowData !== undefined && rowData.id !== undefined && rowData.name.length > 0) {
      return (
        <TouchableHighlight
          onPress={() => this.selectStop(rowData)}
          underlayColor='#ddd'
        >
          <View style={styles.row}>
            <Text style={styles.boldLabel}>{rowData.id}</Text>
            <Text style={styles.label}>{rowData.name}</Text>
          </View>
        </TouchableHighlight>
      )
    } else {
      return <View/>
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={SearchStyles.modalHeader}/>
        {this.renderMiddle()}
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          pageSize={30}
        />
      </View>
    )
  }
}
