import {randomString,randomAlphaNumeric} from "../../../../../helpers";
import ep from "../../../../../selectors/evaluationPlan.sel";
import evalCriteria from '../../../../../fixtures/evaluationCriteria.json';
import fo from "../../../../../selectors/fairOpportunityProcess.sel";

describe("Test suite: Test suite: TechProposal: LPTA", () => {
  
  const pt = "TC-Step-2-FairOpp-None-LPTA-" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-LPTA" + randomString(5);
  const evalPlanDescriptionText= `Technical proposal required; award will be made on a LPTA basis.`;
  
  before(() => {
    cy.selectNoneOption(pt, scope);    
    //Option selected is Tech Proposal
    cy.selectEvaluationPlanOption(ep.techProposal, "TECH_PROPOSAL");
    cy.selectMethodSelectionSectionOption(ep.lptaRadioBtn, "LPTA");
          
  });

  it("TC1: Custom Standards: Validations", () => {
    cy.verifyTextMatches(
      ep.customStandardsRadioGroupLabel,
      evalCriteria.noTechProposal.customRadioGroupLabel
    );
    // if radio option is not selected
    cy.verifyRequiredRadioBtn(
      ep.customRadioNoBtn,
      ep.customRadioGroupError,
      "Please select an option"
    );      
  });
  
  it("TC2: Navigation: Click Back button", () => {
    cy.clickBackButton(
      ep.customRadioYesBtn,
      evalCriteria.workEvalPlan.headerText);  
    cy.radioBtn(ep.techProposal, "TECH_PROPOSAL").should("be.checked");
    cy.radioBtn(ep.lptaRadioBtn, "LPTA");
  });

  it("TC3: Navigation: Evaluation Criteria Summary", () => {
    cy.clickContinueButton(
      ep.lptaRadioBtn,
      evalCriteria.lpta.headerText);  
    cy.findElement(ep.customRadioNoBtn).click({force:true});
    cy.clickContinueButton(
      ep.lptaRadioBtn,
      "Your Evaluation Criteria Summary"
    ); 
    cy.verifyTextMatches(fo.evalPlanDesriptionText,evalPlanDescriptionText);
  });
});
