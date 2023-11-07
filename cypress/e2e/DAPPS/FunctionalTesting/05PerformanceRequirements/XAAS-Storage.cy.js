import {
  randomAlphaNumeric,
  randomString,
  randomNumberBetween,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";
import serviceOfferingGroups from "../../../../fixtures/serviceOfferingGroups.json";

describe("Test suite: Storage Requirement Categories with Instances", () => {
  const pt =
    "TC-Step-5-PR-Storage Requirement Categories-" + randomAlphaNumeric(5);
  const scope = "Storage Requirement Categories" + randomString(5);
  const selectedClassifications = [
    "level2",
    "level4",
    "level5",
    "level6",
    "tops",
  ];
  const classificationInstance = [
    //"impactLevel2",
    // "impactLevel4",
    // "impactLevel5",
    "impactLevel6",
    // "tops",
  ];
  const storageSize = randomNumberBetween(2, 8);
  const updatedStorageSize = randomNumberBetween(2, 5);
  const noOfInstances = randomNumberBetween(3, 9);

  before(() => {
    cy.requiredContractDetailsforPR(pt, scope);
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
  });

  it("TC1: Verify Storage Offering", () => {
    cy.findElement(performanceReqs.startXaaSBtn).click();
    cy.findElement(performanceReqs.storageCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.anticipatedUsersPage();

    cy.clickContinueButton(
      performanceReqs.pageTextanticipatedUsers,
      serviceOfferingGroups.StoragePage.pageHeader1
    );

    cy.verifyTextMatches(
      performanceReqs.pageMainText,
      serviceOfferingGroups.StoragePage.sectionTitle
    );

    cy.log(" Section: 1. Storage Configurations");
    cy.log("What classification level is this instance deployed in? ");
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.StoragePage.instance1Header
    );
    cy.selectDeployedClassificationLevel(classificationInstance);

    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.findElement(performanceReqs.optionBlockStorage).click({
      force: true,
    });
    cy.findElement(performanceReqs.storageAmountTextBox).type(storageSize);
    cy.findElement(performanceReqs.noInstancesTextbox).type(noOfInstances);

    cy.log(" Section:  2. Anticipated need and duration");
    cy.verifyTextMatches(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.StoragePage.anticptdDurationTitle
    );
    cy.anticipatedNeedAndDurationTitleandData(
      "Storage",
      "StorageText",
      "instance",
      "Yes"
    );

    cy.requirementsSummaryPage("Storage", "instances");

    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Classification",
      "SECRETIL6"
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Storage Size",
      storageSize + "GB"
    );
  });

  it("TC2: Edit any Storage  Instance to update", () => {
    cy.findElement(performanceReqs.instanceOneEditBtn).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.StoragePage.instance1Header
    );
    cy.selectDeployedClassificationLevel(classificationInstance);
    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.findElement(performanceReqs.optionArchiveStorage).click({
      force: true,
    });
    cy.findElement(performanceReqs.storageAmountTextBox)
      .clear()
      .type(updatedStorageSize);

    cy.findElement(performanceReqs.noInstancesTextbox)
      .clear()
      .type(noOfInstances);
    cy.anticipatedNeedAndDurationTitleandData(
      "Storage",
      "StorageTextUpdated",
      "instance",
      "No"
    );
    cy.requirementsSummaryPage("Storage", "instances");
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Classification",
      "SECRETIL6"
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Storage Size",
      updatedStorageSize + "GB"
    );
  });

  it("TC3: Delete any Storage  Instance", () => {
    cy.deleteInstanceOrRequirement("Instance", "Storage");
  });

  it("TC4: Add another Storage  Instance", () => {
    cy.findElement(performanceReqs.addAnotherInstance).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.StoragePage.instance1Header
    );
    cy.selectDeployedClassificationLevel(classificationInstance);
    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.findElement(performanceReqs.optionArchiveStorage).click({
      force: true,
    });
    cy.findElement(performanceReqs.storageAmountTextBox)
      .clear()
      .type(storageSize);

    cy.findElement(performanceReqs.noInstancesTextbox)
      .clear()
      .type(noOfInstances);
    cy.anticipatedNeedAndDurationTitleandData(
      "Storage",
      "NewStorageInstance",
      "instance",
      "No"
    );
    cy.requirementsSummaryPage("Storage", "instances");
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Classification",
      "SECRETIL6"
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Storage Size",
      storageSize + "GB"
    );
  });

  it("TC5: Verify Error Message Validations", () => {
    cy.errorMessageValidations("Storage");

    cy.checkErrorMessage(
      performanceReqs.storageTypeError,
      serviceOfferingGroups.ComputePage.storageTypeErrMsg
    );
    cy.checkErrorMessage(
      performanceReqs.storageAmountError,
      serviceOfferingGroups.ComputePage.greaterZeroErrMsg
    );
    cy.clickContinueButton(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.StoragePage.storageSummaryHeader
    );
  });

  it("TC6: I dont need Compute/Delete all Storage Instance", () => {
    cy.deleteALLInstanceOrRequirement("Storage", "instances");
  });
});
