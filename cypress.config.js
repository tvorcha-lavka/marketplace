const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
    },
    env: {
      backendUrl: 'http://localhost:8000',
    },
    specPattern: 'auto-tests/e2e/**/*.cy.{js,jsx,ts,tsx}',  // Path to all tests
    supportFile: 'auto-tests/support/e2e.{js,jsx,ts,tsx}',  // Support file path
  },
});
