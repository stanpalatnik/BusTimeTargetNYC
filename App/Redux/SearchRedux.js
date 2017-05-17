import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { filter, union, curry } from 'ramda'
import { AsyncStorage } from 'react-native'
import BusTimeAPI from '../../App/Services/BusTimeApi'

var ROUTES = []

async function getRoutes () {
  console.log('getting routes')
  try {
    const busCompanyRoutes = await AsyncStorage.getItem('Routes')
    if (busCompanyRoutes !== null) {
      ROUTES = union(ROUTES, JSON.parse(busCompanyRoutes))
    } else {
      const api = BusTimeAPI.create()
      console.log('fetching routes through api')
      const busCompanyRoutes = await api.getRoutes('MTABC')
      const transitRoutes = await api.getRoutes('MTA NYCT')
      const combinedRoutes = union(busCompanyRoutes.data['data'].list, transitRoutes.data['data'].list)
      AsyncStorage.setItem('Routes', JSON.stringify(combinedRoutes))
      ROUTES = union(ROUTES, JSON.parse(busCompanyRoutes))
    }
  } catch (error) {
    console.log(error)
  }
}

var filterRoute = curry(function (subString, route) {
  if (route === null) return false
  if (route.shortName.toUpperCase().includes(subString.toUpperCase())) return true
  if (route.longName.toUpperCase().includes(subString.toUpperCase())) return true
  return false
})

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  search: ['searchTerm'],
  cancelSearch: null
})

export const TemperatureTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  searchTerm: '',
  searching: false,
  results: getRoutes()
})

/* ------------- Reducers ------------- */

export const performSearch = (state, { searchTerm }) => {
  const results = filter(filterRoute(searchTerm), ROUTES)
  return state.merge({ searching: true, searchTerm, results })
}

export const cancelSearch = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SEARCH]: performSearch,
  [Types.CANCEL_SEARCH]: cancelSearch
})
