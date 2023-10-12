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
  const pt = "TC-Step-3-ContractDetails-E2E-" + randomAlphaNumeric(5);
  const scope = "Project Scope-" + randomString(5);
  const dropDownBase = "Day(s)"; //Year/Month(s)/ Week(s)/ Day(s)
  const dropDownOption = "Year"; //Year/Month(s)/ Week(s)/ Day(s)
  const optionPeriod = "Yes"; // Yes/No
  const randomMonth = randomNumberBetween(1, 12);
  const randomWeek = randomNumberBetween(1, 52);
  const randomDay = randomNumberBetween(1, 365);

  const popStart = "Yes"; //Yes/No
  const popStartOption = "noSoonerThan"; // noSoonerThan/notLaterThan
  const popStartDate = "11";
  const recurringRequirement = "Yes";
  const contractType = "FFP"; // FFP/T&M
  const textTM = " Test123";
  // Step#3:Classification Requirements
  const requiredLabels = [
    "level2",
    //'level4',
    "level5",
    "level6",
    "tops",
  ];
  const requiredSCCheckboxes = [
    "scCkbox1",
    "scCkbox2",
    "scCkbox3",
    "scCkbox4",
    //'scCkbox5','scCkbox6','scCkbox7',
    "scCkbox8",
    "scCkbox9",
    "scCkbox10",
    //'scCkbox11','scCkbox12',
  ];
  const requiredTSCheckboxes = [
    "tsCkbox1",
    "tsCkbox2",
    "tsCkbox3",
    //'tsCkbox4','tsCkbox5','tsCkbox6',
    "tsCkbox7",
    "tsCkbox8",
    // 'tsCkbox9','tsCkbox10',
    "tsCkbox11",
    "tsCkbox12",
  ];
  const expectedLabelMaps = {
    level2: contractDetails.level2,
    level4: contractDetails.level4,
    level5: contractDetails.level5,
    level6: contractDetails.level6,
    tops: contractDetails.ts,
  };

  const cdsOption = "Yes";
  const pfsText = "TestFS - " + randomAlphaNumeric(3);
  const soText = randomAlphaNumeric(17);
  const cdsText = randomNumber(2);

  before(() => {
    cy.goToAcqPackageStepOne(pt, scope);
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.verifyPageHeader(CDData.POPPage1.pageHeader1);
  });

  function selectPopLength(
    dropDownIcon,
    listItems,
    dropDown,
    inputBox,
    calendar
  ) {
    cy.findElement(dropDownIcon).click();
    cy.get(listItems).contains(dropDown).click({
      force: true,
    });
    switch (calendar) {
    //Year/Month(s)/ Week(s)/ Day(s)
    case "Year":
      enterTextInInputBox(inputBox, "1");
      break;
    case "Month(s)":
      enterTextInInputBox(inputBox, randomMonth);
      break;
    case "Week(s)":
      enterTextInInputBox(inputBox, randomWeek);
      break;
    case "Day(s)":
      enterTextInInputBox(inputBox, randomDay);
      break;
    default:
      break;
    }
  }
  function scCloudCheckboxes() {
    cy.findElement(contractDetails.secretCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
  }

  function topSCCloudCheckboxes() {
    cy.findElement(contractDetails.tsCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
  }

  function enterTextInInputBox(inputBoxSelector, text) {
    cy.get(inputBoxSelector).clear().type(text);
  }

  it("TC1: Contract Details:Step#03 All Pages E2E Happy path", () => {
    // Page#1 Duration of task year
    cy.verifyPageHeader(CDData.POPPage1.pageHeader1);
    selectPopLength(
      contractDetails.baseDropdownIcon,
      contractDetails.baseDropdownListItems,
      dropDownBase,
      contractDetails.baseInputTxtBox,
      dropDownBase
    );
    if (optionPeriod === "Yes") {
      cy.findElement(contractDetails.addOptionLink).click();
      selectPopLength(
        contractDetails.optionDropdownIcon,
        contractDetails.optionDropdownListItems,
        dropDownOption,
        contractDetails.optionalTextBox,
        dropDownOption
      );
    }

    // Page#2- POP request Pop start date
    cy.clickContinueButton(
      contractDetails.addOptionLink,
      CDData.POPPage2.pageHeader2
    );
    if (popStart === "Yes") {
      cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").click({
        force: true,
      });
      const requestedStartDropdownMap = {
        noSoonerThan: contractDetails.requestedStartDateNosoonerthan,
        notLaterThan: contractDetails.requestedStartDateNotlaterthan,
      };
      cy.findElement(contractDetails.requestedStartDropdownIcon).click();
      cy.wait(30);
      cy.findElement(requestedStartDropdownMap[popStartOption]).click({
        force: true,
      });
      cy.selectDatefromDatePicker(
        contractDetails.calendarIcon,
        contractDetails.navigateNextMonth,
        contractDetails.selectDate,
        popStartDate,
        contractDetails.datePicker
      );
    } else cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO").click();

    // Page#3 POP- Recurring Requirement:
    cy.clickContinueButton(
      contractDetails.popStartDateNoRadioOption,
      CDData.POPPage3.pageHeader3
    );
    const recurringMap = {
      Yes: contractDetails.yesRadioOption,
      No: contractDetails.noRadioOption,
    };
    cy.findElement(recurringMap[recurringRequirement]).click({
      force: true,
    });
    cy.clickContinueButton(
      contractDetails.noRadioOption,
      CDData.contractTypePage.pageHeader4
    );

    // # Page2 Contract Details- Contract Type:..........
    if (contractType === "FFP") {
      cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").check({
        force: true,
      });
    } else if (contractType === "T&M") {
      cy.findCheckBox(contractDetails.tmCheckBox, "T&M").check({
        force: true,
      });
      cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, textTM);
    }
    cy.clickContinueButton(
      contractDetails.tmCheckBox,
      CDData.classLevelPage1.pageHeaderCL1
    );

    // # Page3 Contract Details- Classification Requirements:...
    requiredLabels.forEach((requiredLabel) => {
      cy.findElement(expectedLabelMaps[requiredLabel]).click({
        force: true,
      });
    });
    cy.wait(2000);
    cy.clickContinueButton(
      contractDetails.level2,
      CDData.classLevelPage2.pageHeaderCL2
    );
    scCloudCheckboxes();
    topSCCloudCheckboxes();
    cy.wait(4000);
    cy.clickContinueButton(
      contractDetails.checkbox1,
      CDData.classLevelPage3.pageHeaderCL3
    );
    if (cdsOption === "Yes") {
      cy.findElement(contractDetails.cdsYesOption).click({
        force: true,
      });
      cy.selectCheckBoxes([
        contractDetails.unclastoSecrCB,
        contractDetails.tsToS,
      ]);
      cy.enterTextInTextField(contractDetails.cdsUtoSTxtbox, cdsText);
      cy.enterTextInTextField(contractDetails.cdsTStoSTxtbox, cdsText);
      cy.enterTextInTextField(contractDetails.projectedFSField, pfsText);
      cy.anticipatedNeedUsage(
        contractDetails.anticipatedTxtbox,
        soText,
        contractDetails.entiredDurationNo
      );
    } else if (cdsOption === "No") {
      cy.findElement(contractDetails.cdsNoOption).click({
        force: true,
      });
    }
    cy.clickContinueButton(
      contractDetails.cdsNoOption,
      CDData.classificationSummary.pageHeaderSummary
    );

    // Contract Details: Summary page:---
    cy.textExists(contractDetails.popHeading, " Period of Performance (PoP)");
    cy.textExists(contractDetails.contractTypeHeading, " Contract Type ");
    cy.contains(contractDetails.contractTypeDescription, contractType);
    cy.textExists(
      contractDetails.classReqHeading,
      " Classification Requirements "
    );
    cy.btnExists(contractDetails.classReqComplete, " View/Edit ");
    cy.btnExists(contractDetails.contractComplete, " View/Edit ");
    cy.btnExists(contractDetails.popComplete, " View/Edit ")
      .not("[disabled]")
      .click();
  });
});
