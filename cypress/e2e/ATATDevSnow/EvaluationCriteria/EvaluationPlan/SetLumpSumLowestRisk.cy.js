import {
  randomString,
  randomAlphaNumeric
} from "../../../../helpers";
import ep from "../../../../selectors/evaluationPlan.sel";
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';
import contractDetails from "../../../../selectors/contractDetails.sel";
import common from "../../../../selectors/common.sel";

describe("Test suite: Set Lump SumS: Lowest Risk", () => {  
  const pt = "TC-Step-2-FairOpp-None-LowestRisk-" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-lowestRisk" + randomString(5);

  beforeEach(() => {
    cy.selectNoneOption(pt, scope);
    //Option selected is Set LumpSum
    cy.selectEvaluationPlanOption(ep.setLumpSum, "SET_LUMP_SUM");
    cy.selectMethodSelectionSectionOption(ep.lowestRiskRadioBtn, "LOWEST_RISK");
    cy.selectCheckBoxes([ep.automationCapabilityCheckBox]);
  });


  it("TC1:Select CheckBox", () => {    
    cy.textExists(common.continueBtn, "Continue").click();
    cy.waitUntilElementIsGone(ep.custom0SpecTextbox);
  });

  it("TC2: Navigation: Click on navigation buttons", () => {    
    cy.textExists(ep.noOtherBtn, " I don’t need other assessment areas").click();
    cy.waitUntilElementIsGone(ep.noOtherBtn);
    cy.activeStep(common.stepContractDetailsText);
    cy.clickBackButton(
      contractDetails.baseLabelText,
      "Now let’s review assessment criteria required for white papers");
    cy.clickBackButton(
      contractDetails.baseLabelText,
      evalCriteria.workEvalPlan.headerText);
    cy.radioBtn(ep.setLumpSum, "SET_LUMP_SUM").should("be.checked");
  });

});