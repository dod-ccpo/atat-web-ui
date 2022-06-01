import { bootstrapMockApis,colors} from "../../../helpers";
import common from "../../../selectors/common.sel";
import financialDetails from "../../../selectors/financialDetails.sel";

describe("Test suite: Financial Details:Requirements Cost Estimate", () => {

  let projectDetails;
  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("projectOverview").then((details) => {
      projectDetails = details;
    });
    cy.launchATAT();
        
  });
  it("TC1: Requirements Cost Estimate substep is active on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepRequirementsCostEstimateText,
      " Requirements Cost Estimate ");  ;
    cy.activeStep(common.stepFinancialDetailsCircle);  
    cy.activeStep(common.subStepRequirementsCostEstimateText);  
        
  });

  it("TC2: Surge Capabilities-Asserts and Validations Tell us more about the scope of your project",
    () => {

      cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
      // Navigates to "Tell us more about the scope of your project"
      cy.textExists(common.header, "Tell us more about the scope of your project");
        
      //Label of the view
      cy.textExists(financialDetails.surgeCapabilitiesTxt, "Surge Capabilities");
        
      // ContractPricePercentage text
      cy.textExists(financialDetails.contractPriceTxt,
        " If surge capabilities are required, what percentage of the" +
        " contractor’s total proposed price will not be exceeded? ");
        
      //Enter the aplha numeric value to validate the error message 
      cy.fillSurgeCapabilities(projectDetails.invalidTextContractPercentage);
        
      //Enter the value more than 50  to validate the error message
      cy.fillSurgeCapabilities(projectDetails.invalidTextContractPercentage);
        
      //Enter the value more than 50  to validate the error message
      cy.fillSurgeCapabilities(projectDetails.invalidLessNumericContractPercentage);

      //buttons that exists on the view
      cy.btnExists(common.continueBtn, " Continue ");
      cy.btnExists(common.backBtn, "Back");
        
      //Enter the Valid Percentage
      cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
    });


})
