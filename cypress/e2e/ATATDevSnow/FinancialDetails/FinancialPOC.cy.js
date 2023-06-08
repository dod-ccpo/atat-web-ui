import {
  bootstrapMockApis,
  randomNumberBetween,
  numberWithCommas
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contact from "../../../selectors/contact.sel";
import fd from "../../../selectors/financialDetails.sel";
import contractDetails from "../../../selectors/contractDetails.sel";

describe("Test suite: Financial Details Step: Financial POC",() => {
  let contactInfo;

  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("contactInfo").then((info) => {
      contactInfo = info;
    });
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepPopText, " Period of Performance ");
    cy.dropDownClick(contractDetails.baseDropdownIcon);    
  });
    
  it.skip("TC1: Tell us about your financial POC: Select Civilian", () => {
    cy.findElement(contractDetails.baseDropdownMonth).click();
    //Enter the Value for Base
    const baseValue="11"
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
    const costEstValue = "Total cost estimate: $" +numberWithCommas(reqCostEstimateValue) ;
    cy.findElement(fd.periodLength).should("contain", basePeriodValue);
    cy.findElement(fd.totalCostEst).should("contain", costEstValue);
    //enter the Initial Funding Increment Value
    const ifundingIncValue = randomNumberBetween(100,1000);
    const totalCostEst = reqCostEstimateValue - ifundingIncValue;
    const totalCostText =  numberWithCommas(totalCostEst)      
    cy.findElement(fd.initalFITextbox).type(ifundingIncValue).then(() => {
      cy.clickSomethingElse(fd.addIncrementalbtn);
      cy.findElement(fd.amountRemaining).should("contain", totalCostText); 
      cy.findElement(fd.total).should("have.value", numberWithCommas(ifundingIncValue))
        .and("not.enabled");
    });
    cy.dropDownClick(fd.incrementalPeriod0DropdownIcon);   
    const ip0Value = reqCostEstimateValue - ifundingIncValue
    const total =  ifundingIncValue + ip0Value
    cy.findElement(fd.incrementalPeriod0AmountTextbox).type(ip0Value);
    cy.clickSomethingElse(fd.addIncrementalbtn);
    cy.findElement(fd.total).should("have.value", numberWithCommas(total))
      .and("not.enabled");
    cy.incrementalFundingExists();
    cy.btnClick(common.continueBtn, " Continue ");    
    
    cy.verifyPageHeader("Tell us about your financial POC ");
    //list of Affiliationrole
    cy.findElement(fd.contactRoleTxt).then(($role) => {
      expect($role).to.have.text(
        " What role best describes your affiliation with the DoD? "
      );
    });        
    //Assert radio options
    cy.radioBtn(contact.militaryRadioBtn, "MILITARY").not("[disabled]");
    cy.radioBtn(contact.civilianRadioBtn,"CIVILIAN").not("[disabled]");    
    //select radio button
    cy.financialPOCAffiliation(contact.civilianRadioBtn,"CIVILIAN");
    //Salutation dropdown
    cy.dropDownClick(contact.salutationDropDownIcon);
    const salutationDropdownList = [
      "Mr.",
      "Mrs.",
      "Miss",
      "Ms.",
      "Dr.",
    ];
    let foundDropdownList = 0
    //Verify the list in the dropdown
    cy.findElement(contact.salutationDropDownList)
      .children()
      .each(($el) => {
        const text = $el.text();
        if (salutationDropdownList.indexOf(text) > -1) {
          foundDropdownList++
        };
        return foundDropdownList === salutationDropdownList.length;
      })  
    //select the salutationfrom dropdown
    cy.findElement(contact.salutationDropdownListItemMr)
      .should("have.text", "Mr.").click({ force: true });        
    // Assert ContactInformation Labels
    cy.textExists(contact.fNameLabel, " First name ");     
    cy.textExists(contact.lNameLabel, " Last name ");        
    cy.textExists(contact.mNameLabel, " Middle name  Optional ");  
    cy.textExists(fd.emailLabel, " Email address ");
    cy.textExists(fd.emailMessage, " Enter a .mil or .gov email address.");
    cy.textExists(fd.phoneNumberLabel, " Phone number ");
    const contactInformation = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName,
      emailSelector: fd.emailTextbox,
      email: contactInfo.email
            
    };        
    //Enter the Contact Information
    cy.enterContactInformation(contactInformation);
    //select the country and enter phonenumber
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "united",
      contact.countryListItems,
      fd.phoneInputBox,
      "5327845362"
    );
    cy.btnClick(common.continueBtn, " Continue ");   
      
  }); 
  
  it.skip("TC2: Select Military", () => {
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
    const costEstValue = "Total cost estimate: $" +numberWithCommas(reqCostEstimateValue) ;
    cy.findElement(fd.periodLength).should("contain", basePeriodValue);
    cy.findElement(fd.totalCostEst).should("contain", costEstValue);
    //enter the Initial Funding Increment Value
    const ifundingIncValue = randomNumberBetween(100,1000);
    const totalCostEst = reqCostEstimateValue - ifundingIncValue;
    const totalCostText =  numberWithCommas(totalCostEst)      
    cy.findElement(fd.initalFITextbox).type(ifundingIncValue).then(() => {
      cy.clickSomethingElse(fd.addIncrementalbtn);
      cy.findElement(fd.amountRemaining).should("contain", totalCostText); 
      cy.findElement(fd.total).should("have.value", numberWithCommas(ifundingIncValue))
        .and("not.enabled");
    });
    cy.dropDownClick(fd.incrementalPeriod0DropdownIcon);   
    const ip0Value = reqCostEstimateValue - ifundingIncValue
    cy.findElement(fd.incrementalPeriod0AmountTextbox).type(ip0Value);
    cy.btnClick(common.continueBtn, " Continue ");
    
    cy.verifyPageHeader("Tell us about your financial POC ");
    //list of Affiliationrole
    cy.findElement(fd.contactRoleTxt).then(($role) => {
      expect($role).to.have.text(
        " What role best describes your Financial POC's affiliation? "
      );
    });
    //select radio button
    cy.financialPOCAffiliation(
      contact.militaryRadioBtn,
      "MILITARY",
      contact.serviceBranchAirForce
    );
    //Click Rank dropdown
    cy.dropDownClick(contact.rankInput);              
    //select the value from Rank Dropdown
    cy.findElement(contact.rankAutoCompleteList).first().click({ force: true });
    //enter the ContactInformation
    const contactInformation = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName1,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName1,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName1,
      emailSelector: fd.emailTextbox,
      email: contactInfo.email1,
            
    };
    cy.enterContactInformation(contactInformation);
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Defense",
      contact.countryListItems,
      fd.phoneInputBox,
      "312-560-1000");

  });
});

