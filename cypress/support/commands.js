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
import common from '../selectors/common.sel';
import projectOverview from '../selectors/projectOverview.sel.js';
import contact from '../selectors/contact.sel';
import org from '../selectors/org.sel';
import financialDetail from '../selectors/financialDetails.sel';
import commonCorAcor from '../selectors/commonCorAcor.sel';
import acor from '../selectors/acor.sel';
import background from '../selectors/background.sel';
import {cleanText,colors} from "../helpers";

const isTestingLocally = Cypress.env("isTestingLocally") === "true";
const runTestsInIframe = Cypress.env("isTestingInIframe") === "true";

Cypress.Commands.add("launchATAT", () => {
    if (isTestingLocally){
        cy.visit(Cypress.env("localTestURL"));    
        if (runTestsInIframe) {
            cy.visit(Cypress.env("localTestURLInIframe"));    
            cy.frameLoaded(common.app);        
        } else {
            cy.visit(Cypress.env("localTestURL"));    
        }
    } else {
        cy.visit(Cypress.env("testURL"));    
        cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
        cy.get(common.title).should('have.text', 'DISA Sandbox home page - DISA Sandbox');
        cy.frameLoaded(common.app);
    }
});

Cypress.Commands.add('login', (user, password) => {  
    cy.get('#username').type(user);
    cy.get('#password').type(password);
    cy.contains('button', 'Log in').click();   
});

Cypress.Commands.add("findElement", (selector) => {
    if (runTestsInIframe || !isTestingLocally) {
        cy.iframe(common.app).find(selector)       
    } else {
        cy.get(selector);
    }
});

Cypress.Commands.add('textExists', (selector, textLabel) => {
    cy.findElement(selector)
        .should("be.visible")
        .and("contain.text", textLabel);
});

Cypress.Commands.add('enterTextInTextField', (selector, text) => {
    cy.findElement(selector)
        .should("be.visible")
        .clear()
        .type(text)
        .should("have.value", text);
});

Cypress.Commands.add('btnExists', (selector, text) => {
    cy.findElement(selector)
        .should("be.visible")
        .and("have.text", text);  
});

Cypress.Commands.add('radioBtn', (selector,value) => {
    cy.findElement(selector).should("have.value", value);  
});

Cypress.Commands.add("hoverToolTip", (selector, selector1, expectedText) => {
    cy.findElement(selector)
            .should("be.visible")        
            .realHover();
    cy.findElement(selector1).then(($el) => {
            let actualTxt = $el.text();            
            const formattedTxt = cleanText(actualTxt);
            cy.log(formattedTxt);
            expect(formattedTxt).equal(expectedText);
            
        }) 
});

Cypress.Commands.add("checkErrorMessage", (selector, errorMessage) => {
    cy.findElement(selector).should("contain.text", errorMessage);  
});

Cypress.Commands.add("clickSideStepper", (stepper_Selector,stepperText) => {
        cy.findElement(stepper_Selector)
            .should("be.visible")
            .and("have.length", 1)
            .and('contain', stepperText)
            .click();
});

Cypress.Commands.add("dropDownClick", (selector) => {
    cy.findElement(selector).click();  
});

Cypress.Commands.add("autoCompleteSelection", (selector, inputText, selector1) => {
    cy.findElement(selector).type(inputText);
    cy.findElement(selector1).first().click({ force: true });  
});

Cypress.Commands.add("autoCompletePhoneCountrySelection", (selector, inputText, selector1) => {
    cy.findElement(selector).type(inputText, { force: true });
    cy.findElement(selector1).first().click({ force: true });
    
});

Cypress.Commands.add("completePercent", () => {        
    let percentComplete = 0;
    cy.findElement(common.completePercentage)
        .each(($el) => {
            const text = $el[0].dataset.substepCompletePercentage;
            cy.wrap(text);
            percentComplete = percentComplete + parseFloat(text);
            
        }).then(() => {
            return percentComplete;
        });
});

Cypress.Commands.add("fillNewAcquisition", (projectTitle, scope) => {    
    cy.enterTextInTextField(projectOverview.projectTitleTxtBox, projectTitle);
    cy.enterTextInTextField(projectOverview.scopeTxtBox, scope);
    cy.findElement(projectOverview.radioBtnYes).should("have.value", "yes")
        .click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").click();  
});

Cypress.Commands.add("fillSurgeCapabilities", (percentage, clickContinue) => {
    cy.findElement(financialDetail.contractPricePercentageTxtBox)
        .should("be.visible")
        .clear().type(percentage).blur({ force: true })
        .then(($el) => {
            cy.log($el.val());
            const enteredText = $el.val();
            const showError = (() => {
                cy.findElement(financialDetail.contractPriceError)
                    .should("contain.text", "Please enter a number between 1-50");
            });

            if (enteredText < 1 || enteredText > 50) {
                showError();
            } else if (isNaN(parseInt(enteredText))) {
                showError();
            } else {
                cy.findElement(financialDetail.contractPriceControl)
                    .should("not.contain", "Please enter a number between 1-50");
            };
        });
    if (clickContinue) {
        cy.btnExists(common.continueBtn, " Continue ").click();
    };         
});

Cypress.Commands.add("serviceOrAgency", (inputText) => {
    cy.dropDownClick(org.serviceAgencyDropDownIcon);
    cy.autoCompleteSelection(org.serviceAgencyInput, inputText, org.serviceAgencyAutoListItems);
    cy.findElement(org.serviceAgencyInput)
        .then(($option) => {
            const selectedOption = $option.val();
            cy.log(selectedOption);
            if (selectedOption === "Defense Information Systems Agency (DISA)") {
                cy.findElement(org.disaOrgAutoComplete)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "DISA Organization");
            } else {
                cy.findElement(org.orgNameControl)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", " Organization name ");
            };
        }); 
});

Cypress.Commands.add("selectTypeOfMailingAddress", (radio_selector, value) => {
    cy.radioBtn(radio_selector, value).click({ force: true });
    cy.findElement(org.addressTypeRadioActive)
        .then(($radioBtn) => {
            const selectedOption = $radioBtn.text();
            cy.log(selectedOption);
            const commonFields = (() => {
                cy.textExists(org.streetLabel, " Street address ");
                cy.textExists(org.unitLabel, " Unit, suite, etc.  Optional ");
            });
            commonFields();
            if (selectedOption === "radio_button_checkedU.S. address") {                
                cy.textExists(org.cityLabel, " City ");
                cy.textExists(org.stateLabel, " State ");
                cy.textExists(org.zipCodeLabel, " ZIP code ");
            }
            if (selectedOption === "radio_button_checkedMilitary") {                
                cy.textExists(org.zipCodeLabel, " ZIP code ");
                cy.textExists(org.stateCodeDropDownLabel, " State code ");
                cy.textExists(org.apoFpoDropDownLabel, " APO/FPO ");
            }
            if (selectedOption === "radio_button_checkedForeign address") {
                cy.textExists(org.cityLabel, " City ");
                cy.textExists(org.stateProvinceLabel, " State or Province ​");
                cy.textExists(org.zipCodeLabel, " Postal code ");
                cy.textExists(org.countryLabel, " Country ");
            };
        });            
});

Cypress.Commands.add("enterOrganizationAddress", (orgAddress)    => {
    cy.findElement(org.addressTypeRadioActive)
        .then(($radioBtn) => {
            const selectedOption = $radioBtn.text();
            cy.log(selectedOption);
            const enterCommonFields = (() => {
                cy.enterTextInTextField(org.streetTxtBox, orgAddress.streetAddress);
                cy.enterTextInTextField(org.unitTxtBox, orgAddress.unit);
            });
            enterCommonFields();
            if (selectedOption === "radio_button_checkedU.S. address") {                
                //Assert Organization's address labels
                cy.enterTextInTextField(org.cityTxtBox, orgAddress.city);
                cy.autoCompleteSelection(org.stateTxtBox, orgAddress.state, org.stateAutoCompleteList);
                cy.enterTextInTextField(org.zipCodeTxtBox,orgAddress.zipCode);
            }
            if (selectedOption === "radio_button_checkedMilitary (APO or FPO)") {
                //Assert Organization's address labels
                
                cy.findElement(org.apoFpoDropDown).click({ force: true });
                cy.findElement(orgAddress.apoFPO_selector).click({ force: true });
                cy.findElement(org.stateCodeDropDown).click({ force: true });
                cy.findElement(orgAddress.statecode_selector).click();
                cy.enterTextInTextField(org.zipCodeTxtBox, orgAddress.zipCode);
            }
            if (selectedOption === "radio_button_checkedForeign address") {  
                cy.enterTextInTextField(org.cityTxtBox, orgAddress.city);
                cy.enterTextInTextField(org.stateProvinceTxtBox, orgAddress.stateProvince);
                cy.enterTextInTextField(org.zipCodeTxtBox, orgAddress.zipCode);
                cy.autoCompleteSelection(org.countryInput, orgAddress.inputCountryName, org.countryListItems);
            }
        });
});

Cypress.Commands.add("contactRoleRadioBtnOption", (selector,value) => {
    cy.radioBtn(selector, value).click({ force: true });
    cy.findElement(contact.contactRadioBtnActive)
        .then(($radioBtn) => {
            cy.log($radioBtn.text());
            const selectedOption = $radioBtn.text();
            if (selectedOption === "radio_button_checkedMilitary") {
                cy.findElement(contact.serviceBranchControl)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Service branch");
                cy.findElement(contact.serviceBranchDropDownIcon).click({ force: true });
                cy.findElement(contact.serviceDropDownList).first().click();
                cy.findElement(contact.rankAutoCompleteWrapper)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Rank");
                cy.findElement(contact.gradeAutoCompleteWrapper)
                    .should("exist")
                    .and("not.visible");
            }
            if (selectedOption === "radio_button_checkedContractor") {
                cy.findElement(contact.salutationDropDownLabel)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Salutation");
                cy.findElement(contact.gradeAutoCompleteWrapper)
                    .should("exist")
                    .and("not.visible");
            }
            if (selectedOption === "radio_button_checkedCivilian") {
                cy.findElement(contact.gradeAutoCompleteWrapper)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Grade");
                cy.findElement(contact.salutationDropDownLabel)
                    .should('exist')
                    .and("be.visible")
                    .and("contain", "Salutation");
                cy.findElement(contact.serviceBranchControl)
                    .should("exist")
                    .and("not.visible");
            }
    });  
});

Cypress.Commands.add("enterContactInformation", (contactInformation ) => {    
    cy.enterTextInTextField(contactInformation.firstName_selector,contactInformation.firstName);
    cy.enterTextInTextField(contactInformation.mName_selector,contactInformation.mName);
    cy.enterTextInTextField(contactInformation.lastName_selector,contactInformation.lastName);    
    cy.enterTextInTextField(contactInformation.email_selector,contactInformation.email);
    if (contactInformation.cor) {
        
        const expectedText = "A DoDAAC is a 6-character code that uniquely identifies a unit, activity, or organization that has the authority to requisition, contract for, or fund/pay bills for materials and services.";
        cy.hoverToolTip(commonCorAcor.toolTipBtnDodaac, commonCorAcor.toolTipTxtDodaac, expectedText);
        //Assert the labels
        cy.textExists(commonCorAcor.dodaacLabel, " DoD Activity Address Code (DoDAAC) ");
        cy.textExists(commonCorAcor.accessRadioGroup, " Does this individual need access to help you create this acquisition package in ATAT? ");
        //enter DoDAAC
        cy.enterTextInTextField(commonCorAcor.dodaacTxtBox, contactInformation.dodText);
        //radio buttons
        cy.radioBtn(commonCorAcor.accessYesRadioBtn, "yes");
        cy.radioBtn(commonCorAcor.accessNoRadioBtn, "no");
    }
});

Cypress.Commands.add("enterPhoneNumber", (icon_selector, country_selector, countryText, option_selector, number_selector, numberValue) => {
    cy.dropDownClick(icon_selector);
    cy.autoCompletePhoneCountrySelection(country_selector, countryText, option_selector);
    cy.findElement(number_selector).type(numberValue);
            
});

Cypress.Commands.add("checkIfCorOrAcor", (header_selector, headerText, contactName) => {
    cy.textExists(header_selector, headerText);
    cy.findElement(commonCorAcor.ditcoLink)
        .should("exist")
        .and("contain", " https://www.ditco.disa.mil/hq/cor/index.asp.");
    cy.findElement(commonCorAcor.searchContactWrapper)
        .should("exist");
    cy.findElement(commonCorAcor.searchContactInput).type(contactName);  
    cy.findElement(commonCorAcor.searchContactActive)
        .then(($el) => {
            const result = $el.text();
            cy.log("ResultValue", result);
            if (result.indexOf("No results found") > -1) {
                cy.findElement(commonCorAcor.searchContactNoResult)
                    .should('exist')
                    .and("be.visible")
                    .and("contain", " No results found. ");   
                cy.findElement(commonCorAcor.searchContactNoResultLink).should("be.visible")
                cy.findElement(common.header).click();
            } else {
                cy.findElement(commonCorAcor.searchContactListItems)
                    .first().click({force: true});
                cy.findElement(commonCorAcor.selectedContactCard)
                    .should("exist")
                    .and("be.visible");
                cy.findElement(commonCorAcor.contactFormToggle)
                    .should("exist")
                    .and("not.visible");
            }
        });
});

Cypress.Commands.add("manuallyEnterContactInformation", (manualEnterText, nameText, contactAffiliationText, radioSelector, radioValue) => {
    cy.btnExists(commonCorAcor.contactFormToggle, manualEnterText).click();
    cy.textExists(commonCorAcor.contactHeaderTxt, nameText);
    cy.textExists(commonCorAcor.contactAffRadioGroupTxt, contactAffiliationText)
    cy.radioBtn(radioSelector, radioValue).click({ force: true });
    cy.findElement(commonCorAcor.serviceBranchDropdown).click({ force: true });
    cy.findElement(commonCorAcor.serviceBranchDropdownList).first().click();
    cy.findElement(commonCorAcor.contactAffRadioActive)
        .then(($radioBtn) => {
            cy.log($radioBtn.text());
            const selectedOption = $radioBtn.text();
            if (selectedOption === "radio_button_checkedMilitary") {
                cy.findElement(commonCorAcor.rankAutoWrapper)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Rank");
                cy.findElement(commonCorAcor.salutationLabel)
                    .should("exist")
                    .and("not.visible");
                //Click Rank dropdown
                cy.dropDownClick(commonCorAcor.rankInput);
                //select the value from Rank Dropdown
                cy.findElement(commonCorAcor.rankAutoCompleteList)
                    .first().click({ force: true });
            } else if (selectedOption === "radio_button_checkedContractor") {
                cy.findElement(commonCorAcor.salutationDropDownControl)
                    .should("exist")
                    .and("be.visible")
                    .and("contain", "Salutation");
                cy.findElement(commonCorAcor.rankAutoWrapper)
                    .should("exist")
                    .and("not.visible");
            }
        });
});

Cypress.Commands.add("selectedContactInformation", (nameText, email, phone, orgName, message, requestLink, removeLink) => {
    cy.textExists(commonCorAcor.selectedContactCardName, nameText);
    cy.textExists(commonCorAcor.selectedContactCardEmail, email);
    cy.textExists(commonCorAcor.selectedContactCardPhone, phone);
    cy.textExists(commonCorAcor.selectedContactCardOrgName, orgName);
    cy.textExists(commonCorAcor.selectedContactCardMessage, message);
    cy.btnExists(commonCorAcor.requestedContactChangeLink, requestLink);
    cy.btnExists(commonCorAcor.removeSelectedContactInfoLink, removeLink);
});

Cypress.Commands.add("requestChangeContactInformation", (requestLink, requestTitle, message, inputText) => {
    cy.btnExists(commonCorAcor.requestedContactChangeLink, requestLink).click();
    cy.textExists(commonCorAcor.requestModalTitle, requestTitle);
    cy.textExists(commonCorAcor.requestModalMessage, message);
    cy.enterTextInTextField(commonCorAcor.infoChangeTxtBox, inputText);
    cy.btnExists(commonCorAcor.sendRequestBtn, " Send Request ").and("to.be.disabled");
    cy.btnExists(commonCorAcor.cancelRequestBtn, "Cancel ").not("to.be.disabled");

});

Cypress.Commands.add("acorOption", (radio_selector, value) => {
    cy.textExists(common.header, " Do you have an Alternate Contracting Officer’s Representative (ACOR)? ");
    cy.radioBtn(radio_selector, value).click({ force: true });
    cy.findElement(acor.activeRadioOption)
        .then(($radioBtn) => {
            const selectedOption = $radioBtn.text();
            cy.log(selectedOption);
            cy.btnExists(common.continueBtn, ' Continue ').click();
            if (selectedOption === "radio_button_checkedYes") {
                //naviagtes to ACOR
                cy.textExists(common.header, " Let’s gather info about your ACOR ");
            } else {
                cy.findElement("div").contains("Summary");
            }
        });

});


Cypress.Commands.add("contractOption", (radio_selector, value) => {
    cy.textExists(common.header, " Do you have a current contract for this effort? ");
    cy.radioBtn(radio_selector, value).click({ force: true });
    cy.findElement(background.activeRadioOption).then(($radioBtn) => {
        const selectedOption = $radioBtn.text();
        cy.log(selectedOption);
        cy.btnExists(common.continueBtn, ' Continue ').click();
        if (selectedOption === "radio_button_checkedYes. There is a current contract for this effort.") {
            //naviagtes to ACOR
            cy.textExists(common.header, " Let’s gather some details about your current contract ");
        }
        else {
            cy.findElement(common.stepBackgroundLink).contains(" Background ")
                .and('have.css', 'color', colors.primary);
        }          
    })
});