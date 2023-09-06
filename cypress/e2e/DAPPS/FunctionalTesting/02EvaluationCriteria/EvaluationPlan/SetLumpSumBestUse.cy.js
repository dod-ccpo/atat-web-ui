import {
  randomString,
  randomAlphaNumeric
} from "../../../../../helpers";
import ep from "../../../../../selectors/evaluationPlan.sel";
import fo from "../../../../../selectors/fairOpportunityProcess.sel";
import evalCriteria from '../../../../../fixtures/evaluationCriteria.json';


describe("Test suite: Select Option3 on Create Evaluation Plan: Set Lump sum: Best Use ", () => {

  const pt = "TC-Step-2-EC-FairOpp-None-bestUse" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-bestUse" + randomString(5);
  const customText = randomString(5);
  const descriptionText = "Purchase a set lump sum dollar amount from one CSP; award will be made to the “BEST_USE” solution.";

  before(() => {
    cy.selectNoneOption(pt, scope);
    //Option selected is Set LumpSum
    cy.selectEvaluationPlanOption(ep.setLumpSum, "SET_LUMP_SUM");
    cy.selectMethodSelectionSectionOption(ep.bestUseRadioBtn, "BEST_USE");
  });


  it("TC1:Select CheckBoxes", () => {

    cy.verifyCheckBoxLabels(
      ep.checkboxesLabel,
      evalCriteria.bestUse.otherAssessmentCheckboxes
    );
    cy.selectCheckBoxes([ep.riskToGovCheckBox, ep.automationCapabilityCheckBox]);
    cy.clickContinueButton(
      ep.riskToGovCheckBox,
      "Your Evaluation Criteria Summary"
    );

  });

  it("TC2: Navigation-Evaluation criteria Summary", () => {   
    cy.verifyTextMatches(fo.evalPlanDesriptionText,descriptionText); 
    cy.findElement(fo.evalPlanCompleteBtn).contains("View/Edit") ;
    cy.clickAndWaitForElementExists(fo.evalPlanCompleteBtn, ep.setLumpSum); 
    cy.radioBtn(ep.setLumpSum, "SET_LUMP_SUM").should("be.checked");
    cy.radioBtn(ep.bestUseRadioBtn, "BEST_USE").should("be.checked");
    cy.clickContinueButton(ep.bestUseRadioBtn,"Now let’s review assessment criteria required for white papers"); 
    cy.verifySelectedCheckBoxOption(ep.activeSumCheckBoxes)
    cy.findElement(ep.noOtherBtn).scrollIntoView();
    cy.textExists(ep.noOtherBtn, " I don’t need other assessment areas").click();
    cy.waitUntilElementIsGone(ep.noOtherBtn);
    cy.verifyPageHeader("Let’s gather details about the duration of your task order");    
  });

});