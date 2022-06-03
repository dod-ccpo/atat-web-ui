import { bootstrapMockApis,cleanText, randomAlphaNumeric} from "../../../helpers";
import common from "../../../selectors/common.sel"
import contractDetails from "../../../selectors/contractDetails.sel";

describe("Test suite: Contract Details Step: Contract Type substep", () => {


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
        
  });
    
  it("TC1: Contract Type on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepContractTypeText, " Contract Type ").click();;
    cy.activeStep(common.stepContractDetailsText);      
    cy.activeStep(common.subStepContractTypeText)      
      .click();     
      
  });
  
  it("TC2: Asserts: Which contract type(s) applies to this acquisition?", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(contractDetails.popRadioGroup).should("exist");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, " Will this be a future recurring requirement? ");
    cy.radioBtn(contractDetails.yesRadioOption,  "YES").not("[disabled]").click({force: true});
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, " Which contract type(s) apply to this acquisition? ");
    const expectedRecuringReqText = "Firm-Fixed-Price (FFP) is the standard contract type" +
      " for JWCC task orders. You must provide justification for a time-and-materials (T&M)" +
      " or hybrid contract, in accordance with FAR 12.207. If you are considering a T&M" +
      " contract, we suggest contacting the DITCO Contracting Office for further guidance."
    cy.findElement(contractDetails.introPText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedRecuringReqText);

    });
    cy.textExists(contractDetails.farLink, "FAR 12.207.");
    cy.textExists(contractDetails.selectMessageText,
      "Select all that apply to your contracting effort.")
    //assert checkbox options
    cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").should("not.be.checked")
      .check({ force: true }).uncheck({ force: true });
    cy.findCheckBox(contractDetails.tmCheckBox, "T&M").should("not.be.checked")
      .check({ force: true }).uncheck({ force: true });      
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
  });

  it("TC3: ContractType: Select checkbox options", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(contractDetails.popRadioGroup).should("exist");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, " Will this be a future recurring requirement? ");
    cy.radioBtn(contractDetails.yesRadioOption, "YES").not("[disabled]").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, " Which contract type(s) apply to this acquisition? ");
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
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.activeStep(common.subStepClassReqsText);
  });

});