import React from 'react'
import { ScrollView, Text, Image, View, LayoutAnimation } from 'react-native'
import { Images } from '../Themes'
import AlertMessage from '../../App/Components/AlertMessage'
import BusTimeAPI from '../../App/Services/BusTimeApi'
import SearchBar from '../Components/SearchBar'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class SearchStopScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSearchBar: true
    }
  }

  onSearch = (searchTerm) => {
    this.props.performSearch(searchTerm)
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
      return <SearchBar onSearch={(e) => console.log(e)} searchTerm={this.props.searchTerm} onCancel={this.cancelSearch} />
    } else {
      return (
        <Image resizeMode='cover' style={styles.logo} source={Images.clearLogo} />
      )
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        {this.renderMiddle()}
      </View>
    )
  }
}
