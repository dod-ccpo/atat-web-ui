import { randomString, randomAlphaNumeric } from "../../../../../helpers";
import fo from "../../../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../../../selectors/evaluationPlan.sel";
import evalCriteria from "../../../../../fixtures/evaluationCriteria.json";

describe(
  "Test suite: Option four on Create Evaluation Plan: Set Equal lump sum",
  { testIsolation: false },
  () => {
    const pt = "TC-Step-2-EvalCriteria-FairOpp-None" + randomAlphaNumeric(5);
    const scope = "EvaluationCriteria-FairOpp-None" + randomString(5);
    const evalDescriptionText = `Purchase an equal set lump sum dollar amount from each CSP.`;

    before(() => {
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
      cy.verifyTextMatches(
        fo.evalPlanAlertMessageIntro,
        evalCriteria.setEqualLumpSum.alertIntro
      );
      cy.clickContinueButton(
        fo.evalPlanAlertHeader,
        "Your Evaluation Criteria Summary"
      );
    });

    it("TC2:Evaluation Criteria Summary page", () => {
      cy.verifyTextMatches(fo.evalPlanDesriptionText, evalDescriptionText);
      cy.clickAndWaitForElementExists(fo.evalPlanCompleteBtn, ep.equalLumpSum);
      cy.radioBtn(ep.equalLumpSum, "EQUAL_SET_LUMP_SUM").should("be.checked");
    });
  }
);
