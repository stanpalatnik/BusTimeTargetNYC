import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { filter, union, curry } from 'ramda'
import { startsWith } from 'ramdasauce'
import { AsyncStorage } from 'react-native'
import BusTimeAPI from '../../App/Services/BusTimeApi'

var STOPS = []

async function getStops (routeId) {
  console.log('getting stops for route: ' + routeId)
  try {
    const routeStops = await AsyncStorage.getItem(`RouteStops:${routeId}`)
    if (routeStops !== null) {
      console.log('found stops in cache')
      STOPS = union(STOPS, JSON.parse(routeStops))
    } else {
      const api = BusTimeAPI.create()
      console.log('fetching routes through api')
      const routeStops = await api.getRouteStops(routeId)
      console.log(routeStops.data.data)
      console.log('fetched route stops: ' + routeStops.data.data.references.stops)
      AsyncStorage.setItem(`RouteStops:${routeId}`, JSON.stringify(routeStops.data.data.references.stops))
      STOPS = routeStops.data.data.references.stops
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
  loadStops: ['routeId'],
  stops: ['searchTerm'],
  cancelSearch: null
})

export const TemperatureTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  searchTerm: '',
  searching: false,
  results: []
})

/* ------------- Reducers ------------- */

export const loadStops = (state, { routeId }) => {
  console.log('loading route stops..')
  getStops(routeId).catch(error => console.log('unable to load stops: ' + error))
  return state.merge({ loading: true, routeId })
}

export const performSearch = (state, { searchTerm }) => {
  console.log('searching route stops..')
  const results = STOPS
  return state.merge({ searching: true, searchTerm, results })
}

export const cancelSearch = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_STOPS]: loadStops,
  [Types.STOPS]: performSearch,
  [Types.CANCEL_SEARCH]: cancelSearch
})
