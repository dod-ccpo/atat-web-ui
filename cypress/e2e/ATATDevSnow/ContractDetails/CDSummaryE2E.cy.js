import {
  randomNumberBetween,
  randomAlphaNumeric,
  randomString
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import co from "../../../selectors/contractOffice.sel";
import contractDetails from "../../../selectors/contractDetails.sel";


describe("Test suite: Contract Details Step:Summary - E2E", () => {
  let pt = "TC-Step-3-ContractDetails-E2E-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);

  // Enter data here
  let basePeriod = "41";
  let dropDownOption = "Year"; // Year/Months/Weeks/Days
  // Note: dropDownOption and basePeriod should be: Year-1, Months<12, Weeks<52, Days<365
  let optionPeriod = "No" // Yes/No
  let optPeriod = "1";
  let optOption = "Year";

  let popStart = "Yes"; //Yes/No
  let popStartOption = "Not later than";
  let popStartDate = "11"

  let recurringRequirement = "Yes";

  beforeEach(() => {
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists(common.stepAcquisitionText, " Acquisition Package Details ");
    //Verify the Substeps are  visible
    //cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");
    //cy.fillNewAcquisition(pt, scope);
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.verifyPageHeader("Let’s gather details about the duration of your task order");
  });


  it.only("TC1: Contract Details: Step#1> Period of Performance Page 1 to 3", () => {
    // Page#1 Duration of task year
    cy.verifyPageHeader("Let’s gather details about the duration of your task order");

    if (dropDownOption = "Year") {
      cy.findElement(contractDetails.baseDropdownIcon).click();
      cy.findElement(contractDetails.baseDropdownYear).click();
      cy.findElement(contractDetails.baseInputTxtBox).clear().type(basePeriod);
    } else if (dropDownOption = "Months") {
      cy.findElement(contractDetails.baseDropdownIcon).click();
      cy.findElement(contractDetails.baseDropdownMonth).click();
      cy.findElement(contractDetails.baseInputTxtBox).clear().type(basePeriod);
    } else if (dropDownOption = "Weeks") {
      cy.findElement(contractDetails.baseDropdownIcon).click();
      cy.findElement(contractDetails.baseDropdownWeek).click();
      cy.findElement(contractDetails.baseInputTxtBox).clear().type(basePeriod);
    } else if (dropDownOption = "Days") {
      cy.findElement(contractDetails.baseDropdownIcon).click();
      cy.findElement(contractDetails.baseDropdownDays).click();
      cy.findElement(contractDetails.baseInputTxtBox).clear().type(basePeriod);
    }
    if (optionPeriod = "Yes") {
      cy.findElement(contractDetails.addOptionLink).click();
      cy.findElement(contractDetails.optionDropdownIcon).click();
      cy.findElement(contractDetails.optionDropdownYear).click();
      cy.findElement(contractDetails.optionalTextBox).clear().type(optPeriod);
    }

    // Page#2 Request Pop Start Date
    // cy.btnExists(common.continueBtn, " Continue ").click();
    // cy.wait(2000); // waituntil recommended
    // cy.verifyPageHeader(" Do you want to request a PoP start date? ");

    cy.clickContinueButton(contractDetails.addOptionLink, " Do you want to request a PoP start date? ")

    if (popStart = "Yes") {
      cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").click({
        force: true
      });
      cy.findElement(contractDetails.requestedStartDropdownIcon).click();
      cy.wait(30);
      if (popStartOption = "No Sooner than") {
        cy.findElement(contractDetails.requestedStartDateNosoonerthan).click();
        cy.selectDatefromDatePicker(
          contractDetails.calendarIcon, contractDetails.navigateNextMonth,
          contractDetails.selectDate, popStartDate, contractDetails.datePicker);
      } else if (popStartOption = "Not later than") {
        cy.findElement(contractDetails.requestedStartDateNotlaterthan).click();
        cy.selectDatefromDatePicker(
          contractDetails.calendarIcon, contractDetails.navigateNextMonth,
          contractDetails.selectDate, popStartDate, contractDetails.datePicker);
      }
    } else if (popStart = "No") {
      cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO").click();
    }
    // cy.btnExists(common.continueBtn, " Continue ").click();
    // cy.wait(2000);
    // // Page#3 Recurring Requirement-------------------
    // cy.verifyPageHeader("Will this be a recurring requirement?")

    
    cy.clickContinueButton(contractDetails.popStartDateNoRadioOption, "Will this be a recurring requirement?")
    //assert radio button options
    if (recurringRequirement = "Yes") {
      cy.radioBtn(contractDetails.yesRadioOption, "YES").click({
        force: true
      });
    } else
      cy.radioBtn(contractDetails.noRadioOption, "NO").click({
        force: true
      });
    cy.btnExists(common.continueBtn, " Continue ").click();
  });


});