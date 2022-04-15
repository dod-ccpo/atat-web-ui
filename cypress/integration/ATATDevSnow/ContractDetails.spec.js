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

  it("TC2: Asserts: Will this be a future recurring requirement?", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
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