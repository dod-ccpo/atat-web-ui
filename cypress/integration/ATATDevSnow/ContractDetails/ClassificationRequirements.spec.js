import { bootstrapMockApis,cleanText}from "../../../helpers";
import common from "../../../selectors/common.sel"
import contractDetails from "../../../selectors/contractDetails.sel";


describe("Test suite: Contract Details Step:Classification Requirements substep", () => {

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
  });
    
  it("TC1: ClassificationReq on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    cy.activeStep(common.stepContractDetailsText);
    cy.activeStep(common.subStepClassReqsText);
      
  });

  it("TC2: Asserts: Classification Levels", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    const expectedintroText = "In the next section, we will dive into the types of resources," +
      " tools, and services that you need for this acquisition. The classification level(s)" +
      " that you select below will be applied to any performance requirements that you specify." +
      " If you need more than one level, we will walk you through what is required within each" +
      " level later."
    cy.findElement(contractDetails.introPText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedintroText);
    });

    cy.textExists(contractDetails.selectMess, "Select all that apply to your contracting effort.");
    const expectedLabels = [
      "Unclassified / Impact Level 2 (IL2)",
      "Unclassified / Impact Level 4 (IL4)",
      "Unclassified / Impact Level 5 (IL5)",
      "Secret / Impact Level 6 (IL6)",
    ]
    cy.verifyCheckBoxLabels('input[type=checkbox]',expectedLabels);
    cy.findElement(contractDetails.level5).should("not.be.checked")
      .check({ force: true }).should("be.checked");
    cy.findElement(contractDetails.level2).should("not.be.checked")
      .check({ force: true }).should("be.checked");
    cy.findElement(contractDetails.level4).should("not.be.checked")
      .check({ force: true }).should("be.checked");
  });

  it("TC3: Validations", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    cy.findElement(contractDetails.level5)
      .check({ force: true }).uncheck({ force: true })
      .then(() => {
        cy.checkErrorMessage(
          contractDetails.errorClassCheckBox,
          "Please select at least one classification level."
        );
      });   
  });

  it("TC4: Select Secret CheckBox", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    const alertMessage = "Contracts requiring access to classified information" +
      " (IL6 level and above) must complete a DD Form 254, DoD Contract Security" +
      " Classification Specification. We will walk you through uploading this form next."
    cy.findElement(contractDetails.level6).should("not.be.checked")
      .check({ force: true })     
      .then(() => {      
        cy.messageDisplays(contractDetails.alertMessage, alertMessage);        
      });   
  });

  it("TC5: Navigate Back", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    cy.findElement(contractDetails.level4).should("not.be.checked")
      .check({ force: true });     
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Let’s work on your performance requirements"); 
    cy.btnClick(common.backBtn, "Back");
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    const expectedLabels = [
      "Unclassified / Impact Level 4 (IL4)",
    ]
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked',expectedLabels);
    
      
  });

});
