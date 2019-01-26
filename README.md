# HumanDB Auth API Connector

This module provides an easy and convenient way for node.js apps to connect to the HumanDB Authorization API.  Your container must have an existing authorized API user in order to connect.

## Usage

The init function returns an authenticated feathers app instance that connects to the auth API via websockets.  For more info on how to use the feathers client, see the [official Feathers documentation](https://docs.feathersjs.com/).

First add the module to your package.json:

### Yarn

```
yarn add https://github.com/jordandenison/humandb-auth-connector.git
```

### NPM

```
npm install --save https://github.com/jordandenison/humandb-auth-connector.git
```

Example authenticating and fetching the "owner" user:


```
const { init } = require('humandb-auth-api-connector')

const authApiUsername = 'test'
const authApiPassword = 'test'

const start = async () => {
  const app = await init(authApiUsername, authApiPassword)

  const results = await app.service('user').find({ query: { role: 'owner' } })
  const [owner] = results.data

  console.log('owner ', owner)

//    {
//      id: '8210dd2a-0648-426a-bcf3-2ebd3b573826',
//      firstName: null,
//      lastName: null,
//      email: 'jordan@denisonweb.com',
//      role: 'owner',
//      lastLoginDate: '2019-01-22T17:48:10.820Z',
//      addressLine1: null,
//      addressLine2: null,
//      city: null,
//      postal: null,
//      state: null,
//      stateCode: null,
//      country: null,
//      countryCode: null,
//      oneUpAccessToken: '<token>',
//      oneUpClientId: '<clientId>',
//      createdAt: '2019-01-19T21:42:23.369Z',
//      updatedAt: '2019-01-25T22:08:55.190Z'
//    }
}
```

## REST API Example

If node.js and/or a websockets connection is not desired, feathers also exposes a REST API.  For example:

Getting an access token:
```
curl -X POST -d "strategy=local&email=test&password=test" http://localhost/auth/authentication
```

Getting the users list

```
curl -H "Accept: application/json" -H "Authorization: Bearer <token>" http://localhost/auth/user
```

For more info on how to use the feathers REST API, see the [Feathers REST API documentation](https://docs.feathersjs.com/api/client/rest.html).