
var Sails = require('sails').Sails;

export default class SailsServer {

  sails = null

  lift(additionalConfig){

    // Add additionalConfig to default config
    const config = {
      ...additionalConfig,
      permissionsTest : true,
      hooks: {
        "sails-role-permissions": require('../../src/index.js'),
        "grunt": false
      },
      log: {level: "error"},
    }

    return new Promise((resolve, reject) => {
      // Attempt to lift sails
      Sails().lift(config, (err, sails) => {
        if (err || !sails) return reject(err)
        this.sails = sails
        resolve()
      })
    })
  }

  lower(){
    return new Promise((resolve, reject) => {
      this.sails.lower(resolve)
    })
  }
}
