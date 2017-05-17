import React from 'react'
import { ScrollView, ListView, Text, View, LayoutAnimation, TouchableHighlight, AsyncStorage, TouchableWithoutFeedback } from 'react-native'
import BusTimeAPI from '../../App/Services/BusTimeApi'
import SearchBar from '../Components/SearchBar'
import { filter, curry } from 'ramda'
import { RadioButtons } from 'react-native-radio-buttons'

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
      directions: [],
      searchTerm: '',
      stops: [],
      showSearchBar: true,
      dataSource: ds.cloneWithRows([])
    }
    this.renderRow = this.renderRow.bind(this)
  }

  componentWillMount () {
    const route = this.props.navigation.state.params
    console.log('getting stops for route: ' + route.id)
    this.getStops(this.props.navigation.state.params.id).then(foundStops => {
      console.log('found stops!!: ' + foundStops)
      this.setState({
        directions: foundStops.directions.map(e => e.name.name),
        directionStopMap: foundStops.directions,
        stops: foundStops.stops,
        dataSource: this.state.dataSource.cloneWithRows(foundStops)
      })
      this.setSelectedOption(foundStops.directions[0].name.name)
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
        const stopsModel = {
          directions: routeStops.data.data.entry.stopGroupings[0].stopGroups,
          stops: routeStops.data.data.references.stops
        }
        AsyncStorage.setItem(`RouteStops:${routeId}`, JSON.stringify(stopsModel))
        return stopsModel
      }
    } catch (error) {
      console.log(error)
    }
  }

  cancelSearch = () => {
    this.setState({
      searchTerm: '',
      dataSource: this.state.dataSource.cloneWithRows(this.state.stops)
    })
  }

  filterRoute = curry(function (subString, ctx, stop) {
    if (stop === null) return false
    console.log(ctx.state.selectedOption)
    if (ctx.state.selectedOption === undefined) return false
    if (ctx.state.directionStopMap.filter(e => e.name.name === ctx.state.selectedOption)[0].stopIds.includes(stop.id)) {
      return (stop.name.toUpperCase().includes(subString.toUpperCase()))
    } else return false
  })

  selectStop = (stopData) => {
    console.log('selected stop: ' + JSON.stringify(stopData))
    this.cancelSearch()
    this.props.navigation.navigate('TimePicker', {
      route: this.props.navigation.state.params,
      stop: stopData
    })
  }

  searchStops = (term) => {
    console.log(this.state.directions)
    console.log(term)
    const filteredRoutes = filter(this.filterRoute(term, this), this.state.stops)
    this.setState({
      searchTerm: term,
      dataSource: this.state.dataSource.cloneWithRows(filteredRoutes)
    })
  }

  renderMiddle () {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (this.state.showSearchBar) {
      return <View style={SearchStyles.iBox}>
        <ScrollView>
          <SearchBar onChange={(e) => this.searchStops(e)} onSearch={(e) => console.log(e)} searchTerm={this.props.searchTerm} />
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
      return <View />
    }
  }

  setSelectedOption (selectedOption) {
    console.log('selecting option: ' + selectedOption)
    this.state.selectedOption = selectedOption
    this.setState({
      selectedOption
    }, this.searchStops(this.state.searchTerm))
  }

  renderOption (option, selected, onSelect, index) {
    const style = selected ? { fontWeight: 'bold' } : {}

    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index}>
        <View>
          <Text style={style}>{option}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderContainer (optionNodes) {
    return <View>{optionNodes}</View>
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={SearchStyles.modalHeader} />
        <View style={{margin: 20}}>
          <RadioButtons
            options={this.state.directions}
            onSelection={this.setSelectedOption.bind(this)}
            selectedOption={this.state.selectedOption}
            renderOption={this.renderOption}
            renderContainer={this.renderContainer}
          />
        </View>
        <Text>Selected option: {this.state.selectedOption || 'none'}</Text>
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
