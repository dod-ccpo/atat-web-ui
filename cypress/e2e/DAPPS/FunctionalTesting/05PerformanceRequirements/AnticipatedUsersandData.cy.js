import {
  randomAlphaNumeric,
  randomString,
  randomNumberBetween,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import contractDetails from "../../../../selectors/contractDetails.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";

describe("Test suite: Anticipated Users and Data needs", () => {
  const pt = "TC-Step-5-Anticipated User and Data-" + randomAlphaNumeric(5);
  const scope = "Anticipated User and Data" + randomString(5);
  const input = randomString(4);
  const selectedClassifications = ["level2", "level4"];
  const noOfUsers = randomNumberBetween(1, 2);

  let accordionIndex;
  let anticipatedDurationVal;
  let selectedDropdownValue;

  const val = randomNumberBetween(1, 9);
  const dataTransferVal = randomNumberBetween(1, 9);
  const anticipatedDurationVal1 = "No";
  const anticipatedDurationVal2 = "No";

  const estimateGrowth1 = "customGrowth";
  const estimateGrowth2 = "singleGrowth";

  before(() => {
    cy.goToContractDetailsStep(
      pt,
      scope,
      contractDetails.popStartDateNoRadioOption,
      "NO",
      input
    );
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
    cy.verifyPageHeader(" Let’s work on your performance requirements ");
    cy.findElement(performanceReqs.startXaaSBtn).contains("Start");
    cy.findElement(performanceReqs.startXaaSBtn).click();
    cy.selectCheckBoxes([performanceReqs.devtoolsCheckBox]);
    cy.clickContinueButton(
      performanceReqs.devtoolsCheckBox,
      "First, tell us about your anticipated users and data needs"
    );
    cy.anticipatedUserDataNeedAccordion(selectedClassifications);
  });

  it("TC1: Validations", () => {
    cy.log("Validation for Increase in user");
    cy.radioBtn(performanceReqs.acc0QuesNo, "NO").focus().focus();
    cy.clickSomethingElse(performanceReqs.userTransferError).then(() => {
      cy.checkErrorMessage(
        performanceReqs.userTransferError,
        "Please select an option"
      );
    });

    cy.log("Validation for data.interenet Textfield");
    cy.verifyRequiredInput(
      performanceReqs.dataTransferText0field,
      performanceReqs.dataTransferText0Error,
      "Enter the amount of data egress anticipated in this task order."
    );
  });

  it("TC2:Anticipated Users and Data as No", () => {
    accordionIndex = 0;

    cy.selectCheckBoxes([performanceReqs.conusEast0Checkbox]);
    cy.findElement(performanceReqs.conusEastRegionText0).type(noOfUsers);

    cy.log("Section 1: Anticipated user as No");
    cy.setDurationUserData(anticipatedDurationVal1, accordionIndex, "user");

    cy.log("Section 2: Anticipated data as No");
    cy.setDurationUserData(anticipatedDurationVal2, accordionIndex, "data");
    cy.dataTransfer(accordionIndex, dataTransferVal, selectedDropdownValue);
  });

  it("TC3:Anticipated Users and Data as Yes", () => {
    accordionIndex = 1;
    anticipatedDurationVal = "Yes";
    selectedDropdownValue = "PB";

    cy.selectCheckBoxes([performanceReqs.africom1Checkbox]);
    cy.findElement(performanceReqs.africomRegionText1).type(noOfUsers);

    cy.log("Section 1: Anticipated user as Yes in accordion 2")
    cy.setDurationUserData(
      anticipatedDurationVal,
      accordionIndex,
      "user",
      estimateGrowth1,
      val
    );

    cy.log("Section 2: Anticipated data as Yes in accordion 2") 
    cy.setDurationUserData(
      anticipatedDurationVal,
      accordionIndex,
      "data",
      estimateGrowth2,
      val
    );
    cy.dataTransfer(accordionIndex, dataTransferVal, selectedDropdownValue);

    cy.clickContinueButton(
      performanceReqs.noDataquestion1,
      "What type of Developer Tools and Services do you need?"
    );
    cy.clickContinueButton(
      performanceReqs.subAlertMessage,
      "Your XaaS Summary"
    );
    cy.verifyTextMatches(
      performanceReqs.anticipatedHeading,
      "Anticipated users and data"
    );
  });

  it("TC4:Navigation from summary", () => {
    cy.clickAndWaitForElementExists(
      performanceReqs.anticipatedUsersBtn,
      performanceReqs.conusCentral0Checkbox
    );
    cy.findElement(performanceReqs.conusEast0Checkbox).should("be.checked");
    cy.findElement(performanceReqs.africom1Checkbox).should("be.checked");
  });
});
