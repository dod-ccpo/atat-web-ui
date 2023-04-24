import {
  bootstrapMockApis,
  randomNumberBetween,
  numberWithCommas
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fd from "../../../selectors/financialDetails.sel";
import contractDetails from "../../../selectors/contractDetails.sel";

describe("Test suite: Financial Details Step: Incremental FP for your base period", 
  () => {

    beforeEach(() => {
      bootstrapMockApis();
      cy.launchATAT();
      cy.homePageClickAcquisitionPackBtn();
      cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
      cy.textExists(common.subStepPopText, " Period of Performance ");
      cy.dropDownClick(contractDetails.baseDropdownIcon);
        
    });
    
    it.skip("TC1: Let’s create an incremental funding plan for your base period", () => {
      cy.findElement(contractDetails.baseDropdownMonth).click();
      //Enter the Value for Base      
      const baseValue= "11"
      cy.findElement(contractDetails.baseInputTxtBox).type(baseValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Do you want to request a PoP start date?");
      cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
      cy.activeStep(common.stepFinancialDetailsText); 
      cy.verifyPageHeader(" Temporary Financial Details Page "); 
      const reqCostEstimateValue = randomNumberBetween(10000,1000000);
      cy.findElement("#TemporaryCostField_text_field").type(reqCostEstimateValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Tell us more about the scope of your project"); 
      cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
      cy.activeStep(common.subStepIFText); 
      cy.selectIncrementalFundingPlan(fd.iFundYesRadio, "YES");
      cy.textExists(fd.initialFILabel, " Initial funding increment ");
      const basePeriodValue = "Base period length: " + baseValue + " months";
      const costEstimateValue = "Total cost estimate: $" +numberWithCommas(reqCostEstimateValue)
      cy.findElement(fd.periodLength).should("contain", basePeriodValue);
      cy.findElement(fd.totalCostEst).should("contain", costEstimateValue);
      //enter the Initial Funding Increment Value
      const ifundingIncValue = randomNumberBetween(100,1000);
      const totalCostEstimate = reqCostEstimateValue - ifundingIncValue;
      const totalCostText = numberWithCommas(totalCostEstimate) 
      cy.findElement(fd.initalFITextbox).type(ifundingIncValue).then(() => {
        cy.clickSomethingElse(fd.addIncrementalbtn);
        //verify the total amount remaining
        cy.findElement(fd.amountRemaining).should("contain", totalCostText);        
        cy.findElement(fd.total).should("have.value", numberWithCommas(ifundingIncValue))
          .and("not.enabled");
      });
      cy.dropDownClick(fd.incrementalPeriod0DropdownIcon);
      //This is hardcoded and it needs to be changed in the next sprint
      const incrementalPeriod0DropdownList = [
        "4th QTR FY22",
        "1st QTR FY23",
        "2nd QTR FY23",
        "3rd QTR FY23",
        "4th QTR FY23",
        "1st QTR FY24"
      ]
      const ip0Value = reqCostEstimateValue - ifundingIncValue
      const total =  ifundingIncValue + ip0Value
      cy.verifyTextArray(fd.incrementalPeriod0DropdownList, incrementalPeriod0DropdownList);
      cy.findElement(fd.incrementalPeriod0AmountTextbox).type(ip0Value);
      cy.clickSomethingElse(fd.addIncrementalbtn);
      cy.findElement(fd.total).should("have.value", numberWithCommas(total))
        .and("not.enabled");
      cy.incrementalFundingExists();
      cy.btnClick(common.continueBtn, " Continue ");    
    
      cy.verifyPageHeader("Tell us about your financial POC ")
    }); 
  
    it.skip("TC2: Add funding increment & Delete", () => {
      cy.findElement(contractDetails.baseDropdownYear).click();
      //Enter the Value for Base
      const baseValue=randomNumberBetween(1,1)
      cy.findElement(contractDetails.baseInputTxtBox).type(baseValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Do you want to request a PoP start date?");
      cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
      cy.activeStep(common.stepFinancialDetailsText); 
      cy.verifyPageHeader(" Temporary Financial Details Page "); 
      const reqCostEstimateValue = randomNumberBetween(10000,100000);
      cy.findElement("#TemporaryCostField_text_field").type(reqCostEstimateValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Tell us more about the scope of your project"); 
      cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
      cy.activeStep(common.subStepIFText); 
      cy.selectIncrementalFundingPlan(fd.iFundYesRadio, "YES");
      const basePeriodValue = "Base period length: " + baseValue + " year";
      const costEstimateValue ="Total cost estimate: $" +numberWithCommas(reqCostEstimateValue);
      cy.findElement(fd.periodLength).should("contain", basePeriodValue);
      cy.findElement(fd.totalCostEst).should("contain", costEstimateValue);
      cy.textExists(fd.addIncrementalbtn, "Add funding increment").click().then(() => {
        cy.findElement("#IncrementPeriod1_dropdown_field_control").should("be.visible")
        cy.incrementalFundingExists();
      })
      // Click on Delete button to remove the incremental funding
      cy.findElement(fd.deleteBtn1).click().then(() => {
        cy.findElement("#IncrementPeriod1_dropdown_field_control").should("not.exist")
        cy.incrementalFundingExists();
      })
    
    }); 

    it.skip("TC3: Validations: Incremental Funding Plan", () => {
      cy.findElement(contractDetails.baseDropdownWeek).click();
      //Enter the Value for Base
      const baseValue=randomNumberBetween(50,52)
      cy.findElement(contractDetails.baseInputTxtBox).type(baseValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Do you want to request a PoP start date?");
      cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
      cy.activeStep(common.stepFinancialDetailsText); 
      cy.verifyPageHeader(" Temporary Financial Details Page "); 
      const reqCostEstimateValue = randomNumberBetween(10000,1000000);
      cy.findElement("#TemporaryCostField_text_field").type(reqCostEstimateValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Tell us more about the scope of your project"); 
      cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
      cy.selectIncrementalFundingPlan(fd.iFundYesRadio, "YES");
      //verify the validation for the inital Incremental funding
      cy.verifyRequiredInput(
        fd.initalFITextbox,
        fd.initalFIError,
        "Please enter the amount of your initial funding.");
      //verify the validation for the first Incremental funding
      cy.verifyRequiredInput(
        fd.incrementalPeriod0AmountTextbox,
        fd.incrementalPeriod0Error,
        "Please enter the amount of your first increment.");  
    
    }); 

    it.skip("TC4: If PoP length is less than 9 months", () => {
      cy.findElement(contractDetails.baseDropdownMonth).click();
      //Enter the Value for Base
      const baseValue=randomNumberBetween(1,8)
      cy.findElement(contractDetails.baseInputTxtBox).type(baseValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Do you want to request a PoP start date?");
      cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
      cy.activeStep(common.stepFinancialDetailsText); 
      cy.verifyPageHeader(" Temporary Financial Details Page "); 
      const reqCostEstimateValue = randomNumberBetween(10000,100000);
      cy.findElement("#TemporaryCostField_text_field").type(reqCostEstimateValue);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Tell us more about the scope of your project"); 
      cy.textExists(common.subStepIFLink, " Severability and Incremental Funding ").click();
      cy.activeStep(common.subStepIFText); 
      cy.verifyPageHeader(
        " Based on your period of performance," +
      " this effort does not qualify for an incremental funding plan. "
      );      
      cy.textExists(fd.linkToPoP, "update your period of performance. ").click();
      cy.verifyPageHeader("Let’s gather some details about the duration of your task order")
    }); 
  });

