import "cypress-iframe";
import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import common from "../selectors/common.sel";
import {cleanText} from "../helpers";
import sac from "../selectors/standComp.sel";
import "cypress-wait-until";


Cypress.Commands.add("goToSaCStep",(pt, scope)=>{
    cy.goToAcqPackageStepOne(pt, scope)
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    cy.activeStep(common.stepStandCompText);
    cy.verifyPageHeader(
        "Let’s find out if your project includes Personally Identifiable Information (PII)"
    );    
    });

Cypress.Commands.add("completeSystemRecordsForm",(systemName,operationPerformed)=>{
    cy.enterTextInTextField(sac.systemNameTextBox, systemName);
    cy.enterTextInTextField(sac.operationPerformedTextBox, operationPerformed);
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(sac.systemNameTextBox);
    cy.verifyPageHeader("Let’s find out if you need a Business Associates Agreement")

    });

Cypress.Commands.add("selectPiiOption", (radioSelector, value) => {
    cy.radioBtn(radioSelector, value).click({ force: true });
    cy.findElement(sac.piiRadioOtionActive).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    const yesOption = cleanText("radio_button_checkedYes."+
    " This contract action will include a system of records with PII.");  
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(radioSelector);
    
    if ( selectedOption === yesOption) 
    {
      //navigates to "Tell us more about your system of records screen"
        cy.verifyPageHeader(        
        " Tell us more about your system of records "
        );
        
    } else {
        cy.verifyPageHeader(        
        "Let’s find out if you need a Business Associates Agreement"
        );
    }
    })
});

Cypress.Commands.add("selectBAAOption", (radioSelector, value) => {
    cy.radioBtn(radioSelector, value).click({ force: true });
    cy.findElement(sac.baaRadioOptionActive).then(($radioBtn) => {
    const selectedOption =cleanText($radioBtn.text());
    cy.log(selectedOption);   
    const OptionYes="radio_button_checkedYes."+
    " This contract effort will require a BAA to safeguard PHI."
    
    if (selectedOption === OptionYes) {
        cy.findElement(sac.sampleBAAProvAlert).should("exist");        
    } else {
        cy.findElement(sac.sampleBAAProvAlert).should("not.be.visible");
    }   
    });
    cy.clickContinueButton(
        sac.yesBAARadioOption,
        "Let’s look into the Freedom of Information Act (FOIA)"
    );
    
});

Cypress.Commands.add("selectFOIAOption", (radioSelector, value) => {
    cy.radioBtn(radioSelector, value).click({ force: true });
    cy.findElement(sac.foiaRadioOptionActive).then(($radioBtn) => {
    const selectedOption = $radioBtn.text();
    cy.log(selectedOption);   
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(sac.foiaYesOption);
    const OptionYesSelected="radio_button_checkedYes.";
    if (selectedOption === OptionYesSelected) {
      //navigates to "Tell us more about your FOIA Cordinator screen"
        cy.verifyPageHeader(" Tell us about your FOIA Coordinator ");
    } else {
        cy.verifyPageHeader(
        "Let’s look into your Section 508 Accessibility requirements"
        );
    }
    
    });
    
});
Cypress.Commands.add("select508Option", (radioSelector, value) => {
    cy.radioBtn(radioSelector, value).click({ force: true });
    cy.findElement(sac.sectionradioActive).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(sac.sectionYesRadio);
    if (
        selectedOption ===
        "radio_button_checkedNo." +
        " I need to customize the Section 508 Accessibility Standards in my Description of Work."
    ) {
      //Tell us more about your Section 508 Accessibility requirements"
        cy.verifyPageHeader(
        "Tell us more about your Section 508 Accessibility requirements"
        );
    } else {
      //navigates to next step in the workflow
        cy.verifyPageHeader(
            "Let’s work on a price estimate for your cloud requirements"
        );
    }
    });
});

