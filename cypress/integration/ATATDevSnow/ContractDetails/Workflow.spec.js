import { bootstrapMockApis,randomAlphaNumeric}from "../../../helpers";
import common from "../../../selectors/common.sel"
import contractDetails from "../../../selectors/contractDetails.sel";


describe("Test suite: Contract Details: E2E work flow", () => {

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
  });  

  it("TC1: E2E flow", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click();
    //Enter the Value for Base
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    //Select Yes radio option    
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").click({ force: true });
    cy.findElement(contractDetails.requestedStartDate).should("exist"); 
    cy.dropDownClick(contractDetails.requestedStartDropdownIcon);
    const listOptions = "No sooner thanNot later than"    
    cy.findElement(contractDetails.requestedStartDropdownList).each(($el) =>
      cy.wrap($el).should("contain.text", listOptions)
    );      
    cy.findElement(contractDetails.requestedStartDateNosoonerthan).click();
    cy.findElement(contractDetails.calendarIcon).click();
    cy.findElement(contractDetails.navigateNextMonth).click({ force: true }).then(() => {
      cy.findElement(contractDetails.selectDate).first().click({ force: true });
    });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Will this be a future recurring requirement? ");
    cy.radioBtn(contractDetails.yesRadioOption,  "YES").not("[disabled]").click({force: true});
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader( " Which contract type(s) apply to this acquisition? ");
    cy.selectCheckBox(contractDetails.ffpCheckBox, "FFP").should("not.be.checked")
      .check({ force: true });
    cy.selectCheckBox(contractDetails.tmCheckBox, "T&M").should("not.be.checked")
      .check({ force: true }).then(() => {
        cy.findElement(contractDetails.tmTextFieldLabel).should("exist");
        cy.textExists(contractDetails.tmTextFieldLabel,
          "Please provide justification for your T&M contract type.");
        cy.textExists(contractDetails.tmLearnMoreLink, "Learn more").should("exist");
        const inputText = randomAlphaNumeric(8);
        cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, inputText);
      });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    cy.findElement(contractDetails.level4).should("not.be.checked")
      .check({ force: true }).should("be.checked");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.activeStep(common.stepPerformanceReqText);
    cy.verifyPageHeader("Let’s work on your performance requirements");
  }); 

});
