import {randomString,randomAlphaNumeric} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import fo from "../../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../../selectors/evaluationPlan.sel";
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';

describe("Test suite: Option four on Create Evaluation Plan: Set Equal lump sum", () => {
  const customText = randomString(5);
  const pt = "TC-Step-2-EvalCriteria-FairOpp-None" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-None" + randomString(5);
  
  beforeEach(() => {   
    cy.goToECStep(pt, scope);  
    cy.selectFairOppRadioOption(fo.radioNoneApply, "NO_NONE");    
    //Option selected is Equal LumpSum
    cy.selectEvaluationPlanOption(ep.equalLumpSum, "EQUAL_SET_LUMP_SUM");
    cy.clickContinueButton(
      ep.equalLumpSum,
      evalCriteria.setEqualLumpSum.headerText
      ); 
  });

  it("TC1: Asserts: Set Equal lump sum selected", () => {        
    cy.verifyTextMatches(
      ep.techPropAlertSubHeader,
      evalCriteria.setEqualLumpSum.alertSubHeader
      );
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(ep.custom0SpecTextbox);
  });
    
  it("TC2: Navigation: Click Back button", () => {
    cy.clickBackButton(
      ep.techPropAlertSubHeader,
      evalCriteria.workEvalPlan.headerText
      )
    cy.radioBtn(ep.equalLumpSum, "EQUAL_SET_LUMP_SUM").should("be.checked")
  });
});

