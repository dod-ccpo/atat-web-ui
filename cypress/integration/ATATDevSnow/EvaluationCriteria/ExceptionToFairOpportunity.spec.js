import { bootstrapMockApis} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fo from "../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../selectors/evaluationPlan.sel";



describe("Test suite: Exception to Fair Opportunity", () => {
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
          
  });

  it("TC1: Asserts: Let’s see if you qualify for an exception to the fair opportunity process",
    () => {
      cy.verifyPageHeader(evalCriteria.fairOpportunity.headerText);
      cy.textExists(fo.fairOppLabel, evalCriteria.fairOpportunity.alertHeaderText);
      cy.verifyTextMatches(fo.fairOppAlertMessage, evalCriteria.fairOpportunity.alertMessage);
      cy.verifyTextMatches(fo.exceptionRadioOption, evalCriteria.fairOpportunity.radioGroupLabel);

      //Link exists in alert message
      cy.textExists(fo.exceptExternalLink, "FAR 16.505(b)(2)");

      //assert radio buttons labels
      cy.radioBtn(fo.radioOneCSP, "YES_FAR_16_505_B_2_I_B").not("[disabled]");
      cy.radioBtn(fo.radioAllFair, "YES_FAR_16_505_B_2_I_C").not("[disabled]");
      cy.radioBtn(fo.radioUrgent, "YES_FAR_16_505_B_2_I_A").not("[disabled]");
      cy.radioBtn(fo.radioNoneApply, "NO_NONE").not("[disabled]");    
        
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

  it("TC3: If there is NOT an exception to fair opportunity", () => {
    cy.verifyPageHeader(evalCriteria.fairOpportunity.headerText);

    //select Radio option as None
    cy.selectFairOppRadioOption(fo.radioNoneApply, "NO_NONE");    
    
    //Description 
    cy.verifyTextMatches(ep.introDescription, evalCriteria.workEvalPlan.introDescription);
    cy.verifyTextMatches(ep.evalPlanOptionsLabel, evalCriteria.workEvalPlan.epRadioGroupLabel);

    //Learn More Drawer
    cy.textExists(ep.learnMoreLink, "Learn more").click().then(() => {
      cy.findElement(common.slidePanel).scrollIntoView().should("exist");      
      cy.textExists(
        common. panelTitle,
        evalCriteria.workEvalPlan.panelHeader
      );
      cy.findElement(common.slidePanelCloser).scrollIntoView().click().then(() => {
        cy.findElement(common.slidePanel).scrollIntoView().should("not.visible");
      });
    });
    //Option selected is No Tech Proposal
    cy.selectEvaluationPlanOption(ep.noTechProposal, "NoTechProposal");

    //Option selected is Tech Proposal
    cy.selectEvaluationPlanOption(ep.techProposal, "TechProposal");

    //Option selected is Set LumpSum
    cy.selectEvaluationPlanOption(ep.setLumpSum, "SetLumpSum");

    //Option selected is Equal LumpSum
    cy.selectEvaluationPlanOption(ep.equalLumpSum, "EqualSetLumpSum");
  });
  
  it("TC4: If there is an exception to fair opportunity", () => {
    cy.verifyPageHeader(evalCriteria.fairOpportunity.headerText);

    //select radio option as OnlyOneCSPCapable
    cy.selectFairOppRadioOption(fo.radioOneCSP, "YES_FAR_16_505_B_2_I_B");
    cy.verifyTextMatches(fo.evalPlanAlertHeader, evalCriteria.needEvalPlan.alertHeaderText);
    cy.verifyTextMatches(fo.evalPlanAlertMessageIntro, evalCriteria.needEvalPlan.introMessage);
    cy.verifyTextMatches(fo.evalPlanAlertSecondMessage, evalCriteria.needEvalPlan.secondMessage);
    cy.textExists(common.backBtn, "Back").click();
    cy.verifyPageHeader(evalCriteria.fairOpportunity.headerText);
    
    //change the option to Urgent
    cy.selectFairOppRadioOption(fo.radioUrgent, "YES_FAR_16_505_B_2_I_A");
    cy.findElement(fo.evalPlanAlert).should("exist");
    cy.textExists(common.backBtn, "Back").click();
    cy.verifyPageHeader(evalCriteria.fairOpportunity.headerText);

    //change Option to All Fair
    cy.selectFairOppRadioOption(fo.radioAllFair, "YES_FAR_16_505_B_2_I_C");
    cy.findElement(fo.evalPlanAlert).should("exist");
    cy.textExists(common.continueBtn, "Continue").click();

  });
});

