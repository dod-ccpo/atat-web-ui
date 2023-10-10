import "cypress-iframe";
import contractDetails from "../selectors/contractDetails.sel";
import common from "../selectors/common.sel";

Cypress.Commands.add(
  "goToContractDetailsStep",
  (pt, scope, radioSelector, value, input) => {
    cy.goToAcqPackageStepOne(pt, scope);
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.verifyPageHeader(
      "Let’s gather details about the duration of your task order"
    );    
    cy.clickContinueButton(
      contractDetails.baseInputTxtBox,
      " Do you want to request a PoP start date? "
    );

    cy.selectPoPStartDate(radioSelector, value);
    cy.waitUntilElementIsGone(contractDetails.popStartDateYesRadioOption);
    cy.verifyPageHeader("Will this be a recurring requirement?");
    cy.radioBtn(contractDetails.yesRadioOption, "YES").not("[disabled]").click({
      force: true,
    });
    cy.clickContinueButton(
      contractDetails.yesRadioOption,
      "Which contract type(s) apply to this acquisition? "
    );

    cy.findCheckBox(contractDetails.ffpCheckBox, "FFP")
      .should("not.be.checked")
      .check({
        force: true,
      });
    cy.selectTMCheckbox(input);
    cy.clickContinueButton(
      contractDetails.ffpCheckBox,
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
  }
);

Cypress.Commands.add("selectTMCheckbox", (inputText) => {
  cy.findCheckBox(contractDetails.tmCheckBox, "T&M")
    .should("not.be.checked")
    .check({
      force: true,
    })
    .then(() => {
      cy.findElement(contractDetails.tmTextFieldLabel).should("exist");
      cy.textExists(
        contractDetails.tmTextFieldLabel,
        "Please provide justification for your T&M contract type."
      );
      cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, inputText);
    });
});

Cypress.Commands.add("addOptionPeriod", () => {
  cy.findElement(contractDetails.addOptionLink).click();
});
Cypress.Commands.add("selectClassificationLevel", (selectedClassifications) => {
  const expectedLabelMaps = {
    level2: contractDetails.level2,
    level4: contractDetails.level4,
    level5: contractDetails.level5,
    level6: contractDetails.level6,
    tops: contractDetails.ts,
  };

  cy.findElement(common.subStepClassReqsLink).click();
  selectedClassifications.forEach((label) => {
    cy.findElement(expectedLabelMaps[label]).click({ force: true });
  });

  if (
    selectedClassifications.includes("Secret") ||
    selectedClassifications.includes("Top secret")
  ) {
    cy.clickContinueButton(
      contractDetails.level4,
      "Let’s find out more about your security requirements"
    );
  } else {
    cy.clickContinueButton(
      contractDetails.level4,
      "Your Contract Details Summary"
    );
  }
});

Cypress.Commands.add("selectSecretLevel", (secretSelector, alertMessage) => {
  cy.findElement(secretSelector)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .then(() => {
      cy.messageDisplays(contractDetails.alertMessage, alertMessage);
    });
});

Cypress.Commands.add("unselectSecretLevel", (secretSelector) => {
  cy.findElement(secretSelector)
    .should("be.checked")
    .uncheck({
      force: true,
    })
    .then(() => {
      cy.findElement(contractDetails.alertMessage).should("not.exist");
    });
});
