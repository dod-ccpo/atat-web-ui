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

Cypress.Commands.add('radioBtn', (selector,value) => {
    cy.iframe("#atat-app")
        .find(selector).should("have.value", value);  
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

Cypress.Commands.add("contactRoleRadioBtnOption", (selector,value) => {
    cy.radioBtn(selector, value).click({ force: true });
    cy.iframe("#atat-app")
    .find("#ContactRole_radio_group_control .v-item--active")
        .then(($radioBtn) => {
            cy.log($radioBtn.text());
            const selectedOption = $radioBtn.text();
            if (selectedOption === "radio_button_checkedMilitary") {
                cy.iframe("#atat-app").find("#Branch_dropdown_field_control")
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Service branch");
                cy.iframe("#atat-app")
                    .find("#Branch_dropdown_field_control .v-input__append-inner > .v-icon").click({ force: true });
                cy.iframe("#atat-app")
                    .find("#Branch_dropdown_field_control .v-list").first().click()
                cy.iframe("#atat-app").find("#Rank_AutoComplete_Wrapper")
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Rank");
                cy.iframe("#atat-app").find('#ContactGrade_AutoComplete_Wrapper')
                    .should("exist")
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
                cy.iframe("#atat-app").find("#Branch_dropdown_field_control")
                    .should("exist")
                    .and("not.visible");
            };
    });  
});

Cypress.Commands.add("enterContactInformation", (firstName_selector,firstName, mName_selector,mName,lastName_selector,lastName, email_selector,email,phone_selector,phone,cor,dodText ) => {    
    cy.enterTextInTextField(firstName_selector, firstName);
    cy.enterTextInTextField(mName_selector, mName);
    cy.enterTextInTextField(lastName_selector, lastName);    
    cy.enterTextInTextField(email_selector, email);
    cy.enterTextInTextField(phone_selector, phone);
    if (cor) {
        const expectedText = (" A DoDAAC is a 6-character code that uniquely identifies a \n        unit, activity, or organization that has the authority to requisition, \n        contract for, or fund/pay bills for materials and services. ");
        cy.hoverToolTip("#TooltipButton_DoDAAC", "#TooltipText_DoDAAC", expectedText);
        //Assert the labels
        cy.textExists("#DoDAAC_text_field_label", " DoD Activity Address Code (DoDAAC) ");
        cy.textExists("#AccessToEdit_radio_group_control legend", " Does this individual need access to help you create this acquisition package in ATAT? ");
        //enter DoDAAC
        cy.enterTextInTextField("#DoDAAC_text_field", dodText);
        //radio buttons
        cy.radioBtn("#Radio_AccessToEditYes", "yes");
        cy.radioBtn("#Radio_AccessToEditNo", "no");
    };
});

Cypress.Commands.add("checkIfCorOrAcor", (header_selector, headerText, contactName) => {
    cy.textExists(header_selector, headerText);
    cy.iframe("#atat-app")
        .find(".page-intro .text-link")
        .should("exist")
        .and("contain", " https://www.ditco.disa.mil/hq/cor/index.asp.");
    cy.iframe("#atat-app").find("#SearchContact_AutoComplete_Wrapper")
        .should("exist");
    cy.iframe("#atat-app")
        .find("#SearchContact").type(contactName);  
    cy.iframe("#atat-app").find("#SearchContact_AutoComplete_Wrapper .menuable__content__active.v-autocomplete__content")
        .then(($el) => {
            const result = $el.text();
            cy.log("ResultValue", result);
            if (result.indexOf("No results found") > -1) {
                cy.iframe("#atat-app").find("#SearchContact_AutoComplete_Wrapper .no-results")
                    .should('exist')
                    .and("be.visible")
                    .and("contain", " No results found. ");   
                cy.iframe("#atat-app").find("a#NoResults_SearchContact").should("be.visible")
                cy.iframe("#atat-app")
                    .find("h1.page-header").click();
            } else {
                cy.iframe("#atat-app").find("#SearchContact_AutoComplete_Wrapper .v-list-item__title")
                    .first().click({force: true});
                cy.iframe("#atat-app").find("#SelectedContactCard")
                    .should("exist")
                    .and("be.visible");
                cy.iframe("#atat-app").find("#ContactFormToggle")
                    .should("exist")
                    .and("not.visible");
            };
        });
});

Cypress.Commands.add("manuallyEnterContactInformation", (manualEnterText, nameText, contactAffiliationText, radioSelector, radioValue) => {
    cy.btnExists("#ContactFormToggle", manualEnterText).click();
    cy.textExists("#ContactInfoHeader", nameText);
    cy.textExists("#ContactAffiliation_radio_group_control legend", contactAffiliationText)
    cy.radioBtn(radioSelector, radioValue).click({ force: true });
    cy.iframe("#atat-app")
        .find("#Branch_dropdown").click({ force: true });
    cy.iframe("#atat-app")
        .find("#Branch_dropdown_field_control .v-list").first().click();
    cy.iframe("#atat-app")
        .find("#ContactAffiliation_radio_group_control .v-item--active")
        .then(($radioBtn) => {
            cy.log($radioBtn.text());
            const selectedOption = $radioBtn.text();
            if (selectedOption === "radio_button_checkedMilitary") {
                cy.iframe("#atat-app").find('#Rank_AutoComplete_Wrapper')
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Rank");
                cy.iframe("#atat-app").find("#Salutation_dropdown_field_label")
                    .should("exist")
                    .and("not.visible");
                //Click Rank dropdown
                cy.dropDownClick("#Rank");
                //select the value from Rank Dropdown
                cy.iframe('#atat-app').find("#Rank_AutoComplete_Wrapper .v-list-item__title")
                    .first().click({ force: true });
            } else if (selectedOption === "radio_button_checkedContractor") {
                cy.iframe("#atat-app").find("#Salutation_dropdown_field_control")
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Salutation");
                cy.iframe("#atat-app").find("#Rank_AutoComplete_Wrapper")
                    .should("exist")
                    .and("not.visible");
            };
        });
});

Cypress.Commands.add("selectedContactInformation", (nameText, email, phone, orgName, message, requestLink, removeLink) => {
    cy.textExists("#SelectedContactCard_Name", nameText);
    cy.textExists("#SelectedContactCard_Email", email);
    cy.textExists("#SelectedContactCard_Phone", phone);
    cy.textExists("#SelectedContactCard_OrgName", orgName);
    cy.textExists("#SelectedContactCard_Message", message);
    cy.btnExists("#RequestContactChange", requestLink);
    cy.btnExists("#RemoveSelectedContactInfo", removeLink);
});

Cypress.Commands.add("requestChangeContactInformation", (requestLink, requestTitle, message, inputText) => {
    cy.btnExists("#RequestContactChange", requestLink).click();
    cy.textExists("#modalDialogTitle", requestTitle);
    cy.textExists("#modalDialogMessage", message);
    cy.enterTextInTextField("#InformationChange_text_area", inputText);
    cy.btnExists("#dialog_ok", " Send Request ").and("to.be.disabled");
    cy.btnExists("#dialog_cancel","Cancel ").not("to.be.disabled")

});

Cypress.Commands.add("acorOption", (radio_selector, value) => {
    cy.textExists("h1.page-header", " Do you have an Alternate Contracting Officer’s Representative (ACOR)? ");
    cy.radioBtn(radio_selector, value).click({ force: true });
    cy.iframe("#atat-app").find("#HasAlternateCOR_radio_group_control .v-item--active")
        .then(($radioBtn) => {
            const selectedOption = $radioBtn.text();
            cy.log(selectedOption);
            cy.btnExists("#ContinueButton", ' Continue ').click();
            if (selectedOption === "radio_button_checkedYes") {
                //naviagtes to ACOR
                cy.textExists("h1.page-header", " Let’s gather info about your ACOR ");
            } else {
                cy.iframe("#atat-app").find("div").contains("Summary");
            };
        });

});