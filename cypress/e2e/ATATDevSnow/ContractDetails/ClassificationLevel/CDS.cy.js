/* eslint-disable cypress/no-unnecessary-waiting */
import {
  randomAlphaNumeric,
  randomNumberBetween,
  randomString,
  suffixId,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import contractDetails from "../../../../selectors/contractDetails.sel";
import background from "../../../../selectors/background.sel";

describe("Test suite: Contract Details: CDS Form", () => {
  let pt = "TC-Step-3-ContractDetails-CDS-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);
  let classInput = randomNumberBetween(1, 9);
  let cdsLabelTxt = "What type of cross-domain solution do you need?";
  const tm = randomAlphaNumeric(8)

  beforeEach(() => {
    cy.goToContractDetailsStep(pt, scope, contractDetails.popStartDateNoRadioOption, "NO", tm)
    cy.selectCheckBoxes([contractDetails.level5, contractDetails.level6]);
    const expectedLabels = [
      "Unclassified / Impact Level 5 (IL5)" +
      " Accommodates DoD CUI and National Security Systems",
      "Secret / Impact Level 6 (IL6)",
    ];
    cy.verifyCheckBoxLabels(
      contractDetails.checkedClassCheckBoxes,
      expectedLabels
    );
    cy.wait(2000);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(contractDetails.level4);
    cy.verifyPageHeader("Let’s find out more about your security requirements");
    const secretcb_1Sel = suffixId(contractDetails.checkbox_1, "Secret");
    const secretcb_2Sel = suffixId(contractDetails.checkbox_2, "Secret");
    cy.selectCheckBoxes([secretcb_1Sel, secretcb_2Sel]);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(secretcb_1Sel);
    cy.verifyPageHeader("Do you require a cross-domain solution (CDS)?");

  });

  it("TC1:CDS form,Yes Option is selected ", () => {
    cy.findElement(contractDetails.cdsYesOption)
      .click({
        force: true
      })
      .then(() => {
        cy.findElement(contractDetails.cds).should("be.visible");
      });
    cy.textExists(contractDetails.cdsLabel, cdsLabelTxt);
    cy.selectCheckBoxes([contractDetails.unclastoSecrCB]);
    cy.enterTextInTextField(contractDetails.cdsUtoSTxtbox, classInput);
    const checkedbox = ["Unclassified to Secret"];
    cy.verifyCheckBoxLabels(contractDetails.cdsCheckedbox, checkedbox);
    const fs = "TestFS - " + randomAlphaNumeric(3);
    cy.enterTextInTextField(contractDetails.projectedFSField, fs);
    const anticipatedText = randomAlphaNumeric(17);
    cy.enterTextInTextField(
      contractDetails.anticipatedTxtbox,
      anticipatedText
    );
    cy.findElement(contractDetails.entiredDurationNo).click({
      force: true
    });
    cy.clickContinueButton(contractDetails.unclastoSecrCB, "Your Contract Details Summary");
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(background.yesRadioOption);
    cy.verifyPageHeader(
      "Do you require a cross-domain solution (CDS)?"
    );
    //Ensure all the details entered are retrieved correctly
    cy.verifySelectedRadioOption(contractDetails.cdsActiveRadioOption, "Yes");
    const selectedDomainPair = [
      "Unclassified to Secret"
    ];
    cy.verifyCheckBoxLabels(contractDetails.cdsCheckedCheckbox, selectedDomainPair);
    cy.verifyEnteredInputTxt(contractDetails.cdsUtoSTxtbox, classInput);
    cy.verifyEnteredInputTxt(contractDetails.projectedFSField, fs);
    cy.verifyEnteredInputTxt(
      contractDetails.anticipatedTxtbox,
      anticipatedText);
    cy.findElement(contractDetails.activeEntireDurtionOption).scrollIntoView();
    cy.verifySelectedRadioOption(contractDetails.activeEntireDurtionOption, "No");
  });

  it("TC2:CDS form,No Option is selected ", () => {
    cy.findElement(contractDetails.cdsNoOption)
      .click({
        force: true
      })
      .then(() => {
        cy.findElement(contractDetails.cds).should("not.exist");
      });
    cy.clickContinueButton(contractDetails.cdsNoOption, "Your Contract Details Summary");
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(background.yesRadioOption);
    cy.verifyPageHeader(
      "Do you require a cross-domain solution (CDS)?"
    );
    cy.verifySelectedRadioOption(contractDetails.cdsActiveRadioOption, "No");
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(contractDetails.cdsNoOption);
    cy.verifyPageHeader(
      "Let’s find out more about your security requirements"
    );
    const expectedSecLabels = [
      "Communications Security (COMSEC) Information Includes accountable" +
      " or non-accountable COMSEC information and controlled crytographic items (CCI)",
      "Restricted Data"
    ]
    cy.verifyCheckBoxLabels(contractDetails.secretCheckedbox, expectedSecLabels);
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(contractDetails.secretCheckedbox);
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    const selectedLabels = [
      "Unclassified / Impact Level 5 (IL5)" +
      " Accommodates DoD CUI and National Security Systems",
      "Secret / Impact Level 6 (IL6)",
    ];
    cy.verifyCheckBoxLabels(contractDetails.activeCheckBox, selectedLabels);
    cy.findElement(contractDetails.level6).should("be.checked").uncheck({
      force: true
    }).then(() => {
      cy.waitUntil(function () {
        return Cypress.$(contractDetails.level6).is(":checked") === false;
      });
    });
    cy.wait(3000);
    cy.clickContinueButton(contractDetails.level5, "Your Contract Details Summary");
  });

  //skipped below code due to Bug#AT-9419
  it.skip("TC3:CDS form,Validation ", () => {
    cy.verifyRequiredRadioBtn(
      contractDetails.cdsNoOption,
      contractDetails.cdsRadioOptionError,
      "Please select Yes or No.");
    cy.findElement(contractDetails.cdsYesOption)
      .click({
        force: true
      });
      
   // DomainPair Validation message
    cy.verifyRequiredCheckbox(
      contractDetails.unclastoSecrCB,
      contractDetails.cdsDomainPairError,
      "Please select at least one type of cross-domain solution."
    );
   // DomainPair Textbox
    cy.selectCheckBoxes([contractDetails.unclastoSecrCB]).then(() => {
      cy.verifyRequiredInput(
        contractDetails.cdsUtoSTxtbox,
        contractDetails.cdsDPTxtbox0Error,
        "Enter the approximate quantity of data/month."
      );
    });
    cy.verifyRequiredInput(
      contractDetails.projectedFSField,
      contractDetails.projectedFSError,
      "Enter a projected file stream/type"
    );
    cy.verifyRequiredInput(
      contractDetails.anticipatedTxtbox,
      contractDetails.anticipatedTxtboxError,
      "Provide your statement of objective."
    );
    cy.verifyRequiredRadioBtn(
      contractDetails.entiredDurationNo,
      contractDetails.entiredDurationError,
      "Please select an option.");
  });
});