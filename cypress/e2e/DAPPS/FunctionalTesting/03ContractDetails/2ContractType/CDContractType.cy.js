import {
    randomAlphaNumeric,
    randomString
} from "../../../../../helpers";
import common from "../../../../../selectors/common.sel"
import contractDetails from "../../../../../selectors/contractDetails.sel";
import CDData from '../../../../../fixtures/ContractDetailsData/CDData.json';

describe("Test suite: Functional Testing - 03 Contract Details> ContractType", () => {

  let pt = "TC-Step-3-ContractDetails-Contract Type-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);
  const inputText = randomAlphaNumeric(8);
    
  before(() => {
    cy.goToAcqPackageStepOne(pt, scope);
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.clickSideStepper(common.subStepContractTypeLink, " Contract Type ");
    });

    it("TC1: Functional Testing: Screen & Error message validation: Contract Type", () => {

        cy.verifyPageHeader(CDData.contractTypePage.pageHeader4);
        cy.verifyTextMatches(contractDetails.introPText, CDData.contractTypePage.expectedRecuringReqText);
        cy.textExists(contractDetails.farLink, "FAR 12.207");
        cy.textExists(contractDetails.selectMessageText, CDData.contractTypePage.contractEffortMsg);
        //Verify checkbox options
        cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").should("not.be.checked")
            .check({
                force: true
            });
        cy.findCheckBox(contractDetails.tmCheckBox, "T&M").should("not.be.checked")
            .check({
                force: true
            }).then(() => {
                cy.findElement(contractDetails.tmTextFieldLabel).should("exist");
                cy.textExists(contractDetails.tmTextFieldLabel, CDData.contractTypePage.justificationTMMsg);
                cy.textExists(contractDetails.tmLearnMoreLink, "Learn more").should("exist");
                cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, inputText);
            });
        cy.btnExists(common.continueBtn, " Continue ");
        cy.verifyCheckBoxLabels(contractDetails.selectedContractTypeOption, CDData.contractTypePage.expectedLabels);
        cy.clickContinueButton(contractDetails.tmCheckBox, CDData.classLevelPage1.pageHeaderCL1);
        cy.log(" TestReport: Step3-ContractDetails-Contract Type Functional Testing Complete ")

    });

});