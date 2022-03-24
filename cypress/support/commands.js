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
    cy.get('#username').type(user);
    cy.get('#password').type(password);
    cy.contains('button', 'Log in').click();   
    
});

Cypress.Commands.add('textExists', (selector, textLabel) => {
    cy.iframe("#atat-app")
        .find(selector)
        .should("be.visible")
        .and("have.text", textLabel);
});

Cypress.Commands.add('enterTextInTextField', (selector, text) => {
    cy.iframe("#atat-app")
        .find(selector)
        .should("be.visible")
        .type(text)
        .should("have.value", text);
});

Cypress.Commands.add('btnExists', (selector, text) => {
    cy.iframe("#atat-app")
        .find(selector)
        .should("be.visible")
        .and("have.text", text);  
});

Cypress.Commands.add('radioBtn', (selector,text) => {
    cy.iframe("#atat-app")
        .find(selector).should("have.value", text);  
});

Cypress.Commands.add( "hoverToolTip", (selector, selector1, expectedText) => {
    cy.iframe("#atat-app")
        .find(selector)
        .should("be.visible")        
        .realHover();
    cy.textExists(selector1, expectedText);  
});

Cypress.Commands.add("clickSideStepper", (stepper_Selector,stepperText) => {
        cy.iframe("#atat-app")
            .find(stepper_Selector)
            .should("be.visible")
            .and("have.length", 1)
            .and('contain', stepperText)
            .click();
});

Cypress.Commands.add("dropDownClick", (selector) => {
    cy.iframe("#atat-app")
        .find(selector).click();  
});

Cypress.Commands.add("autoCompleteSelection", (selector, inputText, selector1) => {
    cy.iframe("#atat-app")
        .find(selector).type(inputText);
    cy.iframe("#atat-app").find(selector1).first().click({ force: true });  
});

Cypress.Commands.add("completePercent", () => {        
    let percentComplete = 0;
    cy.iframe('#atat-app')
        .find(".global-side-nav-bar .completed-check[data-substep-complete-percentage]")
        .each(($el) => {
            const text = $el[0].dataset.substepCompletePercentage;
            cy.wrap(text);
            percentComplete = percentComplete + parseFloat(text);
            
        }).then(() => {
            return percentComplete;
        });
});

Cypress.Commands.add("fillNewAcquisition", (projectTitle, scope) => {    
    cy.enterTextInTextField("#ProjectTitle_text_field", projectTitle);
    cy.enterTextInTextField("#ProjectScope_text_area", scope);
    cy.iframe("#atat-app")
        .find("#Radio_Yes").should("have.value", "yes")
        .click({ force: true });
    cy.btnExists("#ContinueButton", " Continue ").click();  
});

Cypress.Commands.add("fillSurgeCapabilities", (percentage, clickContinue) => {
    cy.iframe("#atat-app")
        .find("#ContractPricePercentage_text_field")
        .should("be.visible")
        .clear().type(percentage).blur({ force: true })
        .then(($el) => {
            cy.log($el.val());
            const enteredText = $el.val();
            const showError = (() => {
                cy.iframe("#atat-app")
                    .find("#ContractPricePercentage_text_field_control .field-error")
                    .should("contain.text", "Please enter a number between 1-50");
            });

            if (enteredText < 1 || enteredText > 50) {
                showError();
            } else if (isNaN(parseInt(enteredText))) {
                showError();
            } else {
                cy.iframe("#atat-app")
                    .find("#ContractPricePercentage_text_field_control")
                    .should("not.contain", "Please enter a number between 1-50");
            };
        });
    if (clickContinue) {
        cy.btnExists("#ContinueButton", " Continue ").click();
    };         
});

Cypress.Commands.add("serviceOrAgency", (inputText) => {
    cy.dropDownClick("#ServiceOrAgency_AutoComplete_Wrapper .v-input__icon.v-input__icon--append");
    cy.autoCompleteSelection("#ServiceOrAgency", inputText, "#ServiceOrAgency_AutoComplete_Wrapper .v-list-item__title");
    cy.iframe("#atat-app")
        .find("#ServiceOrAgency")
        .then(($option) => {
            const selectedOption = $option.val();
            cy.log(selectedOption);
            if (selectedOption === "Defense Information Systems Agency (DISA)") {
                cy.iframe("#atat-app").find("#DisaOrg_AutoComplete_Wrapper")
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "DISA Organization");
            } else {
                cy.iframe("#atat-app").find("#OrgName_text_field_control")
                    .should("exist")
                    .and("be.visible")
                    .and("contain", " Organization name ");
            };
        }); 
});

Cypress.Commands.add("enterOrganizationAddress", (StreetAddress, Unit, City, State, Zipcode) => {
    cy.enterTextInTextField("#StreetAddress_text_field", StreetAddress);
    cy.enterTextInTextField("#UnitSuite_text_field", Unit);
    cy.enterTextInTextField("#City_text_field", City);
    cy.autoCompleteSelection("#State", State, "#State_AutoComplete_Wrapper .v-list-item__title");
    cy.enterTextInTextField("#ZIP_text_field", Zipcode);            
});  

Cypress.Commands.add("contactRoleRadioBtnOption", (selector) => {
    cy.iframe("#atat-app")
    .find(selector).click({ force: true });
    cy.iframe("#atat-app")
    .find("#ContactRole_radio_group_control .v-item--active")
        .then(($radioBtn) => {
            cy.log($radioBtn.text());
            const selectedOption = $radioBtn.text();
            if (selectedOption === "radio_button_checkedMilitary") {
                cy.iframe("#atat-app").find("#Rank_dropdown_field_control")
                    .should('exist')
                    .and("be.visible")
                    .and("contain", "Rank");
                cy.iframe("#atat-app").find("#ContactGrade_AutoComplete_Wrapper")
                    .should('exist')
                    .and("not.visible");
            } else if (selectedOption === "radio_button_checkedContractor") {
                cy.iframe("#atat-app").find("#Salutation_dropdown_field_label")
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Salutation");
                cy.iframe("#atat-app").find('#ContactGrade_AutoComplete_Wrapper')
                    .should("exist")
                    .and("not.visible");
            } else if (selectedOption === "radio_button_checkedCivilian") {
                cy.iframe("#atat-app").find("#ContactGrade_AutoComplete_Wrapper")
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Grade");
                cy.iframe("#atat-app").find("#Salutation_dropdown_field_label")
                    .should('exist')
                    .and("be.visible")
                    .and("contain", "Salutation");
                cy.iframe("#atat-app").find("#Rank_dropdown_field_control")
                    .should("exist")
                    .and("not.visible");
            };
    });  
});

Cypress.Commands.add("enterContactInformation", (firstName_selector,firstName, mName_selector,mName,lastName_selector,lastName, email_selector,email,phone_selector,phone ) => {    
    cy.enterTextInTextField(firstName_selector, firstName);
    cy.enterTextInTextField(mName_selector, mName);
    cy.enterTextInTextField(lastName_selector, lastName);    
    cy.enterTextInTextField(email_selector, email);
    cy.enterTextInTextField(phone_selector, phone);
});

