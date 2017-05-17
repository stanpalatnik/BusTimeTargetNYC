import { StyleSheet } from 'react-native'
import { Metrics, Colors } from '../../Themes/'

export default StyleSheet.create({
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.baseMargin,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  circleBorder: {
    borderColor: Colors.white,
    borderRadius: 15
  },
  iBox: {
    backgroundColor: Colors.snow,
    paddingTop: 15,
    paddingRight: 20,
    paddingBottom: 20,
    borderWidth: 1
  },
  modalHeader: {
    backgroundColor: Colors.teal,
    paddingTop: 35,
    paddingRight: 20,
    paddingBottom: 20
  }
})
