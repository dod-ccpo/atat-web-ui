import { bootstrapMockApis,randomNumberBetween,randomNumber} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fd from "../../../selectors/financialDetails.sel";
import contractDetails from "../../../selectors/contractDetails.sel";

describe("Test suite: Financial Details Step: Severability and Incremental Funding substep", () => {
  
  
  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
  });
    
  it.skip("TC1: Incremental Funding on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    cy.activeStep(common.stepFinancialDetailsText)

    //Verify the Substeps are  visible
    cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
    cy.activeStep(common.subStepIFText);     
      
  });
  
  it.skip("TC2: Asserts: Are you requesting to incrementally fund this requirement? ", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
    cy.verifyPageHeader(" Are you requesting to incrementally fund this requirement? ");
    
    const expectedBody = "To request incremental funding," +
      " your requirement must be severable in nature." +
      " This means that it can be divided and apportioned" +
      " into two or more parts that are not necessarily" +
      " dependent upon each other. If you select Yes below," +
      " we will help you generate a projected schedule for your" +
      " incremental funding next.";
    cy.verifyTextMatches(fd.iFundIntroTxt, expectedBody);     
    //Assert Radio buttons
    cy.radioBtn(fd.iFundYesRadio, "YES").not("[disabled]");
    cy.radioBtn(fd.iFundNoRadio, "NO").not("[disabled]");
    //verify the Links
    cy.textExists(
      fd.IFPFAQ1Link,
      " How do I know if my requirement is severable? ")
      .click().then(() => {
        const expectedContentTxt = "Severable services are continuing and recurring in nature" +
          " (e.g., systems development support provided on a level-of-effort basis)." +
          " \"Severable\" means tasks can be separated into components that independently" +
          " meet a separate and on-going need of the government." +
          " U.S. Government Accountability Office (GAO) considers services to be non-severable" +
          " when they constitute an entire job or single undertaking with a defined end-product" +
          " that cannot feasibly be subdivided for separate performance in each fiscal year." +
          " GAO's Principles of Federal Appropriations Law presents a contract to conduct a" +
          " study and prepare a final report as an example of non-severable services and" +
          " concludes that non-severable services must be funded entirely out of the" +
          " appropriation current at the time of award, notwithstanding that performance" +
          " may extend into future fiscal years. Following that logic, GAO has further" +
          " determined that contracts for non-severable services cannot be incrementally funded."
          ;
        cy.findElement(fd.IFPFAQ1ContentText).should("exist")
        cy.verifyTextMatches(fd.IFPFAQ1ContentText,expectedContentTxt);
        cy.clickLink( fd.IFPFAQ1Link);
      });
    cy.textExists(
      fd.IFPFAQ2Link,
      "How does this affect my acquisition package?")
      .click().then(() => {
        const expectedFAQ2ContentTxt = "If you want to incrementally fund this requirement," +
          " your final acquisition package must include a Certification of Severability and" +
          " Incremental Funding Plan. The purpose of this document is to provide" +
          " Defense Information Technology Contracting Organization (DITCO) with:" +
          " written certification that the requirement is severable in nature; a" +
          " projected schedule for fully funding any contract line items that are not" +
          " optional in nature, regardless of contract type; a projected schedule for fully" +
          " funding firm-fixed-price contract line items in order to populate DFARS clause" +
          " 252.232-7007, Limitation of Government’s Obligation; and provide assurance to DITCO" +
          " that funds have been budgeted and will be available to fully fund" +
          " contract line items that are not optional in nature.";
        cy.findElement(fd.IFPFAQ2ContentText).scrollIntoView().should("exist");
        cy.verifyTextMatches(fd.IFPFAQ2ContentText, expectedFAQ2ContentTxt);
        cy.clickLink( fd.IFPFAQ2Link);
      });
    cy.selectIncrementalFundingPlan(fd.iFundNoRadio, "NO");
    
  });
  
  it.skip("TC3: Warning Message,if PoP & Cost estimate are missing", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
    cy.verifyPageHeader(" Are you requesting to incrementally fund this requirement? ");       
    cy.radioBtn(fd.iFundYesRadio, "YES").click({force: true}).then(() => {
      cy.findElement(fd.alertWarning).should("exist");
      
      cy.textExists(
        fd.alertWarningHeader,
        "Your  period of performance and requirements cost estimate are  missing. ");
      const warningContext = "We will not be able to create your incremental funding plan" +
        " until we have this missing info. We recommend updating your Period of Performance" +
        " section and the Requirements Cost Estimate section before proceeding.";
      cy.verifyTextMatches(fd.alertInfoMessage, warningContext);
      cy.textExists(fd.updatePOPLink, "Period of Performance section");
      cy.textExists(fd.updateRCELink, "Requirements Cost Estimate section").click().then(() => {
        cy.verifyPageHeader(" Temporary Financial Details Page "); 
        cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
        cy.verifyPageHeader(" Are you requesting to incrementally fund this requirement? ");
      });
    })
      
  });
  
  it.skip("TC4: Warning Message,if PoP missing", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");    
    cy.verifyPageHeader(" Temporary Financial Details Page "); 
    const value = randomNumber(5)
    cy.findElement("#TemporaryCostField_text_field").type(value);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Tell us more about the scope of your project"); 
    const contractorAmt = randomNumberBetween(1, 50);
    cy.fillSurgeCapabilities(contractorAmt, "continue");
    cy.verifyPageHeader(" What type of funding request did you use for this acquisition? ");
    cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
    cy.verifyPageHeader(" Are you requesting to incrementally fund this requirement? "); 
    cy.radioBtn(fd.iFundYesRadio, "YES").click({ force: true }).then(() => {
      cy.findElement(fd.alertWarning).should("exist");
      
      cy.textExists(
        fd.alertWarningHeader,
        "Your  period of performance is  missing. ");
      cy.textExists(fd.contractDetailsLink, "Contract Details section")
        .click().then(() => {
          cy.verifyPageHeader("Let’s gather some details about the duration of your task order");
        })
      cy.dropDownClick(contractDetails.baseDropdownIcon);
      cy.findElement(contractDetails.baseDropdownMonth).click();
      //Enter the Value for Base
      cy.findElement(contractDetails.baseInputTxtBox).type("12");
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Do you want to request a PoP start date?");
      cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
      cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
      cy.radioBtn(fd.iFundYesRadio, "YES").click({ force: true }).then(() => {
        cy.findElement(fd.alertWarning).should("not.exist");
      });
    });
      
  });

  it.skip("TC5: Warning Message,if Cost estimate missing", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click();
    //Enter the Value for Base
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.btnClick(common.continueBtn, " Continue ");  
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    // click on Step-10 financialdetails step
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");    
    cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
    cy.verifyPageHeader(" Are you requesting to incrementally fund this requirement? ");       
    cy.radioBtn(fd.iFundYesRadio, "YES").click({ force: true }).then(() => {
      cy.findElement(fd.alertWarning).should("exist");
      cy.textExists(
        fd.alertWarningHeader,
        "Your  requirements cost estimate is  missing. ");
      cy.textExists(fd.contractDetailsLink, "Requirements Cost Estimate section")
        .click().then(() => {
          cy.verifyPageHeader(" Temporary Financial Details Page ");
        });
    });
      
  });
  
  it.skip("TC6: Validations: Severability and Incremental Funding Substep ", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
    cy.verifyPageHeader(" Are you requesting to incrementally fund this requirement? ");
    cy.radioBtn(fd.iFundYesRadio, "YES").focus();
    cy.clickSomethingElse(fd.iFundRadioerror)
      .then(() => {
        cy.checkErrorMessage(fd.iFundRadioerror, "Please select an option");
      });
    
  }); 
    
});
