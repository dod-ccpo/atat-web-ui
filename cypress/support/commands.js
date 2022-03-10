// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-iframe';

Cypress.Commands.add('login', (user, password) => {    
    cy.get('#username').type(user)
    cy.get('#password').type(password)
    cy.contains('button', 'Log in').click()    
    
});

Cypress.Commands.add('textExists', (selector, textLabel) => {
    cy.iframe("#atat-app")
            .find(selector)
            .should("be.visible")
            .and("have.text", textLabel)    
})

Cypress.Commands.add('enterTextInTextField', (selector, text) => {
    cy.iframe("#atat-app")
            .find(selector)
            .should("be.visible")
            .type(text)
            .should("have.value", text)   
})

Cypress.Commands.add('completePercent', () => {
       
  let percentComplete = 0
  cy.iframe('#atat-app')
    .find(".global-side-nav-bar .completed-check[data-substep-complete-percentage]")
    .each(($el) => {
               
      const text = $el[0].dataset.substepCompletePercentage
      cy.wrap(text)
      percentComplete = percentComplete + parseFloat(text)                      
            
    }).then(() => {              
            return percentComplete
    })
});