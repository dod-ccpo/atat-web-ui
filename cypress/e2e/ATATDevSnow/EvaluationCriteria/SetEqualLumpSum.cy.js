import { bootstrapMockApis} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fo from "../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../selectors/evaluationPlan.sel";

describe("Test suite: Option four on Create Evaluation Plan: Set Equal lump sum", () => {
  let evalCriteria;
  
  beforeEach(() => {
    cy.fixture("evaluationCriteria").then((data) => {
      evalCriteria = data;
    });
    
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepEvaluationCriteriaLink, " Evaluation Criteria ");
    cy.activeStep(common.stepFairOppText);
    cy.verifyPageHeader(
      "Let’s see if you qualify for an exception to the fair opportunity process"
    );  
    cy.selectFairOppRadioOption(fo.radioNoneApply, "NO_NONE"); 
    //Option selected is Equal LumpSum
    cy.selectEvaluationPlanOption(ep.equalLumpSum, "EqualSetLumpSum");
    cy.textExists(common.continueBtn, "Continue").click();
  });

  it("TC1: Asserts: Set Equal lump sum selected", () => {   
    
    cy.verifyPageHeader(evalCriteria.setEqualLumpSum.headerText);
    cy.textExists(fo.evalPlanAlertHeader,  evalCriteria.setEqualLumpSum.alertHeader);  
    cy.verifyTextMatches(
      ep.techPropAlertSubHeader,
      evalCriteria.setEqualLumpSum.alertSubHeader
    );
    cy.verifyTextMatches(
      fo.evalPlanAlertMessageIntro,
      evalCriteria.setEqualLumpSum.alertIntro
    );
    cy.textExists(common.continueBtn, "Continue").click();
    cy.textExists(".mb-auto", "Future Summary page");
  });
    
  it("TC2: Navigation: Click Back button", () => {
    cy.verifyPageHeader(evalCriteria.setEqualLumpSum.headerText);
    cy.textExists(common.backBtn, "Back").click();
    cy.verifyPageHeader(evalCriteria.workEvalPlan.headerText);
    cy.radioBtn(ep.equalLumpSum, "EqualSetLumpSum").should("be.checked")
  });
});

