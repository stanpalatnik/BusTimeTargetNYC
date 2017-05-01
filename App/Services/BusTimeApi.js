import apisauce from 'apisauce'
// import Secrets from 'react-native-config'

// todo  config doesn't work right now const API_KEY = Secrets.MTA_BUSTIME_API_KEY
const API_KEY = '426d553f-82ea-4b62-b27c-d232a71e175b'

const create = (baseURL = 'http://bustime.mta.info/api/') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache'
    },
    timeout: 10000
  })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (__DEV__ && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }
  const getRoutes = (agencyID) => api.get(`where/routes-for-agency/${agencyID}.json?key=${API_KEY}`)
  const getRate = () => api.get('rate_limit')
  const getUser = (username) => api.get('search/users', {q: username})

  return {
    // a list of the API functions from step 2
    getRoutes,
    getRate,
    getUser
  }
}

// let's return back our create method as the default.
export default {
  create
}
