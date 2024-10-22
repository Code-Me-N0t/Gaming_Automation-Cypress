const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      // require('./cypress-mochawesome-reporter/plugin')(on);
    },
  },
  // video: true,
  waitForAnimations: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 6000,
  // retries: {
  //   "runMode": 2,
  //   "openMode": 2
  // }
});