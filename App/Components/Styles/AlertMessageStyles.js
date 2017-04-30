import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginVertical: Metrics.section,
    backgroundColor: Colors.fire,
    borderRadius: 5,
    height: 100,
    alignSelf: 'stretch'
  },
  contentContainer: {
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  message: {
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.baseMargin,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.h6,
    fontWeight: 'bold',
    color: Colors.snow
  },
  icon: {
    color: Colors.steel
  }
})
