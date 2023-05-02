import { bootstrapMockApis,randomAlphaNumeric,randomString}from "../../../helpers";
import common from "../../../selectors/common.sel";
import co from "../../../selectors/contractOffice.sel";
import contractDetails from "../../../selectors/contractDetails.sel";

describe("Test suite: Contract Details: E2E work flow",  () => {

  let pt = "TC-Step-3-ContractDetails-E2E-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists(common.stepAcquisitionText, " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");    
    cy.fillNewAcquisition(pt, scope);
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.verifyPageHeader("Let’s gather details about the duration of your task order");
    cy.findElement(contractDetails.addOptionLink).click();    
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
    cy.verifyPageHeader(
      " Do you want to request a PoP start date? "
    );
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").click({ force: true });
    cy.findElement(contractDetails.requestedStartDate).should("exist"); 
    cy.selectDatefromDatePicker(
      contractDetails.calendarIcon,
      contractDetails.navigateNextMonth,
      contractDetails.selectDate,
      "13",
      contractDetails.datePicker
    );
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.popStartDateYesRadioOption);
    cy.verifyPageHeader(
      "Will this be a recurring requirement?"
    );
    cy.radioBtn(contractDetails.yesRadioOption, "YES").not("[disabled]").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.yesRadioOption);
    cy.verifyPageHeader("Which contract type(s) apply to this acquisition?"); 
  });   
  
  it("TC1: If unclassified Class Level selected ", () => {  
    cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").should("not.be.checked")
      .check({ force: true });
    cy.findCheckBox(contractDetails.tmCheckBox, "T&M").should("not.be.checked")
      .check({ force: true }).then(() => {
        cy.findElement(contractDetails.tmTextFieldLabel).should("exist");
        cy.textExists(contractDetails.tmTextFieldLabel,
          "Please provide justification for your T&M contract type.");
        cy.textExists(contractDetails.tmLearnMoreLink, "Learn more").should("exist");
        const inputText = randomAlphaNumeric(8);
        cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, inputText);
      });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(contractDetails.ffpCheckBox, "FFP");
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    cy.selectCheckBoxes([contractDetails.level2])
    cy.btnClick(common.continueBtn, " Continue ");    
    // Cross domain page& security req page  is skipped 
    cy.waitUntilElementIsGone(contractDetails.level2);
    cy.verifyPageHeader(
      "Do you have a current contract for this effort?"
    );
  }); 

});
