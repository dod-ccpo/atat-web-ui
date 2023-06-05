import { bootstrapMockApis, randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fo from "../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../selectors/evaluationPlan.sel";



describe("Test suite: Technical proposal: Option two on Create Evaluation Plan: BVTO", () => {
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
    cy.selectMethodSelectionSectionOption(ep.bvtoRadioBtn, "BVTO");
          
  });
  
  it("TC1: BVTO: Custom Standards: Select radio buttons", () => {
    cy.verifyTextMatches(
      ep.customStandardsRadioGroupLabel,
      evalCriteria.noTechProposal.customRadioGroupLabel
    );
    // Validation message if Custom Standards is not selected
    cy.verifyRequiredRadioBtn(
      ep.customRadioNoBtn,
      ep.customRadioGroupError,
      "Please select an option"
    );
    cy.selectCustomStandardsRadioOption(ep.customRadioNoBtn, "NO");
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
    cy.verifyPageHeader(evalCriteria.bvto.differentiatorsHeaderText);
  });
    
  it("TC2: Differentiator(s) screen", () => {
    cy.selectCustomStandardsRadioOption(ep.customRadioYesBtn, "YES");
    cy.enterTextInTextField(ep.custom0SpecTextbox, customText);     
    cy.textExists(common.continueBtn, "Continue").click();
    //What differentiator(s) should be used to distinguish between technical proposals?” screen.
    cy.verifyPageHeader(evalCriteria.bvto.differentiatorsHeaderText);
    cy.verifyTextMatches(
      ep.introDescription,
      evalCriteria.bvto.diffIntroDesc
    );
    cy.verifyCheckBoxLabels(
      ep.checkboxesLabel,
      evalCriteria.bvto.differentiatorOptions
    );    
    cy.selectCheckBoxes([ep.levelComplexityCheckbox, ep.capGain]);
    cy.selectOtherCheckboxOption(
      ep.otherCheckboxOption,
      "CustomDifferentiators",
      ep.customDifferentiatorSection);
    cy.btnClick(common.continueBtn, " Continue "); 
    
  });

  it("TC3: Differentiator(s) screen: Validations, Add & Remove", () => {
    cy.selectCustomStandardsRadioOption(ep.customRadioYesBtn, "YES");
    cy.enterTextInTextField(ep.custom0SpecTextbox, customText);     
    cy.textExists(common.continueBtn, "Continue").click();
    cy.verifyPageHeader(evalCriteria.bvto.differentiatorsHeaderText);
    //Validation message
    cy.verifyRequiredCheckbox(
      ep.levelComplexityCheckbox,
      ep.differentitorsError,
      "Please select at least one differentiator."
    );    
    cy.selectOtherCheckboxOption(
      ep.otherCheckboxOption,
      "CustomDifferentiators",
      ep.customDifferentiatorSection);
    cy.verifyRequiredInput(
      ep.custom0SpecTextbox,
      ep.custom0SpecTextboxError,
      "Please enter a custom differentiator.");
    cy.textExists(ep.addAnotherCustomCS, "Add another differentiator").click()
      .then(() => {
        cy.findElement(ep.customDifferentiator1Spec).should("exist").and("contain.text", "2");  
        cy.customSpecExists();
        cy.enterTextInTextField(ep.custom1SpecTextbox, customText);
        cy.findElement(ep.custom1DeleteBtn).click().then(() => {
          cy.findElement(ep.custom1SpecTextbox).should("not.exist");
        });
        
      });
    cy.btnClick(common.continueBtn, " Continue ");
  });

  it("TC4: Navigation: Click on Back Button: Differentiator(s) screen", () => {
    cy.selectCustomStandardsRadioOption(ep.customRadioNoBtn, "NO");
    cy.textExists(common.continueBtn, "Continue").click();
    cy.verifyPageHeader(evalCriteria.bvto.differentiatorsHeaderText);      
    cy.selectCheckBoxes([ep.levelComplexityCheckbox, ep.capGain]);
    cy.textExists(common.backBtn, "Back").click().then(() => {
      cy.verifyPageHeader(evalCriteria.bvto.headerText);
      cy.radioBtn(ep.customRadioNoBtn, "NO").should("be.checked");
    });
    cy.textExists(common.backBtn, "Back").click().then(() => {
      cy.verifyPageHeader(evalCriteria.workEvalPlan.headerText);
      cy.radioBtn(ep.bvtoRadioBtn, "BVTO").should("be.checked");
      cy.radioBtn(ep.techProposal, "TechProposal").should("be.checked");
    });
  });
});

