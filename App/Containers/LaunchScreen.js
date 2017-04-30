import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import RoundedButton from '../../App/Components/RoundedButton'
import AlertMessage from '../../App/Components/AlertMessage'


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

          <View style={styles.section} >
            <RoundedButton
              styles={styles.btnPrimary}
              text='Add Route Tracker'
              onPress={() => window.alert('We are tracking this!')}
            />
          </View>

          <View style={styles.section} >
            <AlertMessage title={'No routes configured'} show={true}/>
          </View>

        </ScrollView>
      </View>
    )
  }
}
