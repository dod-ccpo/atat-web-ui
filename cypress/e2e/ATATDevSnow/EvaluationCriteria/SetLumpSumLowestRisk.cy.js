import { bootstrapMockApis,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fo from "../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../selectors/evaluationPlan.sel";



describe("Test suite: Option3 on Create Evaluation Plan: Lowest Risk", () => {
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
    //Option selected is Set LumpSum
    cy.selectEvaluationPlanOption(ep.setLumpSum, "SetLumpSum");
    cy.selectMethodSelectionSectionOption(ep.lowestRiskRadioBtn, "LowestRisk");
          
  });
  

  it("TC1:Select Other Assessment CheckBox: Custom Assessment", () => {
    cy.verifyTextMatches(
      ep.otherAssessmentareasLabel,
      evalCriteria.bestUse.otherAssessRadioLabel
    );
  
    cy.verifyCheckBoxLabels(
      ep.checkboxesLabel,
      evalCriteria.lowestRisk.otherAssessmentCheckboxes
    );
    cy.selectCustomAssessmentCheckboxOption();
    cy.enterTextInTextField(ep.custom0SpecTextbox, customText);   
    cy.textExists(ep.addAnotherCustomCS, "Add another assessment area").click()
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

  it("TC2: Navigation: Click on navigation buttons", () => {      
    cy.selectCheckBoxes([ep.automationCapabilityCheckBox]);
    cy.textExists(ep.noOtherBtn, " I don’t need other assessment areas").click();
    cy.textExists(".mb-auto", "Future Summary page");
    cy.textExists(common.backBtn, "Back").click();
    cy.verifyPageHeader("Now let’s review assessment criteria required for white papers");
    cy.textExists(common.backBtn, "Back").click();
    cy.verifyPageHeader(evalCriteria.workEvalPlan.headerText);
    cy.radioBtn(ep.setLumpSum, "SetLumpSum").should("be.checked");
    
  });

});