import { bootstrapMockApis,
  randomString,
  randomAlphaNumeric}from "../../../helpers";
import common from "../../../selectors/common.sel";
import co from "../../../selectors/contractOffice.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import background from "../../../selectors/background.sel";


describe("Test suite: Contract Details Step:Classification Requirements substep", () => {
  let pt = "TC-Step-3-ContractDetails-ClassLevel-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);  

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists(common.stepAcquisitionText, " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");    
    cy.fillNewAcquisition(pt, scope);
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    cy.activeStep(common.subStepClassReqsText);
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
  });
    
  it("TC1: Asserts: Classification Levels", () => {   
    
    const expectedintroText = "In the next section, we will dive into the types of resources," +
      " tools, and services that you need for this acquisition. The classification level(s)" +
      " that you select below will be applied to any performance requirements that you specify." +
      " If you need more than one level, we will walk you through what is required within each" +
      " level later."
    cy.verifyTextMatches(contractDetails.introPText,expectedintroText);    

    cy.textExists(contractDetails.selectMess, "Select all that apply to your project.");
    const expectedLabels = [
      "Unclassified / Impact Level 2 (IL2)" +
      " Accommodates DoD information approved for public release" +
      " (Low Confidentiality and Moderate Integrity)",
      "Unclassified / Impact Level 4 (IL4)" +
      " Accommodates DoD Controlled Unclassified Information (CUI)",
      "Unclassified / Impact Level 5 (IL5) Accommodates DoD CUI and National Security Systems",
      "Secret / Impact Level 6 (IL6)",
      "Top Secret"
    ]
    cy.verifyCheckBoxLabels(contractDetails.classCheckBoxes,expectedLabels);
    cy.findElement(contractDetails.level5).should("not.be.checked")
      .check({ force: true }).should("be.checked");
    cy.findElement(contractDetails.level2).should("not.be.checked")
      .check({ force: true }).should("be.checked");
    cy.findElement(contractDetails.level4).should("not.be.checked")
      .check({ force: true }).should("be.checked");
  });

  it("TC2: Validations", () => {        
    cy.findElement(contractDetails.level5)
      .check({ force: true }).uncheck({ force: true })
      .then(() => {
        cy.checkErrorMessage(
          contractDetails.errorClassCheckBox,
          "Please select at least one classification level."
        );
      });   
  });

  it("TC3: Select Secret & TS CheckBox", () => {
    const alertMessage = "You do not need to complete a DD Form 254," +
      " DoD Contract Security Classification Specification, for this task order." +
      " JWCC provides a DD Form 254 at the contract level that covers access to all" +
      " classification levels for the task orders ordered within it."
    cy.selectSecretLevel(
      contractDetails.level6,      
      alertMessage);
    cy.unselectSecretLevel(contractDetails.level6);   
    cy.findElement(contractDetails.level5).should("not.be.checked")
      .check({ force: true }).uncheck({ force: true });
    cy.selectSecretLevel(contractDetails.ts, alertMessage);
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.waitUntilElementIsGone(contractDetails.level2);    
    cy.verifyPageHeader("Let’s find out more about your security requirements");
  });

  it("TC4: Navigate Back", () => {
    cy.findElement(contractDetails.level4).should("not.be.checked")
      .check({ force: true });     
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(contractDetails.ts);
    cy.verifyPageHeader("Do you have a current contract for this effort?"); 
    cy.waitUntilElementIsGone(contractDetails.ts);
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(background.currentYesRadioOption,);
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );    
    const expectedLabels = [
      "Unclassified / Impact Level 4 (IL4)" +
      " Accommodates DoD Controlled Unclassified Information (CUI)",
    ]
    cy.verifyCheckBoxLabels(contractDetails.checkedClassCheckBoxes,expectedLabels);       
  });

});
