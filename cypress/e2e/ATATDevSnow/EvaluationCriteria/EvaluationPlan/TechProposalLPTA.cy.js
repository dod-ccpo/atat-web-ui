import {randomString,randomAlphaNumeric} from "../../../../helpers";
import ep from "../../../../selectors/evaluationPlan.sel";
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';

describe("Test suite: Test suite: TechProposal: LPTA", () => {

  const customText = randomString(5);
  const pt = "TC-Step-2-FairOpp-None-LPTA-" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-LPTA" + randomString(5);
  
  beforeEach(() => {
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
});
