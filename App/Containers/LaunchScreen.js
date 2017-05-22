import React from 'react'
import { ScrollView, Image, View } from 'react-native'
import { Images } from '../Themes'
import AddStopButton from './AddStopButton'
import ManageStopsScreen from './ManageStopsScreen'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends React.Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.logo} style={[styles.logo, styles.circleBorder]} />
          </View>
          <View style={styles.section}>
            <AddStopButton styles={styles.btnPrimary} />
            <ManageStopsScreen />
          </View>
        </ScrollView>
      </View>
    )
  }
}
