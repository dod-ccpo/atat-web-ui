import { bootstrapMockApis,randomAlphaNumeric,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel"
import contractDetails from "../../../selectors/contractDetails.sel";
import co from "../../../selectors/contractOffice.sel";

describe("Test suite: Contract Details Step: Contract Type substep", () => {
  let pt = "TC-Step-3-ContractDetails-Contract Type-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5); 

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);   
    cy.homePageClickAcquisitionPackBtn(true);
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists(common.stepAcquisitionText, " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");    
    cy.fillNewAcquisition(pt, scope);
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepContractTypeText, " Contract Type ").click();   
    cy.activeStep(common.subStepContractTypeText);
    cy.verifyPageHeader(
      "Which contract type(s) apply to this acquisition?"
    )
  });
    
  it("TC1: Asserts: Which contract type(s) applies to this acquisition?", () => {
        
    const expectedRecuringReqText = "Firm-fixed-price (FFP) is the standard contract type for" +
      " JWCC task orders. For JWCC, consumption-based line items are considered FFP." +
      " You must provide justification for a time-and-material (T&M) or hybrid contract," +
      " in accordance with FAR 12.207. If you are considering a T&M contract," +
      " we suggest contacting your Contracting Office for further guidance."
    cy.verifyTextMatches(contractDetails.introPText,expectedRecuringReqText);    
    cy.textExists(contractDetails.farLink, "FAR 12.207.");
    cy.textExists(contractDetails.selectMessageText,
      "Select all that apply to your contracting effort.")
    //assert checkbox options
    cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").should("not.be.checked")
      .check({ force: true });
    cy.findCheckBox(contractDetails.tmCheckBox, "T&M").should("not.be.checked")
      .check({ force: true }).uncheck({ force: true });      
    cy.btnExists(common.continueBtn, " Continue ")
      .not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.ffpCheckBox);
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    cy.btnExists(common.backBtn, "Back").click();
    cy.waitUntilElementIsGone(contractDetails.classCheckBoxes);
    cy.verifyPageHeader(
      "Which contract type(s) apply to this acquisition?"
    );    
    const expectedLabel = [
      "Firm-fixed-price (FFP) RecommendedStandard contract type"   
      
    ]
    cy.verifyCheckBoxLabels(contractDetails.selectedContractTypeOption,expectedLabel);    
  });

  it("TC2: ContractType: Select checkbox options", () => {
    
    //Select the checkbox options
    cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").should("not.be.checked")
      .check({ force: true });
    cy.findCheckBox(contractDetails.tmCheckBox, "T&M").should("not.be.checked")
      .check({ force: true }).then(() => {
        cy.findElement(contractDetails.tmTextFieldLabel).should("exist");
        cy.textExists(contractDetails.tmTextFieldLabel,
          "Please provide justification for your T&M contract type.");
        cy.textExists(contractDetails.tmLearnMoreLink, "Learn more").should("exist");
        const inputText = randomAlphaNumeric(8);
        cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, inputText);
      });   
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(contractDetails.ffpCheckBox);
    cy.activeStep(common.subStepClassReqsText);
    cy.btnExists(common.backBtn, "Back").click();
    cy.waitUntilElementIsGone(contractDetails.classCheckBoxes);
    cy.verifyPageHeader(
      "Which contract type(s) apply to this acquisition?"
    );
    cy.waitUntil(function() {
      return cy.findElement("#JustificationEntry").should("be.visible"); 
    })
    const expectedLabels = ["Firm-fixed-price (FFP) RecommendedStandard contract type",
      "Time-and-material (T&M) A justification is required for any contract line" +
      " item other than travel."      
    ]
    cy.verifyCheckBoxLabels(contractDetails.selectedContractTypeOption,expectedLabels);    
      
  });

});