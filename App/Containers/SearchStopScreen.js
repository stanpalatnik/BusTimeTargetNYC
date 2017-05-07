import React from 'react'
import { ScrollView, ListView, Text, Image, View, LayoutAnimation } from 'react-native'
import { Images } from '../Themes'
import AlertMessage from '../../App/Components/AlertMessage'
import BusTimeAPI from '../../App/Services/BusTimeApi'
import SearchBar from '../Components/SearchBar'
import { connect } from 'react-redux'
import SearchActions from '../Redux/SearchRedux'
import { AsyncStorage } from 'react-native'
import { union } from 'ramda'

// Styles
import styles from './Styles/LaunchScreenStyles'
import SearchStyles from './Styles/SearchStyles'

class SearchStopScreen extends React.Component {
  constructor (props) {
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    super(props)
    this.state = {
      showSearchBar: true,
      dataSource: ds.cloneWithRows(this.props.results)
    }
  }

  onSearch = () => {
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

  renderMiddle () {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (this.state.showSearchBar) {
      return <View style={SearchStyles.iBox}>
        <ScrollView>
          <SearchBar onChange={(e) => {
            this.props.performSearch(e);
            this.state.dataSource = this.state.dataSource.cloneWithRows(this.props.results) }
          } onSearch={(e) => this.onSearch()} searchTerm={this.props.searchTerm} />
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
    if (rowData !== null && rowData !== undefined) {
      return (
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.shortName}</Text>
          <Text style={styles.label}>{rowData.longName}</Text>
        </View>
      )
    }
    else {
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
          pageSize={15}
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
    performSearch: (searchTerm) => dispatch(SearchActions.search(searchTerm))
    // cancelSearch: () => dispatch(SearchActions.cancelSearch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchStopScreen)

