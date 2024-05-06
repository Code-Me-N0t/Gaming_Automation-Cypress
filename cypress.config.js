const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      require('C:/Users/Reden Longcop/Documents/CYPRESS/sidebet_automation/cypress-mochawesome-reporter/plugin')(on);
    },
  },
  video: true,
  scrollBehavior: 'top',
  waitForAnimations: true
});