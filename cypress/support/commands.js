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
Cypress.Commands.add("fillCreatePortfolioform", (pName) => {
  cy.get("div.v-stepper.wizard-stepper").contains(
    "1 Create Portfolio 2 Add Funding 3 Add Application 4 Add Team Members 5 Review and Submit"
  );
  cy.get("#portfolio-name_text_field").type(pName);
  cy.get("#portfolio-description_text_field")
    .type("Portfolio description goes here")
    .should("have.value", "Portfolio description goes here");
  cy.get("#dod-component label").first().click();
  cy.get("#csp-button-card-1").contains("CSP A").click();
});
