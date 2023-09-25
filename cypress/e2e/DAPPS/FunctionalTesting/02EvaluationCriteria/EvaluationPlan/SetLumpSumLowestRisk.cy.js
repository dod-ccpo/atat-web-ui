import {
  randomString,
  randomAlphaNumeric
} from "../../../../../helpers";
import ep from "../../../../../selectors/evaluationPlan.sel";
import fo from "../../../../../selectors/fairOpportunityProcess.sel";
import common from "../../../../../selectors/common.sel";

describe("Test suite: Set Lump SumS: Lowest Risk", { testIsolation: false }, () => {  

  const pt = "TC-Step-2-FairOpp-None-LowestRisk-" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-lowestRisk" + randomString(5);
  const descriptionText = "Purchase a set lump sum dollar amount from one CSP;"+
  " award will be made to the “LOWEST_RISK” solution.";

  before(() => {
    cy.selectNoneOption(pt, scope);
    //Option selected is Set LumpSum
    cy.selectEvaluationPlanOption(ep.setLumpSum, "SET_LUMP_SUM");
    cy.selectMethodSelectionSectionOption(ep.lowestRiskRadioBtn, "LOWEST_RISK");
    cy.selectCheckBoxes([ep.automationCapabilityCheckBox]);
  });


  it("TC1:Select CheckBox", () => {     
    cy.clickContinueButton(
      ep.addAnotherCustomCS,
      "Your Evaluation Criteria Summary"
    ); 
  });

  it("TC2: Navigation-Evaluation criteria", () => {      
    cy.clickAndWaitForElementExists(fo.evalPlanCompleteBtn, ep.setLumpSum); 
    cy.radioBtn(ep.setLumpSum, "SET_LUMP_SUM").should("be.checked");
    cy.radioBtn(ep.lowestRiskRadioBtn, "LOWEST_RISK").should("be.checked");
    cy.clickContinueButton(
      ep.bestUseRadioBtn,"Now let’s review assessment criteria required for white papers"); 
    cy.verifySelectedCheckBoxOption(ep.activeSumCheckBoxes)
    cy.findElement(ep.noOtherBtn).scrollIntoView();
    cy.clickContinueButton(
      ep.addAnotherCustomCS,
      "Your Evaluation Criteria Summary"
    );       
    cy.verifyTextMatches(fo.evalPlanDesriptionText,descriptionText);
  });

  it("TC3: click Wrap up this section", () => {  
    cy.findElement(common.continueBtn).contains("Wrap up this section").click();  
    cy.waitUntilElementIsGone(fo.exceptionToFairOppCompleteBtn);
    cy.verifyPageHeader("Let’s gather details about the duration of your task order");          
  });

});