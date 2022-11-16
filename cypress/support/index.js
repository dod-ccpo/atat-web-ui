// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './DOW'
import './portfolioSummary'
import "./evalCriteria";
import "cypress-real-events/support";
import '@cypress/code-coverage/support';
require('cypress-plugin-tab')

/**
 * used to prevent selected tests from running
 */
import registerCypressGrep from 'cypress-grep'
registerCypressGrep()

// Alternatively you can use CommonJS syntax:
// require('./commands')
