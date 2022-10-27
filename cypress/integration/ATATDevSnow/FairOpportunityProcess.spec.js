import { bootstrapMockApis, cleanText,colors } from "../../helpers";
import fairOpportunity from "../../selectors/fairOpportunityProcess.sel";
import common from "../../selectors/common.sel";

describe.skip("Test suite: Fair Opportunity Process",  () => {


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();    
  });
    
  it("TC1: Fair Opportunity Process on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepFairOppLink, " Fair Opportunity Process ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepExceptionsText, " Exceptions ");        
    cy.findElement(common.stepFairOppTextCircle)
      .should("be.visible")
      .and("have.css", "color", colors.primary)
      .click();    
              
  });

  it("TC2: Exceptions: Radio options: Validations", () => {
    cy.clickSideStepper(common.stepFairOppLink, " Fair Opportunity Process ");
    //validation message for the radio options
    cy.findElement(fairOpportunity.radioOneCSP).focus()
    cy.clickSomethingElse(fairOpportunity.exceptionRadioOptError).then(() => {
      cy.checkErrorMessage(fairOpportunity.exceptionRadioOptError, "Please select an option");
    });
    
  });

  it("TC3: Asserts: Let’s see if you qualify for an exception to the fair opportunity process",
    () => {
      cy.clickSideStepper(common.stepFairOppLink, " Fair Opportunity Process ");
      cy.textExists(common.header,
        " Let’s see if you qualify for an exception to the fair opportunity process ");
      cy.textExists(fairOpportunity.fairOppLabel, "Fair opportunity");
      const expectedTxt = "Based on your market research, do any of the following exceptions" +
        " to fair opportunity apply to your acquisition?"
      cy.findElement(fairOpportunity.exceptionRadioOption).then(($e) => {
        let actualTxt = $e.text();
        const formattedTxt = cleanText(actualTxt);
        expect(formattedTxt).equal(expectedTxt);
      });
      //assert radio buttons
      cy.radioBtn(fairOpportunity.radioOneCSP, "YES_FAR_16_505_B_2_I_B").not("[disabled]")
        .click({ force: true });
      cy.radioBtn(fairOpportunity.radioAllFair, "YES_FAR_16_505_B_2_I_C").not("[disabled]")
        .click({ force: true });
      cy.radioBtn(fairOpportunity.radioNoneApply, "NO_NONE").not("[disabled]")
        .click({ force: true });
      //click on navigation buttons
      cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
      //Navigates to "Do you have a current contract for this effort?" page
      cy.textExists("div", " Future Justification and Approval page ");
        
    });

});
