import "cypress-iframe";
import { cleanText } from "../helpers";
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

Cypress.Commands.add("popLengthOptionYearExists", () => {
  cy.findElement(contractDetails.mainWrap).then((main) => {
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
        .and("be.disabled");
    }
  });
});

Cypress.Commands.add(
  "defaultPoPLengthValue",
  (inputSelector, dropdownSelector) => {
    cy.findElement(inputSelector).invoke("val").should("be.equal", "1");
    cy.findElement(dropdownSelector)
      .then(($option) => {
        const defaultOption = $option.text();
        cy.log(defaultOption);
      })
      .should("have.text", "Year");
  }
);

Cypress.Commands.add(
  "selectDatefromDatePicker",
  (ciSel, nmSel, selDateSel, calDate, dpSel) => {
    cy.findElement(ciSel).click();
    cy.findElement(nmSel)
      .click({
        force: true,
      })
      .then(() => {
        cy.findElement(selDateSel).each(($el) => {
          const dateName = $el.text();
          if (dateName == calDate) {
            cy.wrap($el).click({
              force: true,
            });
          }
        });
        cy.findElement(dpSel).should("not.visible");
      });
  }
);

Cypress.Commands.add("selectPoPStartDate", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({
    force: true,
  });
  cy.findElement(contractDetails.activePoPStartDate).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);

    if (selectedOption === "radio_button_checkedYes.") {
      cy.findElement(contractDetails.requestedStartDate).should("exist");
      cy.selectDatefromDatePicker(
        contractDetails.calendarIcon,
        contractDetails.navigateNextMonth,
        contractDetails.selectDate,
        13,
        contractDetails.datePicker
      );
    } else {
      cy.findElement(contractDetails.requestedStartDate).should("not.exist");
    }
    cy.btnExists(common.continueBtn, " Continue ").click();
  });
});

