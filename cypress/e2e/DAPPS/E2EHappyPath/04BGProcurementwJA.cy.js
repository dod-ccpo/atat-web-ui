import {
  colors,
  randomNumber,
  randomString,
  formatDateInMMDDYYYY,
} from "../../../helpers";
import background from "../../../selectors/background.sel";
import common from "../../../selectors/common.sel";
import {contractNo,jaSet1,jaSet2,jaSet3} from '../../../sharedData/sharedData.js'
import "./02ExceptionToFairOpportunity.cy.js";


const dataSets = [jaSet1, jaSet2, jaSet3]

describe("Test suite:Step04-Procurement History with J&A",  { testIsolation: false },() => {
  const dataSetIndex = Cypress.env("jaDataSetIndex");
  const dataSet = dataSets[dataSetIndex];

  //const dataSet = dataSets[1]
  const {exceptionToFairOpp, previousContract,businessSizeOption,competitiveStatusOptions} = dataSet
  
  //Contract Overview
  const taskOrderNo = randomNumber(13);
 
  //Period of Performance(POP)
  const dayOfMonth = "11";

  //Contractor Details
  const cName = "testContractName-" + randomString(3);  

  //procurement History Summary
  const date = new Date();
  const startDayFormatted = formatDateInMMDDYYYY(date, 11, "previous");
  const expiredDateFormatted = formatDateInMMDDYYYY(date, 11, "next");
  const expectedPOP = startDayFormatted + " - " + expiredDateFormatted;
  const expectedProcurementHistoryData = [
    [cName, contractNo, taskOrderNo, expectedPOP],
  ];

  console.log(
    "Expected Procurement History Data:",
    expectedProcurementHistoryData
  );

  before(() => {
    cy.findElement(common.stepBackgroundText)
      .should("be.visible")
      .and("contain", " Background ")
      .click()
      .then(() => {
        cy.waitUntil(function () {
          return cy
            .findElement(common.stepBackgroundText)
            .should("have.css", "color", colors.primary);
        });
      });
  });
  function contractOverview(contractNo, taskOrderNo) {
    cy.enterTextInTextField(background.contractNoTxtBox, contractNo);
    cy.enterTextInTextField(background.taskOrderNumberTxtBox, taskOrderNo);
    const competitiveStatusMap = {
      fullOpen: background.fullRadioOption,
      sbSetAside: background.sbSetAsideRadioOption,
      otherThanFull: background.otherThanRadioOption,
    };
    cy.findElement(competitiveStatusMap[competitiveStatusOptions]).click({
      force: true,
    });
  }

  function popStartEndDate(dayOfMonth) {
    cy.selectDatefromDatePicker(
      background.startDatePickerBtnIcon,
      background.startDatePreviousMonth,
      background.selectDate,
      dayOfMonth,
      background.startDatepicker
    );
    cy.waitUntil(function () {
      return cy
        .findElement(background.startDateTextField)
        .should("have.value", startDayFormatted);
    });
    cy.selectDatefromDatePicker(
      background.expirationDatePickerIcon,
      background.navigateNextMonth,
      background.expirationSelectDate,
      dayOfMonth,
      background.expirationDatePicker
    );
    cy.waitUntil(function () {
      return cy
        .findElement(background.expirationDatePickerInputbox)
        .should("have.value", expiredDateFormatted);
    });
  }

  function contractorDetails(cName) {
    cy.enterTextInTextField(background.incumbentTxtBox, cName);
    const businessSizeOptionMap = {
      large: background.largeRadioOption,
      small: background.smallRadioOption,
      smallBA: background.smallBARadioOption,
      hubZone: background.hubRadioOption,
      sdvosb: background.sdvobRadioOption,
      wosb: background.wosbRadioOption,
    };
    cy.findElement(businessSizeOptionMap[businessSizeOption]).click({
      force: true,
    });
  }

  function gatherContractDetails(
    contractNo,
    taskOrderNo,
    dayOfMonth,
    cName,
    expectedProcurementHistoryData
  ) {
    contractOverview(contractNo, taskOrderNo);
    popStartEndDate(dayOfMonth);
    contractorDetails(cName);
    cy.clickContinueButton(
      background.incumbentTxtBox,
      "Your Procurement History"
    );
    cy.verifyTableValues(
      background.procurementHistoryTable,
      expectedProcurementHistoryData,
      4
    );
    cy.clickContinueButton(
      background.procurementHistoryTable,
      "Do you have a current environment to rehost?"
    );
  }
  it("TC:1 Procurement History", () => {
    if (exceptionToFairOpp === "YES_FAR_16_505_B_2_I_C") {
      //timingissue,so added a wait here
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
      cy.clickAndWaitForVisible(
        common.substepProcurementText,
        background.addInstanceNoDataBtn
      );
      cy.verifyPageHeader("Your Procurement History");
      cy.clickAndWaitForVisible(
        background.addInstanceNoDataBtn,
        background.contractOverviewTitle
      );
      cy.verifyPageHeader(
        "Let’s gather some details about your previous or current contract"
      );
      gatherContractDetails(
        contractNo,
        taskOrderNo,
        dayOfMonth,
        cName,
        expectedProcurementHistoryData
      );
    } else if (
      exceptionToFairOpp === "YES_FAR_16_505_B_2_I_A" ||
      exceptionToFairOpp === "YES_FAR_16_505_B_2_I_B"
    ) {
      cy.verifyPageHeader(
        "Do you have a current or previous contract for this effort?"
      );
      if (previousContract === "Yes") {
        cy.findElement(background.ccYesRadioOption).click({ force: true });
        cy.clickContinueButton(
          background.ccYesRadioOption,
          "Let’s gather some details about your previous or current contract"
        );
        gatherContractDetails(
          contractNo,
          taskOrderNo,
          dayOfMonth,
          cName,
          expectedProcurementHistoryData
        );
      } else {
        cy.findElement(background.ccNoRadioOption).click({ force: true });
        cy.clickContinueButton(
          background.ccYesRadioOption,
          "Do you have a current environment to rehost?"
        );
      }
    }
  });
});
