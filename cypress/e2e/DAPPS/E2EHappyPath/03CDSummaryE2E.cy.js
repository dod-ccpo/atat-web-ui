import {
  randomAlphaNumeric,
  randomNumber,
  randomNumberBetween,
  randomString,
  suffixId,

} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import CDData from "../../../fixtures/ContractDetailsData/CDData.json";

describe("Test suite: Contract Details Step:Summary - E2E", () => {
  let pt = "TC-Step-3-ContractDetails-E2E-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);

  let basePeriod = "42";

  let dropDownBase = "Week(s)"; //Year/Month(s)/ Week(s)/ Day(s) 
  let optionPeriod = "Yes" // Yes/No
  let dropDownOption = "Day(s)"; //Year/Month(s)/ Week(s)/ Day(s)
  let randomMonth = randomNumberBetween(1, 12);
  let randomWeek = randomNumberBetween(1, 52);
  let randomDay = randomNumberBetween(1, 365);


  let optPeriod = "1";
  let popStart = "Yes"; //Yes/No
  let popStartOption = "Not later than"; // No Sooner than/Not later than
  let popStartDate = "11"
  let recurringRequirement = "Yes";
  let contractType = "FFP"; // FFP/T&M
  let textTM = " Test123"
  // Step#3:Classification Requirements
  let IL2 = "No";
  let IL4 = "Yes";
  let IL5 = "No";
  let IL6 = "Yes";
  let ts = "Yes";
  let classSummary = "";
  let cdsOption = "Yes";
  const pfsText = "TestFS - " + randomAlphaNumeric(3);
  const soText = randomAlphaNumeric(17);
  let cdsText = randomNumber(2);


  beforeEach(() => {
    cy.goToAcqPackageStepOne(pt, scope);
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.verifyPageHeader(CDData.POPPage1.pageHeader1);
  });

  it("TC1: Contract Details: Step#1> Period of Performance Page 1 to 3", () => { // Page#1 Duration of task year

    cy.verifyPageHeader(CDData.POPPage1.pageHeader1);
    cy.findElement(contractDetails.baseDropdownIcon).click()
    cy.get(contractDetails.baseDropdownListItems).contains(dropDownBase).click({
      force: true
    });
    if (dropDownBase == "Year") {
      cy.findElement(contractDetails.baseInputTxtBox).clear().type("1")
    } else if (dropDownBase == "Month(s)") {
      cy.findElement(contractDetails.baseInputTxtBox).clear().type(randomMonth)
    } else if (dropDownBase == "Week(s)") {
      cy.findElement(contractDetails.baseInputTxtBox).clear().type(randomWeek)
    } else if (dropDownBase == "Day(s)") {
      cy.findElement(contractDetails.baseInputTxtBox).clear().type(randomDay)
    }

    if (optionPeriod == "Yes") {
      cy.findElement(contractDetails.addOptionLink).click();
      cy.findElement(contractDetails.optionDropdownIcon).click();
      cy.get(contractDetails.optionDropdownListItems).contains(dropDownOption).click({
        force: true
      });
      if (dropDownOption == "Year") {
        cy.findElement(contractDetails.optionalTextBox).clear().type("1")
      } else if (dropDownOption == "Month(s)") {
        cy.findElement(contractDetails.optionalTextBox).clear().type(randomMonth)
      } else if (dropDownOption == "Week(s)") {
        cy.findElement(contractDetails.optionalTextBox).clear().type(randomWeek)
      } else if (dropDownOption == "Day(s)") {
        cy.findElement(contractDetails.optionalTextBox).clear().type(randomDay)
      }
 
    }
    // Page#2- POP request Pop start date
    cy.clickContinueButton(contractDetails.addOptionLink, CDData.POPPage2.pageHeader2)
    if (popStart == "Yes") {
      cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").click({
        force: true
      });
      cy.findElement(contractDetails.requestedStartDropdownIcon).click();
      cy.wait(30);
      if (popStartOption == "No Sooner than") {
        cy.findElement(contractDetails.requestedStartDateNosoonerthan).click();
        cy.selectDatefromDatePicker(
          contractDetails.calendarIcon, contractDetails.navigateNextMonth,
          contractDetails.selectDate, popStartDate, contractDetails.datePicker);
      } else if (popStartOption == "Not later than") {
        cy.findElement(contractDetails.requestedStartDateNotlaterthan).click();
        cy.selectDatefromDatePicker(
          contractDetails.calendarIcon, contractDetails.navigateNextMonth,
          contractDetails.selectDate, popStartDate, contractDetails.datePicker);
      }
    } else if (popStart == "No") {
      cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO").click();
    }

    // Page#3 POP- Recurring Requirement:
    cy.clickContinueButton(contractDetails.popStartDateNoRadioOption, CDData.POPPage3.pageHeader3)

    if (recurringRequirement == "Yes") {
      cy.radioBtn(contractDetails.yesRadioOption, "YES").click({
        force: true
      });
    } else
      cy.radioBtn(contractDetails.noRadioOption, "NO").click({
        force: true
      });
    cy.clickContinueButton(contractDetails.noRadioOption, CDData.classificationSummary.pageHeaderSummary)
 
   // # Page2 Contract Details- Contract Type:..........
   cy.findElement(contractDetails.contractStart).click();
    if (contractType == "FFP") {
      cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").check({
        force: true
      });
    } else if (contractType == "T&M") {
      cy.findCheckBox(contractDetails.tmCheckBox, "T&M").check({
        force: true
      });
      cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, textTM);
    }
    cy.clickContinueButton(contractDetails.tmCheckBox, CDData.classificationSummary.pageHeaderSummary);

  // # Page3 Contract Details- Classification Requirements:...
     cy.findElement(contractDetails.classReqStart).click();
    if (IL2 == "Yes") {
      cy.findElement(contractDetails.level2).check({
        force: true
      });
      classSummary = "IL2";
    }
    if (IL4 == "Yes") {
      cy.findElement(contractDetails.level4).check({
        force: true
      });
      classSummary = classSummary + " " + "Unclassified/IL4";;
    }
    if (IL5 == "Yes") {
      cy.findElement(contractDetails.level5).check({
        force: true
      });
      classSummary = classSummary + " " + "IL5";;
    }
    if (IL6 == "Yes") {
      cy.findElement(contractDetails.level6).check({
        force: true
      });
      classSummary = classSummary + " " + "Secret/IL6,";;
    }
    if (ts == "Yes") {
      cy.findElement(contractDetails.ts).check({
        force: true
      });
      classSummary = classSummary + " " + "Top Secret";;
    }
    cy.log(" Class summary is ", classSummary);
    cy.wait(2000);
    cy.clickContinueButton(contractDetails.level2, CDData.classLevelPage2.pageHeaderCL2);
    const scb_5Sel = suffixId(contractDetails.checkbox_5, "Secret");
    const tscb_6Sel = suffixId(contractDetails.checkbox_6, "TopSecret");
    const tscb_9Sel = suffixId(contractDetails.checkbox_9, "TopSecret");
    cy.selectCheckBoxes([scb_5Sel, tscb_6Sel, tscb_9Sel]);
    cy.wait(4000);
    cy.clickContinueButton(contractDetails.checkbox_1, CDData.classLevelPage3.pageHeaderCL3);
    if (cdsOption == "Yes") {
      cy.findElement(contractDetails.cdsYesOption)
        .click({
          force: true
        });
      cy.selectCheckBoxes([contractDetails.unclastoSecrCB, contractDetails.tsToS, ]);
      cy.enterTextInTextField(contractDetails.cdsUtoSTxtbox, cdsText);
      cy.enterTextInTextField(contractDetails.cdsTStoSTxtbox, cdsText);
      cy.enterTextInTextField(contractDetails.projectedFSField, pfsText);
      cy.anticipatedNeedUsage(contractDetails.anticipatedTxtbox, soText, contractDetails.entiredDurationNo);
    } else if (cdsOption == "No") {
      cy.findElement(contractDetails.cdsNoOption)
        .click({
          force: true
        });
    }
    cy.clickContinueButton(contractDetails.cdsNoOption, CDData.classificationSummary.pageHeaderSummary);
  

    // Contract Details: Summary page:---

    cy.textExists(contractDetails.popHeading, " Period of Performance (PoP)");
    cy.textExists(contractDetails.contractTypeHeading, " Contract Type ");
    cy.contains(contractDetails.contractTypeDescription, contractType);
    cy.textExists(contractDetails.classReqHeading, " Classification Requirements ");
    cy.btnExists(contractDetails.classReqComplete, " View/Edit ");
    cy.btnExists(contractDetails.contractComplete, " View/Edit ");
    cy.btnExists(contractDetails.popComplete, " View/Edit ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.popComplete);
    cy.verifyPageHeader(" Let’s gather details about the duration of your task order ");

  });

});