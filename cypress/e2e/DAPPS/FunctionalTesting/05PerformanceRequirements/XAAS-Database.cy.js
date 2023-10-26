import {
  randomAlphaNumeric,
  randomString,
  randomNumberBetween,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";
import serviceOfferingGroups from "../../../../fixtures/serviceOfferingGroups.json";

describe("Test suite: Database Requirement Categories with Instances", () => {
  const pt =
    "TC-Step-5-PR-Database Requirement Categories-" + randomAlphaNumeric(5);
  const scope = "Database Requirement Categories" + randomString(5);
  const selectedClassifications = [
    "level2",
    "level4",
    "level5",
    "level6",
    "tops",
  ];
  const classificationInstance = [
    //"impactLevel2",
    "impactLevel4",
    // "impactLevel5",
    // "impactLevel6",
    // "tops",
  ];
  const noOfVCPUs = randomNumberBetween(2, 8);
  const precessorSpeed = randomNumberBetween(3, 9);
  const operatingSystemText = "OperatingSystemTest--" + randomString(4);
  const memory = randomNumberBetween(1, 6);
  const networkPerformance = randomNumberBetween(4, 8);
  const updatednetworkPerformance = randomNumberBetween(4, 7);
  const storageSize = randomNumberBetween(1, 8);
  const noOfInstances = randomNumberBetween(4, 9);
  const updatednoOfInstances = randomNumberBetween(2, 8);
  const requiredStorage = [
    "BlockStorage",
    //"ObjectStorage",
    // "FileStorage",
    // "ArchiveStorage",
  ];

  before(() => {
    cy.requiredContractDetailsforPR(pt, scope);
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
  });

  it("TC1: Verify Database Offering", () => {
    cy.findElement(performanceReqs.startXaaSBtn).click();
    cy.findElement(performanceReqs.databaseCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.anticipatedUsersPage();

    cy.clickContinueButton(
      performanceReqs.pageTextanticipatedUsers,
      serviceOfferingGroups.DatabasePage.pageHeader1
    );
    cy.verifyTextMatches(
      performanceReqs.pageMainText,
      serviceOfferingGroups.DatabasePage.sectionTitle
    );

    cy.log(" Section: 1. Database details");
    cy.log("What classification level is this instance deployed in? ");
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.DatabasePage.instance1Header
    );
    cy.selectDeployedClassificationLevel(classificationInstance);

    cy.log(" What type of database do you need? ");
    cy.verifyTextMatches(
      performanceReqs.databaseTypeQuestion,
      serviceOfferingGroups.DatabasePage.instance1Question2
    );
  
    cy.verifyRadioGroupLabels(
      performanceReqs.databaseTypeRadioGroup,
      serviceOfferingGroups.DatabasePage.databaseTypeRadioGroup
    );
    cy.findElement(performanceReqs.transactionRadioBtn).click({
      force: true,
    });

    cy.log(" Operating system licensing");
    cy.verifyTextMatches(
      performanceReqs.operatingLicenseQuestion,
      serviceOfferingGroups.ComputePage.instance1Licensing
    );
    cy.OSandDBLicensing("operatingSystem", "transfer");

    cy.log(" Database licensing");
    cy.verifyTextMatches(
      performanceReqs.databaseLicensingRadioGroup,
      serviceOfferingGroups.DatabasePage.databaseLicensing
    );
    cy.OSandDBLicensing("database", "newLicense");

    cy.log(" Section: 2. Database Configurations ");
    cy.instanceDatabaseConfigurationsScreenCheck("Database");
    cy.instanceDatabaseConfigurationsFieldsData(
      noOfVCPUs,
      precessorSpeed,
      operatingSystemText,
      memory,
      requiredStorage,
      storageSize,
      noOfInstances
    );

    cy.log("Network Performance");
    cy.findElement(performanceReqs.storageAmountLabel).scrollIntoView();
    cy.textExists(
      performanceReqs.networkPerformanceLabel,
      serviceOfferingGroups.DatabasePage.networkPerformanceTextboxLable
    );
    cy.hoverToolTip(
      performanceReqs.networkPerformanceTooltipBtn,
      performanceReqs.networkPerformanceTooltipText,
      serviceOfferingGroups.DatabasePage.networkPerformanceToolTipLabel
    );
    cy.findElement(performanceReqs.networkPerformanceTxtBox).type(
      networkPerformance
    );

    cy.log(" Section:3. Anticipated need and duration");
    cy.verifyTextMatches(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.ComputePage.anticptdDurationTitle
    );
    cy.anticipatedNeedAndDurationTitleandData(
      "Database",
      "DatabaseUsage",
      "instance",
      "Yes"
    );

    cy.requirementsSummaryPage("Database", "instances");
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Quantity",
      noOfInstances
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Performance",
      networkPerformance
    );
  });

  it("TC2: Edit any Database Instance to update", () => {
    cy.findElement(performanceReqs.instanceOneEditBtn).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.DatabasePage.instance1Header
    );
    cy.findElement(performanceReqs.graphRadioBtn).click({
      force: true,
    });
    cy.findElement(performanceReqs.noInstancesTextbox)
      .clear()
      .type(updatednoOfInstances);
    cy.findElement(performanceReqs.storageAmountTextBox)
      .clear()
      .type(storageSize);
    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.findElement(performanceReqs.optionBlockStorage).click({
      force: true,
    });
    cy.findElement(performanceReqs.networkPerformanceTxtBox)
      .clear()
      .type(updatednetworkPerformance);

    cy.requirementsSummaryPage("Database", "instances");

    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Quantity",
      updatednoOfInstances
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Performance",
      updatednetworkPerformance
    );
  });

  it("TC3: Delete any Database Instance", () => {
    cy.deleteInstanceOrRequirement("Instance", "Database");
  });

  it("TC4: Add another Database Instance", () => {
    cy.findElement(performanceReqs.addAnotherInstance).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.DatabasePage.instance1Header
    );
    cy.selectDeployedClassificationLevel(classificationInstance);
    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.findElement(performanceReqs.optionArchiveStorage).click({
      force: true,
    });
    cy.findElement(performanceReqs.transactionRadioBtn).click({
      force: true,
    });
    cy.OSandDBLicensing("operatingSystem", "newLicense");

    cy.OSandDBLicensing("database", "transfer");

    cy.instanceDatabaseConfigurationsFieldsData(
      noOfVCPUs,
      precessorSpeed,
      operatingSystemText,
      memory,
      requiredStorage,
      storageSize,
      noOfInstances
    );
    cy.findElement(performanceReqs.storageAmountLabel).scrollIntoView();
    cy.findElement(performanceReqs.networkPerformanceTxtBox).type(
      networkPerformance
    );
    cy.anticipatedNeedAndDurationTitleandData(
      "Database",
      "NewDatabaseInstance",
      "instance",
      "No"
    );
    cy.requirementsSummaryPage("Database", "instances");
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Quantity",
      noOfInstances
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "vCPU",
      noOfVCPUs
    );
  });

  it("TC5: Verify Error Message Validations", () => {
    cy.errorMessageValidations("Database");
    cy.checkErrorMessage(
      performanceReqs.databaseTypeErrMsg,
      serviceOfferingGroups.DatabasePage.databaseErrMsg
    );
    cy.checkErrorMessage(
      performanceReqs.dbLicenseErrMsg,
      serviceOfferingGroups.DatabasePage.dbLicenseErrMsg
    );
    cy.log(" 2. Instance Configurations Error Messages");
    cy.errorMessageValidationsCPDB();
    cy.checkErrorMessage(
      performanceReqs.networkPerformanceError,
      serviceOfferingGroups.DatabasePage.networkPerformanceErrMsg
    );
    cy.clickContinueButton(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.DatabasePage.databaseSummaryPageTitle
    );
  });

  it("TC6: I dont need Compute/Delete all Compute Instance", () => {
    cy.deleteALLInstanceOrRequirement("Database", "instances");
  });
});
