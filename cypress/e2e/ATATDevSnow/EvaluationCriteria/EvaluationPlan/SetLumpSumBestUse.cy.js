import {
  randomString,
  randomAlphaNumeric
} from "../../../../helpers";
import ep from "../../../../selectors/evaluationPlan.sel";
import contractDetails from "../../../../selectors/contractDetails.sel";
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';


describe("Test suite: Select Option3 on Create Evaluation Plan: Set Lump sum: Best Use ", () => {
  const pt = "TC-Step-2-EC-FairOpp-None-bestUse" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-bestUse" + randomString(5);

  beforeEach(() => {
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
      "Let’s gather details about the duration of your task order"
    );

  });

  it("TC2: Navigation: Click on navigation buttons", () => {
    cy.selectCheckBoxes([ep.riskToGovCheckBox]);
    cy.textExists(ep.noOtherBtn, " I don’t need other assessment areas").click();
    cy.waitUntilElementIsGone(ep.noOtherBtn);
    cy.verifyPageHeader("Let’s gather details about the duration of your task order");
    cy.clickBackButton(
      contractDetails.baseLabelText,
      "Now let’s review assessment criteria required for white papers");
    cy.verifySelectedCheckBoxOption(ep.activeSumCheckBoxes)
    cy.clickBackButton(
      ep.noOtherBtn,
      evalCriteria.workEvalPlan.headerText);
    cy.radioBtn(ep.setLumpSum, "SET_LUMP_SUM").should("be.checked");

  });

});