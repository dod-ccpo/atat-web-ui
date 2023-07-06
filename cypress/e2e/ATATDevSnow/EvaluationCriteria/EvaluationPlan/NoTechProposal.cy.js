import {randomString,randomAlphaNumeric} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import fo from "../../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../../selectors/evaluationPlan.sel";
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';

describe("Test suite: No technical proposal ", () => {
  
  const customText = randomString(5);
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
    cy.selectCustomStandardsRadioOption(ep.customRadioYesBtn, "YES");
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

  it("TC3: Add another compliance standard and then remove", () => {    
    cy.selectCustomStandardsRadioOption(ep.customRadioYesBtn, "YES");
    cy.enterTextInTextField(ep.custom0SpecTextbox, customText);    
    cy.textExists(ep.addAnotherCustomCS, "Add another compliance standard").click()
      .then(() => {
        cy.findElement(ep.custom1Spec).should("exist").and("contain.text", "2");  
        cy.customSpecExists();
        cy.enterTextInTextField(ep.custom1SpecTextbox, customText);
        cy.findElement(ep.custom1DeleteBtn).click().then(() => {
          cy.findElement(ep.custom1SpecTextbox).should("not.exist");
        });
        
      });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(ep.custom0SpecTextbox);
    
  });  

  it("TC4: Navigation: Click Back button", () => {   
    cy.clickBackButton(
      ep.customRadioYesBtn,
      evalCriteria.workEvalPlan.headerText
      );  
    cy.radioBtn(ep.noTechProposal, "NO_TECH_PROPOSAL").should("be.checked")
  });
});

