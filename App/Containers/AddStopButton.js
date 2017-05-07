import React from 'react'
import { View, Modal, Image, TouchableOpacity } from 'react-native'
import DebugConfig from '../../App/Config/DebugConfig'
import RoundedButton from '../../App/Components/RoundedButton'
import SearchStopScreen from "./SearchStopScreen";
import { Images } from '../Themes'

export default class AddStopButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  render () {
    return (
      <View>
        <Modal
          visible={this.state.showModal}
          onRequestClose={this.toggleModal}>
            <TouchableOpacity onPress={this.toggleModal} style={{
              position: 'absolute',
              paddingTop: 10,
              paddingHorizontal: 10,
              zIndex: 10
            }}>
            <Image source={Images.closeButton2x} />
          </TouchableOpacity>
          <SearchStopScreen/>
        </Modal>
        <RoundedButton styles={this.props.styles} onPress={this.toggleModal}>
          Add Stop Route
        </RoundedButton>
      </View>
    )
  }
}
