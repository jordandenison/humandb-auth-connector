const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio-client')
const auth = require('@feathersjs/authentication-client')
const io = require('socket.io-client')
const logger = require('winston')

const delay = async time => new Promise(resolve => setTimeout(resolve, time))

const url = process.env.AUTH_API_URL || 'http://hdb-dash-auth:3001/'

const socket = io(url, {
  path: '/auth/socket.io',
  transports: [ 'websocket' ]
})

const app = feathers()
  .configure(socketio(socket, { timeout: 10000, 'force new connection': true }))
  .configure(auth({ path: '/auth/authentication' }))

let accessToken
const authenticate = async (email, password) => {
  try {
    const res = await app.authenticate({ strategy: 'local', email, password })
    logger.info('Successfully authenticated against auth API')

    accessToken = res.accessToken
  } catch (e) {
    logger.error(`Error authenticating against auth API: ${e.message}`)

    await delay(5000)

    return authenticate(email, password)
  }
}

const init = async (email, password) => {
  if (!accessToken) {
    await authenticate(email, password)
  }

  return app
}

const getAccessToken = () => {
  if (!accessToken) { throw new Error('No access token found.  Init must be executed first.') }

  return accessToken
}

module.exports = {
  init,
  app,
  getAccessToken
}
