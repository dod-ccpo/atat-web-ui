import { bootstrapMockApis,colors,cleanText } from "../../helpers";
import common from "../../selectors/common.sel"
import contractDetails from "../../selectors/contractDetails.sel";

describe("Test suite: Contract Details Step", () => {


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
        
  });
    
  it("TC1: Contract Details on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepPopText, " Period of Performance ");
    cy.findElement(common.stepContractDetailsText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();     
      
  });

  it("TC: Asserts: Do you want to request a PoP start date?", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.header, " Let’s gather some details about the duration of your task order ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Do you want to request a PoP start date?");
    const expectedstartText = "Due to project requirements and/or contractual obligations, your PoP may need to start on a specific date. If no date is specified, then your PoP will begin based upon the execution date of your task order."
    cy.findElement(contractDetails.popText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedstartText);

    });
    //assert radio button options
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YesStartDate").not("[disabled]")
    cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NoStartDate").not("[disabled]")
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });
  
  it.only("TC: Do you want to request a PoP start date?: Select Yes Option", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.header, " Let’s gather some details about the duration of your task order ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Do you want to request a PoP start date?");
    //Select Yes radio option
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YesStartDate").click({ force: true });
    cy.findElement(contractDetails.requestedStartDate).should("exist"); 
    cy.findElement(contractDetails.requestedStartDropdownIcon).click();
    cy.findElement(contractDetails.requestedStartDateNosoonerthan).click();
    cy.findElement(contractDetails.calendarIcon).click();
    cy.findElement(contractDetails.navigateNextMonth).click({force: true}).then(() => {
      cy.findElement(contractDetails.selectDate).first().click({ force: true });
      
    });   
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });

  it("TC2: Asserts: Will this be a future recurring requirement?", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(contractDetails.popRadioGroup).should("exist");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, " Will this be a future recurring requirement? ");
    const expectedRecuringReqText="DISA has developed a tracking system for expiring contracts. Responding YES to this question will enable contract specialists to populate the tracking system."
    cy.findElement(contractDetails.recurringReqText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedRecuringReqText);

    });
    //assert radio button options
    cy.radioBtn(contractDetails.yesRadioOption,  "true").not("[disabled]").click({force: true});
    cy.radioBtn(contractDetails.noRadioOption, "false").not("[disabled]").click({force: true});
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });

});