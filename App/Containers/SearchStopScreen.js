import React from 'react'
import { ScrollView, Text, Image, View, LayoutAnimation } from 'react-native'
import { Images } from '../Themes'
import AlertMessage from '../../App/Components/AlertMessage'
import BusTimeAPI from '../../App/Services/BusTimeApi'
import SearchBar from '../Components/SearchBar'
import { connect } from 'react-redux'
import SearchActions from '../Redux/SearchRedux'

// Styles
import styles from './Styles/LaunchScreenStyles'
import SearchStyles from './Styles/SearchStyles'

class SearchStopScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchBar: true,
      searchTerm: ''
    }
  }

  updateSearchTerm = (searchTerm) => {
    this.setState({
      searchTerm: searchTerm
    })
     this.props.performSearch(searchTerm)
  }

  onSearch = () => {
    console.log(this.state.searchTerm)
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
          <SearchBar onChange={(e) => this.updateSearchTerm(e)} onSearch={(e) => this.onSearch()} searchTerm={this.props.searchTerm} onCancel={this.cancelSearch} />
        </ScrollView>
      </View>
    } else {
      return (
        <Image resizeMode='cover' style={styles.logo} source={Images.clearLogo} />
      )
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={SearchStyles.modalHeader}/>
        {this.renderMiddle()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    searchTerm: state.search.searchTerm
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performSearch: (searchTerm) => dispatch(SearchActions.search(searchTerm)),
    cancelSearch: () => dispatch(SearchActions.cancelSearch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchStopScreen)

