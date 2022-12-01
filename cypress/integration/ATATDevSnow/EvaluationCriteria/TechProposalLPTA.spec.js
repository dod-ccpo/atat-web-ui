import { bootstrapMockApis,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fo from "../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../selectors/evaluationPlan.sel";



describe("Test suite: Select technical proposal: Option2 on Create Evaluation Plan: LPTA", () => {
  let evalCriteria;
  const customText = randomString(5);

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
    
    //Option selected is Tech Proposal
    cy.selectEvaluationPlanOption(ep.techProposal, "TechProposal");
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
    cy.verifyPageHeader(evalCriteria.lpta.headerText);
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
    cy.textExists(common.continueBtn, "Continue").click();
  });  

  it("TC3: Navigation: Click Back button", () => {
    cy.verifyPageHeader(evalCriteria.lpta.headerText);
    cy.textExists(common.backBtn, "Back").click();
    cy.verifyPageHeader(evalCriteria.workEvalPlan.headerText);  
    cy.radioBtn(ep.techProposal, "TechProposal").should("be.checked");
    cy.radioBtn(ep.lptaRadioBtn, "LPTA");
  });
});
