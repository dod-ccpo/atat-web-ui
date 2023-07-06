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
  
  it("TC2: Add another compliance standard and then remove", () => {
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
    cy.clickContinueButton(
      ep.customRadioYesBtn,
      "Let’s gather details about the duration of your task order"
    );
  });  

  it.only("TC3: Navigation: Click Back button", () => {
    cy.clickBackButton(
      ep.customRadioYesBtn,
      evalCriteria.workEvalPlan.headerText);  
    cy.radioBtn(ep.techProposal, "TECH_PROPOSAL").should("be.checked");
    cy.radioBtn(ep.lptaRadioBtn, "LPTA");
  });
});
