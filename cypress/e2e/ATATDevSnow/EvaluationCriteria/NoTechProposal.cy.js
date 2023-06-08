import { bootstrapMockApis,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fo from "../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../selectors/evaluationPlan.sel";

describe("Test suite: Option One on Create Evaluation Plan: No technical proposal ", () => {

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
    //Option selected is No Tech Proposal
    cy.selectEvaluationPlanOption(ep.noTechProposal, "NoTechProposal");
    cy.textExists(common.continueBtn, "Continue").click();
    
  });

  it("TC1: Asserts: No Tech Proposal option selected", () => {    
    cy.verifyPageHeader(evalCriteria.noTechProposal.headerText);
    cy.textExists(fo.evalPlanAlertHeader, "Compliance Standards");  
    cy.verifyTextMatches(
      ep.techPropAlertSubHeader,
      evalCriteria.noTechProposal.alertSubHeader
    );
    cy.verifyTextMatches(
      ep.customStandardsRadioGroupLabel,
      evalCriteria.noTechProposal.customRadioGroupLabel
    );
    cy.selectCustomStandardsRadioOption(ep.customRadioYesBtn, "YES");
    cy.selectCustomStandardsRadioOption(ep.customRadioNoBtn, "NO");
  });  

  it("TC2: Validation: Compliance Standards", () => {
    cy.verifyPageHeader(evalCriteria.noTechProposal.headerText);

    // if radio option is not selected
    cy.verifyRequiredRadioBtn(
      ep.customRadioNoBtn,
      ep.customRadioGroupError,
      "Please select an option"
    );      
    
  });  

  it("TC3: Add another compliance standard and then remove", () => {
    cy.verifyPageHeader(evalCriteria.noTechProposal.headerText);
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

  it("TC4: Navigation: Click Back button", () => {
    cy.verifyPageHeader(evalCriteria.noTechProposal.headerText);
    cy.textExists(common.backBtn, "Back").click();
    cy.verifyPageHeader(evalCriteria.workEvalPlan.headerText);  
    cy.radioBtn(ep.noTechProposal, "NoTechProposal").should("be.checked")
  });
});

