import React from 'react'
import { ScrollView, ListView, Text, Image, View, LayoutAnimation, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Images } from '../Themes'
import SearchBar from '../Components/SearchBar'
import { connect } from 'react-redux'
import SearchActions from '../Redux/SearchRedux'
import { StackNavigator } from 'react-navigation'
import TimePicker from './TimePicker'
import SearchStopScreen from './SearchStopScreen'

// Styles
import styles from './Styles/LaunchScreenStyles'
import SearchStyles from './Styles/SearchStyles'

class SearchRouteScreen extends React.Component {
  constructor (props) {
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    super(props)
    this.state = {
      showSearchBar: true,
      dataSource: ds.cloneWithRows(this.props.results)
    }
    this.renderRow = this.renderRow.bind(this)
  }

  onSearch = () => {
    this.props.navigation.navigate('ListViewExample')
    console.log('searching: ' + this.props.searchTerm)
    this.props.performSearch(this.props.searchTerm)
    this.state.dataSource = this.state.dataSource.cloneWithRows(this.props.results)
  }

  showSearchBar = () => {
    this.setState({showSearchBar: true})
  }

  cancelSearch = () => {
    this.setState({showSearchBar: false})
  }

  selectRoute = (routeData) => {
    this.props.cancelSearch()
    this.props.navigation.navigate('SearchStopScreen', routeData)
  }

  renderMiddle () {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (this.state.showSearchBar) {
      return <View style={SearchStyles.iBox}>
        <ScrollView>
          <SearchBar onChange={(e) => this.props.performSearch(e) } onSearch={(e) => this.onSearch()}
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

  componentWillReceiveProps (newProps) {
    console.log('recieving props....')
    if (newProps.results) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newProps.results)
      })
    }
  }

  renderRow (rowData) {
    if (rowData !== null && rowData !== undefined && rowData.shortName !== undefined && rowData.shortName.length > 0) {
      return (
      <TouchableHighlight
          onPress={() => this.selectRoute(rowData)}
          underlayColor='#ddd'
          >
          <View style={styles.row}>
            <Text style={styles.boldLabel}>{rowData.shortName}</Text>
            <Text style={styles.label}>{rowData.longName}</Text>
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

const mapStateToProps = (state) => {
  return {
    searchTerm: state.search.searchTerm,
    results: state.search.results
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performSearch: (searchTerm) => dispatch(SearchActions.search(searchTerm)),
    cancelSearch: () => dispatch(SearchActions.cancelSearch())
  }
}

export default StackNavigator({
  SearchRouteScreen: {screen: connect(mapStateToProps, mapDispatchToProps)(SearchRouteScreen)},
  SearchStopScreen: {screen: SearchStopScreen},
  TimePicker: {screen: TimePicker}
}, {
  cardStyle: {
    opacity: 1,
    backgroundColor: '#3e243f'
  },
  initialRouteName: 'SearchRouteScreen',
  headerMode: 'none',
  // Keeping this here for future when we can make
  navigationOptions: {
    header: {
      left: (
        <TouchableOpacity onPress={() => window.alert('pop')} ><Image source={Images.closeButton} style={{marginHorizontal: 10}} /></TouchableOpacity>
      ),
      style: {
        backgroundColor: '#3e243f'
      }
    }
  }
})

