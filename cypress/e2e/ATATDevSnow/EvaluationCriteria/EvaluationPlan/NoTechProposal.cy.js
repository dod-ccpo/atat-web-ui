import {randomString,randomAlphaNumeric} from "../../../../helpers";
import fo from "../../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../../selectors/evaluationPlan.sel";
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';

describe("Test suite: No technical proposal ", () => {  
  const pt = "TC-Step-2-EC-FairOpp-None-noTech" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-noTech" + randomString(5);

  beforeEach(() => {    
    cy.goToECStep(pt, scope);  
    cy.selectFairOppRadioOption(fo.radioNoneApply, "NO_NONE"); 
    //Option selected is No Tech Proposal
    cy.selectEvaluationPlanOption(ep.noTechProposal, "NO_TECH_PROPOSAL");
    cy.clickContinueButton(
      ep.noTechProposal,
      evalCriteria.noTechProposal.headerText
      );    
    
  });

  it("TC1: Asserts: No Tech Proposal option selected", () => {    
    cy.verifyTextMatches(
      ep.techPropAlertSubHeader,
      evalCriteria.noTechProposal.alertSubHeader
    );    
    cy.selectCustomStandardsRadioOption(ep.customRadioNoBtn, "NO");
  });  

  it("TC2: Validation: Compliance Standards", () => {
    // if radio option is not selected
    cy.verifyRequiredRadioBtn(
      ep.customRadioNoBtn,
      ep.customRadioGroupError,
      "Please select an option"
    );      
    
  });    

  it("TC3: Navigation: Click Back button", () => {   
    cy.clickBackButton(
      ep.customRadioYesBtn,
      evalCriteria.workEvalPlan.headerText
      );  
    cy.radioBtn(ep.noTechProposal, "NO_TECH_PROPOSAL").should("be.checked")
  });
});

