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
import '@4tw/cypress-drag-drop';
import 'cypress-file-upload';
import common from '../selectors/common.sel';
import projectOverview from '../selectors/projectOverview.sel.js';
import contact from '../selectors/contact.sel';
import org from '../selectors/org.sel';
import financialDetail from '../selectors/financialDetails.sel';
import commonCorAcor from '../selectors/commonCorAcor.sel';
import acor from '../selectors/acor.sel';
import background from '../selectors/background.sel';
import contractDetails from '../selectors/contractDetails.sel';
import { 
  cleanText, 
  colors,   
} from "../helpers";
import sac from '../selectors/standComp.sel';
import occ from '../selectors/occ.sel'

const isTestingLocally = Cypress.env("isTestingLocally") === "true";
const runTestsInIframe = Cypress.env("isTestingInIframe") === "true";
let hopOutOfIframe = false;

Cypress.Commands.add("visitURL", () => {
  if (isTestingLocally) {
    if (runTestsInIframe && !hopOutOfIframe) {
      cy.visit(Cypress.env("localTestURLInIframe"));    
    } else {
      cy.visit(Cypress.env("localTestURL"));    
    }
  } else {
    if (runTestsInIframe && !hopOutOfIframe) {
      cy.visit(Cypress.env("testURL"));    
    } else {
      cy.visit(Cypress.env("disaNoIframeUrl"));    
    }
  }
})

Cypress.Commands.add("hopOutOfIframe", (hopOut, navigate) => {
  hopOutOfIframe = hopOut || false;
  if (navigate) {
    cy.visitURL();
  }
});

Cypress.Commands.add("launchATAT", () => {
  cy.hopOutOfIframe(false);
  if (isTestingLocally){
    cy.clearSession();
    if (runTestsInIframe) {
      cy.visit(Cypress.env("localTestURLInIframe"));    
      cy.frameLoaded(common.app);        
    } else {
      cy.visit(Cypress.env("localTestURL"));    
    }
  } else {
    cy.visit(Cypress.env("testURL"));    
    cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
    cy.clearSession();
    cy.get(common.title).should('have.text', 'DISA Sandbox home page - DISA Sandbox');
    cy.frameLoaded(common.app);
  }
  cy.window()
    .its("sessionStorage")
    .invoke("getItem", "ATAT_CONTACT_DATA_KEY")
    .should("exist");
  cy.window()
    .its("sessionStorage")
    .invoke("getItem", "ATAT_ORGANIZATION_DATA_KEY")
    .should("exist");
  cy.window()
    .its("sessionStorage")
    .invoke("getItem", "ATAT_ACQUISTION_PACKAGE_KEY")
    .should("exist");
});

Cypress.Commands.add("clearSession", () => {
  if (isTestingLocally) {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });      
  } else {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      const iframe = win.document.querySelector('iframe');
      iframe.contentWindow.sessionStorage.clear();
    });
  }
});

Cypress.Commands.add('login', (user, password) => {  
  cy.get('#username').type(user);
  cy.get('#password').type(password);
  cy.contains('button', 'Log in').click();   
});

Cypress.Commands.add("findElement", (selector) => {
  if (runTestsInIframe && !hopOutOfIframe) {
    cy.iframe(common.app).find(selector)       
  } else {
    cy.get(selector);
  }
});

Cypress.Commands.add('textExists', (selector, textLabel) => {
  textLabel = textLabel.trim();
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

Cypress.Commands.add('btnClick', (selector, text) => {
  cy.findElement(selector).scrollIntoView()
    .not("[disabled]").and("have.text", text).click()  
});

Cypress.Commands.add('radioBtn', (selector, value) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(selector).wait(0).should("have.value", value);  
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

Cypress.Commands.add("verifyRequiredInput", (textboxSelector,errorSelector,errorMessage) => {
  cy.findElement(textboxSelector).should("be.visible").clear()
    .focus().blur({ force: true }).then(() => {
      cy.checkErrorMessage(errorSelector, errorMessage);
    }); 
});

Cypress.Commands.add("verifyRequiredDropdown", (textboxSelector,errorSelector,errorMessage) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(textboxSelector).click({ force: true })
    .tab().wait(0).then(() => {
      cy.checkErrorMessage(errorSelector, errorMessage);
    })
});

Cypress.Commands.add("verifyRequiredCheckbox", (checkboxSelector, errorSelector, errorMessage) => {
  cy.findElement(checkboxSelector)
    .check({ force: true }).uncheck({ force: true })
    .then(() => {
      cy.checkErrorMessage(errorSelector, errorMessage);
    });
});

Cypress.Commands.add("verifyPageHeader", (headerText) => {
  cy.findElement(common.header).scrollIntoView().then(() => {
    cy.textExists(common.header,headerText );
  });
  
});

Cypress.Commands.add("findCheckBox", (selector,value) => {
  cy.findElement(selector)
    .should("have.value", value);
  
});

Cypress.Commands.add("checkBoxOption", (selector,value) => {
  cy.findElement(selector)
    .should('have.value', value)
    .and('not.checked');
    
});

Cypress.Commands.add("selectCheckBoxes", (checkBoxesSelectors) => {
  checkBoxesSelectors.forEach(selector => {
    cy.findElement(selector)
      .click({force:true}); 
  });
});

Cypress.Commands.add("verifyCheckBoxLabels", (selector,expectedLabels) => {
  const foundLabels = []
  const length= expectedLabels.length
  cy.findElement(selector)
    .should('have.length', length)    
    .each(($checkbox) => {
      cy.findElement(`label[for=${$checkbox.attr('id')}]`)        
        .invoke('text')
        .then((text) => foundLabels.push(cleanText(text)))     
    })
    .then(() => {
      expect(foundLabels).to.deep.equal(expectedLabels)
    })
  
});

Cypress.Commands.add("clickSideStepper", (stepperSelector,stepperText) => {
  cy.findElement(stepperSelector)
    .should("be.visible")
    .and("have.length", 1)
    .and('contain', stepperText)
    .click();
});

Cypress.Commands.add("activeStep", (selector) => {
  cy.findElement(selector)
    .should("be.visible")
    .and('have.css', 'color', colors.primary)
  
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

Cypress.Commands.add("messageDisplays", (selector,alertMessage) => {
  cy.findElement(selector).should("exist").then(($message) => {
    let actualTxt = $message.text();
    cy.log(actualTxt);
    const formattedTxt = cleanText(actualTxt)
    expect(formattedTxt).equal(alertMessage)
  })
    
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

Cypress.Commands.add("selectTypeOfMailingAddress", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
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
        cy.textExists(org.apoFpoDropDownLabel, " APO/FPO/DPO ");
      }
      if (selectedOption === "radio_button_checkedForeign address") {
        cy.textExists(org.cityLabel, " City ");
        cy.textExists(org.stateProvinceLabel, " State or Province ​");
        cy.textExists(org.postalCodeLabel, " Postal code ");
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
        cy.findElement(orgAddress.apoFPOSelector).click({ force: true });
        cy.findElement(org.stateCodeDropDown).click({ force: true });
        cy.findElement(orgAddress.statecodeSelector).click();
        cy.enterTextInTextField(org.zipCodeTxtBox, orgAddress.zipCode);
      }
      if (selectedOption === "radio_button_checkedForeign address") {  
        cy.enterTextInTextField(org.cityTxtBox, orgAddress.city);
        cy.enterTextInTextField(org.stateProvinceTxtBox, orgAddress.stateProvince);
        cy.enterTextInTextField(org.postalCodeTxtBox, orgAddress.zipCode);
        cy.autoCompleteSelection(
          org.countryInput,
          orgAddress.inputCountryName,
          org.countryListItems);
      }
    });
});

Cypress.Commands.add("contactRoleRadioBtnOption", (selector,value,sbSelector) => {
  cy.radioBtn(selector, value).click({ force: true }, { timeout: 1000 }).should("be.checked");
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
        cy.findElement(sbSelector)
          .click()
          .then(() => {
            cy.findElement(contact.rankAutoCompleteWrapper)
              .should("exist")
              .and("be.visible")
              .and("contain", "Rank");
            cy.findElement(contact.gradeAutoCompleteWrapper)
              .should("exist")
              .and("not.visible");
          });        
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
  cy.enterTextInTextField(contactInformation.firstNameSelector,contactInformation.firstName);
  cy.enterTextInTextField(contactInformation.mNameSelector,contactInformation.mName);
  cy.enterTextInTextField(contactInformation.lastNameSelector,contactInformation.lastName);    
  cy.enterTextInTextField(contactInformation.emailSelector,contactInformation.email);
  if (contactInformation.cor) {
        
    const expectedText =
        "A DoDAAC is a 6-character code that uniquely identifies a unit," +
        " activity, or organization that has the authority to requisition," +
        " contract for, or fund/pay bills for materials and services.";
    cy.hoverToolTip(commonCorAcor.toolTipBtnDodaac, commonCorAcor.toolTipTxtDodaac, expectedText);
    //Assert the labels
    cy.textExists(commonCorAcor.dodaacLabel, " DoD Activity Address Code (DoDAAC) ");
    const accessEditText = "Does this individual need access to help" +
          " you create this acquisition package in ATAT?"
    cy.findElement(commonCorAcor.accessRadioGroup).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(accessEditText);

    });
    //enter DoDAAC
    cy.enterTextInTextField(commonCorAcor.dodaacTxtBox, contactInformation.dodText);
    //radio buttons
    cy.radioBtn(commonCorAcor.accessYesRadioBtn, "YES");
    cy.radioBtn(commonCorAcor.accessNoRadioBtn, "NO");
  }
});

Cypress.Commands.add("enterPhoneNumber",
  (iconSelector, countrySelector, countryText, optionSelector, numberSelector, numberValue) => {
    cy.dropDownClick(iconSelector);
    cy.autoCompletePhoneCountrySelection(countrySelector, countryText, optionSelector);
    cy.findElement(numberSelector).type(numberValue);
            
  });

Cypress.Commands.add("checkIfCorOrAcor", (headerSelector, headerText, contactName) => {
  cy.textExists(headerSelector, headerText);
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

Cypress.Commands.add("manuallyEnterContactInformation",
  (manualEnterText, nameText, contactAffiliationText, radioSelector, radioValue) => {
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

Cypress.Commands.add("selectedContactInformation",
  (nameText, email, phone, orgName, message, requestLink, removeLink) => {
    cy.textExists(commonCorAcor.selectedContactCardName, nameText);
    cy.textExists(commonCorAcor.selectedContactCardEmail, email);
    cy.textExists(commonCorAcor.selectedContactCardPhone, phone);
    cy.textExists(commonCorAcor.selectedContactCardOrgName, orgName);
    cy.textExists(commonCorAcor.selectedContactCardMessage, message);
    cy.btnExists(commonCorAcor.requestedContactChangeLink, requestLink);
    cy.btnExists(commonCorAcor.removeSelectedContactInfoLink, removeLink);
  });

Cypress.Commands.add("requestChangeContactInformation",
  (requestLink, requestTitle, message, inputText) => {
    cy.btnExists(commonCorAcor.requestedContactChangeLink, requestLink).click();
    cy.textExists(commonCorAcor.requestModalTitle, requestTitle);
    cy.textExists(commonCorAcor.requestModalMessage, message);
    cy.enterTextInTextField(commonCorAcor.infoChangeTxtBox, inputText);
    cy.btnExists(commonCorAcor.sendRequestBtn, " Send Request ").and("to.be.disabled");
    cy.btnExists(commonCorAcor.cancelRequestBtn, "Cancel ").not("to.be.disabled");

  });

Cypress.Commands.add("acorOption", (radioSelector, value) => {
  cy.textExists(
    common.header,
    " Do you have an Alternate Contracting Officer’s Representative (ACOR)? "
  );
  cy.radioBtn(radioSelector, value).click({ force: true });
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


Cypress.Commands.add("contractOption", (radioSelector, value) => {
  cy.textExists(common.header, " Do you have a current contract for this effort? ");
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(background.activeRadioOption).then(($radioBtn) => {
    const selectedOption = $radioBtn.text();
    cy.log(selectedOption);
    cy.btnExists(common.continueBtn, ' Continue ').click();
    if (selectedOption === "radio_button_checkedYes. There is a current contract for this effort.")
    {
      //naviagtes to ACOR
      cy.textExists(common.header, " Let’s gather some details about your current contract ");
    }
    else {
      cy.findElement(common.stepContractDetailsText).contains(" Contract Details ")
        .and('have.css', 'color', colors.primary);
    }          
  })
});

Cypress.Commands.add("popLengthOptionYearExists", () => {
  cy.findElement(contractDetails.mainWrap)
    .then((main) => {
      if (main.find(contractDetails.optionRow).length > 0) {
        cy.log("Option1Row FOUND!");
        cy.findElement(contractDetails.baseDeleteButton)
          .should("exist")
          .and("not.be.disabled");
        cy.findElement(contractDetails.optionDeleteButton)
          .should("exist")
          .and("not.be.disabled");                                
      } else {
        cy.log("Option1Row NOT FOUND!");
        cy.findElement(contractDetails.baseDeleteButton)
          .should("exist")
          .and("be.disabled")
      }
    });

});

Cypress.Commands.add("selectPiiOption", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(sac.piiRadioOtionActive)
    .then(($radioBtn) => {      
      const selectedOption = $radioBtn.text();
      cy.log(selectedOption);
      cy.btnExists(common.continueBtn, ' Continue ').click();
      if (selectedOption === "radio_button_checkedYes." +
        " This contract action will include a system of records with PII.") {
        //naviagtes to "Tell us more about your system of records screen"
        cy.textExists(common.header, " Tell us more about your system of records " );
      } else {
        cy.textExists(common.header,"Let’s find out if you need a Business Associates Agreement");
      }
          
    })
});

Cypress.Commands.add("selectFOIAOption", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(sac.foiaRadioOptionActive)
    .then(($radioBtn) => {
      const selectedOption = $radioBtn.text();
      cy.log(selectedOption);
      cy.btnExists(common.continueBtn, ' Continue ').click();
      if (selectedOption === "radio_button_checkedYes.") {
        //naviagtes to "Tell us more about your FOIA Cordinator screen"
        cy.textExists(common.header, " Tell us about your FOIA Coordinator ");
      } else {
        cy.textExists(common.header, "Let’s look into your Section 508 Accessibility requirements");
      }
          
    });
});

Cypress.Commands.add("ppsCheckBoxOptionSelected", (selector,value,otherTxt) => {
  cy.checkBoxOption(selector,value).check({ force: true });
  cy.findElement(occ.checkBoxActive)
    .then(($checkedOption) => {      
      const selectedOption = cleanText($checkedOption.text()); 
      cy.log(selectedOption)
      if (selectedOption === "check_box Other") {
        cy.log("display Other is selected:",selectedOption)
        cy.findElement(occ.otherTextBox)
          .should("exist")
          .and("be.visible");
        cy.enterTextInTextField(occ.otherTextBox,otherTxt)
        
      }else {        
        cy.findElement(occ.otherTextBox)
          .should("not.exist");
      }
      
    });  
});

Cypress.Commands.add("selectTrainingOption", (radioSelector, value) => {  
  cy.radioBtn(radioSelector, value).click({ force: true })
    .should("be.checked");
  cy.findElement(occ.trainingRadioOptionActive)
    .then(($radioBtn) => {
      const selectedOption = $radioBtn.text();
      cy.log(selectedOption);
      cy.btnExists(common.continueBtn, ' Continue ').click();
      if (selectedOption === "radio_button_checkedYes.") {
        //naviagtes to "Tell us about your mandatory training screen"
        cy.textExists(common.header, " Tell us about your mandatory training ");
      } else {
        cy.verifyPageHeader(
          "Let's find out if your effort provides for Personally Identifiable Information");
        cy.findElement(common.stepStandCompText)
          .should("be.visible")
          .and('have.css', 'color', colors.primary)
      }
          
    });
});

Cypress.Commands.add("trainingCourseExists", () => {
  cy.findElement(occ.trainingCourse).then((trainingCourseRows) => {
    cy.log(trainingCourseRows.length)
    if ( trainingCourseRows.length === 1) {
      cy.findElement(occ.trainCourseRemovebtn).should("exist")
        .and("be.disabled");
    } else {
      cy.findElement(occ.trainCourseRemovebtn)
        .should("exist")
        .and("not.be.disabled")
    }
  });
});

Cypress.Commands.add("select508Option", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(sac.sectionradioActive)
    .then(($radioBtn) => {
      const selectedOption = cleanText($radioBtn.text());
      cy.log(selectedOption);
      cy.findElement(common.continueBtn)
        .scrollIntoView().click();
      if (selectedOption === "radio_button_checkedNo." +
        " I need to customize the Section 508 Accessibility Standards in my Description of Work.") {
        //Tell us more about your Section 508 Accessibility requirements"
        cy.verifyPageHeader("Tell us more about your Section 508 Accessibility requirements");
      } else {
        //navigates to next step in the workflow
        cy.findElement(common.stepEvaluationCriteriaText)
          .should("be.visible")
          .and('have.css', 'color', colors.primary)
      }
          
    });
});

Cypress.Commands.add("selectServiceOfferingGroup", (checkboxes) => {
  cy.selectCheckBoxes(checkboxes);
  cy.btnClick(common.continueBtn, " Continue ");
      
});

Cypress.Commands.add("deselectAllCheckboxes", () => {  
  cy.findElement("[type='checkbox']").uncheck({ force: true })
});
