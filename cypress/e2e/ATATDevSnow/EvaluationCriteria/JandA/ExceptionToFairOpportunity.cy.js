import { randomString, randomAlphaNumeric} from "../../../../helpers";  
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';
import fo from "../../../../selectors/fairOpportunityProcess.sel";


describe("Test suite: Exception to Fair Opportunity", () => {

  const pt = "TC-Step-2-EvalCriteria-FairOpp- " + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-" + randomString(5);
  const noneApply = "NO_NONE";
  const oneCSP = "YES_FAR_16_505_B_2_I_B";
  const allFair = "YES_FAR_16_505_B_2_I_C";
  const urgent ="YES_FAR_16_505_B_2_I_A";

  
  
  
  beforeEach(() => { 

    cy.goToECStep(pt, scope);          
  });

  it("TC1: Asserts:Let’s see if you qualify for an exception to the fair opportunity process",
    () => {
      
      cy.textExists(fo.fairOppLabel, evalCriteria.fairOpportunity.alertHeaderText);      
      //based on the radio option selected mesage appears        
      cy.messageForFairOppRadioOptions(fo.radioNoneApply, noneApply);
      cy.messageForFairOppRadioOptions(fo.radioOneCSP, oneCSP);
      cy.messageForFairOppRadioOptions(fo.radioAllFair, allFair);
      cy.messageForFairOppRadioOptions(fo.radioUrgent, urgent);
    });

  it("TC2: Radio options: Validations", () => {
    cy.verifyPageHeader(evalCriteria.fairOpportunity.headerText);

    // if radio option is not selected
    cy.findElement(fo.radioNoneApply).focus();
    cy.clickSomethingElse(fo.exceptionRadioOptError)
      .then(() => {
        cy.checkErrorMessage(fo.exceptionRadioOptError, "Please select an option");
      });    
  });

});


