import {
  randomAlphaNumeric,
  randomString,
  randomNumberBetween,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";
import serviceOfferingGroups from "../../../../fixtures/serviceOfferingGroups.json";

describe("Test suite: Compute Requirement Categories with Instances", () => {
  const pt =
    "TC-Step-5-PR-Compute Requirement Categories-" + randomAlphaNumeric(5);
  const scope = "Compute Requirement Categories" + randomString(5);
  const selectedClassifications = [
    "level2",
    "level4",
    "level5",
    "level6",
    "tops",
  ];
  const classificationInstance = [
    "impactLevel2",
    // "impactLevel4",
    // "impactLevel5",
    // "impactLevel6",
    // "tops",
  ];
  const noOfVCPUs = randomNumberBetween(2, 9);
  const updatedNoOfVCPUs = randomNumberBetween(2, 6);
  const precessorSpeed = randomNumberBetween(1, 6);
  const operatingSystemText = "OperatingSystem-" + randomString(4);
  const memory = randomNumberBetween(2, 6);
  const updatedMemory = randomNumberBetween(1, 6);
  const storageSize = randomNumberBetween(1, 4);
  const noOfInstances = randomNumberBetween(3, 9);
  const requiredStorage = [
    //"BlockStorage",
    "ObjectStorage",
    // "FileStorage",
    // "ArchiveStorage",
  ];

  before(() => {
    cy.requiredContractDetailsforPR(pt, scope);
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
  });

  it("TC1: Verify Compute Offering", () => {
    cy.findElement(performanceReqs.startXaaSBtn).click();
    cy.findElement(performanceReqs.computeCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.anticipatedUsersPage();

    cy.clickContinueButton(
      performanceReqs.pageTextanticipatedUsers,
      serviceOfferingGroups.ComputePage.pageHeader1
    );
    cy.verifyTextMatches(
      performanceReqs.pageMainText,
      serviceOfferingGroups.ComputePage.sectionTitle
    );

    cy.log(" Section: 1. Instance details");
    cy.log("What classification level is this instance deployed in? ");
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.ComputePage.instance1Header
    );
    cy.selectDeployedClassificationLevel(classificationInstance);

    cy.log(" What type of environment is this instance? ");
    cy.verifyTextMatches(
      performanceReqs.enviTypeQuestion,
      serviceOfferingGroups.ComputePage.instance1Question2
    );
    // cy.verifyRadioGroupLabels(
    //   performanceReqs.enviTypeRadioGroup,
    //   serviceOfferingGroups.ComputePage.environmentTypeRadioGroup
    // );
    cy.findElement(performanceReqs.envDevTesting).click({
      force: true,
    });

    cy.log(" What type of operating environment do you need? ");
    cy.verifyTextMatches(
      performanceReqs.operatingEnvQuestion,
      serviceOfferingGroups.ComputePage.instance1Question3
    );
    //why RadioGroupLabels is not working?
    // cy.verifyRadioGroupLabels(
    //   performanceReqs.databaseTypeRadioGroup,
    //   serviceOfferingGroups.ComputePage.databaseTypeRadioGroup
    // );
    cy.findElement(performanceReqs.virtualMachineRadio).click({
      force: true,
    });

    cy.log(" Operating system licensing ");
    cy.OSandDBLicensing("operatingSystem", "newLicense");

    cy.log(" Section: 2. Instance Configurations ");
    cy.instanceDatabaseConfigurationsScreenCheck("Instance");
    cy.instanceDatabaseConfigurationsFieldsData(
      noOfVCPUs,
      precessorSpeed,
      operatingSystemText,
      memory,
      requiredStorage,
      storageSize,
      noOfInstances
    );

    cy.log("Performance tier:");
    cy.findElement(performanceReqs.storageAmountLabel).scrollIntoView();
    cy.textExists(
      performanceReqs.performanceTierLabel,
      serviceOfferingGroups.ComputePage.performanceTierLable
    );
    // cy.verifyRadioGroupLabels(
    //   performanceReqs.performanceRadioGroup,
    //   serviceOfferingGroups.ComputePage.performanceRadioboxes
    // );
    cy.radioBtn(performanceReqs.generalPurposeRadio, "GENERAL").click({
      force: true,
    });

    cy.log(" Section:  3. Anticipated need and duration");
    cy.verifyTextMatches(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.ComputePage.anticptdDurationTitle
    );
    cy.anticipatedNeedAndDurationTitleandData(
      "Compute",
      "ComputeText",
      "instance",
      "Yes"
    );

    cy.requirementsSummaryPage("Compute", "instances");
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
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Memory",
      (memory + "GB")
    );
  });

  it("TC2: Edit any Compute Instance to update", () => {
    cy.findElement(performanceReqs.instanceOneEditBtn).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.ComputePage.instance1Header
    );
    cy.findElement(performanceReqs.envPrepodStage).click({
      force: true,
    });
    cy.findElement(performanceReqs.noOfvCPUTxtBox)
      .clear()
      .type(updatedNoOfVCPUs);
    cy.findElement(performanceReqs.memoryTextBox).clear().type(updatedMemory);

    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.findElement(performanceReqs.optionBlockStorage).click({
      force: true,
    });
    cy.radioBtn(performanceReqs.computeOptimizedRadio, "COMPUTE").click({
      force: true,
    });

    cy.clickContinueButton(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.ComputePage.computeRequirementsSummaryPageTitle
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "vCPU",
      updatedNoOfVCPUs
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Memory",
      (updatedMemory + "GB")
    );
  });

  it("TC3: Delete any Compute Instance", () => {
    cy.deleteInstanceOrRequirement("Instance", "Compute");
  });

  it("TC4: Add another Compute Instance", () => {
    cy.findElement(performanceReqs.addAnotherInstance).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.formSectionOneHeader,
      serviceOfferingGroups.ComputePage.instance1Header
    );
    cy.selectDeployedClassificationLevel(classificationInstance);
    cy.findElement(performanceReqs.envDevTesting).click({
      force: true,
    });
    cy.findElement(performanceReqs.containersRadio).click({
      force: true,
    });
    cy.findElement(performanceReqs.newLicenseRadio).click({
      force: true,
    });
    cy.instanceDatabaseConfigurationsFieldsData(
      noOfVCPUs,
      precessorSpeed,
      operatingSystemText,
      memory,
      requiredStorage,
      storageSize,
      noOfInstances
    );
    cy.radioBtn(performanceReqs.generalPurposeRadio, "GENERAL").click({
      force: true,
    });
    cy.anticipatedNeedAndDurationTitleandData(
      "Compute",
      "ComputeNewInstance",
      "instance",
      "Yes"
    );

    cy.clickContinueButton(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.ComputePage.computeRequirementsSummaryPageTitle
    );
    cy.verifyTextMatches(
      performanceReqs.computeSummaryText,
      serviceOfferingGroups.ComputePage.computeRequirementsSummaryText
    );
  });

  it("TC5: Verify Error Message Validations", () => {
    cy.errorMessageValidations("Compute");

    cy.checkErrorMessage(
      performanceReqs.envTypeErrorMsg,
      serviceOfferingGroups.ComputePage.envTypeErrMsg
    );
    cy.checkErrorMessage(
      performanceReqs.operatingEnvTypeErrorMsg,
      serviceOfferingGroups.ComputePage.operTypeErrMsg
    );
    cy.log(" 2. Instance Configurations Error Messages");
    cy.errorMessageValidationsCPDB();
    cy.checkErrorMessage(
      performanceReqs.performanceTierError,
      serviceOfferingGroups.ComputePage.performanceTierErrMsg
    );
    cy.clickContinueButton(
      performanceReqs.anticipatedDurationTitle,
      serviceOfferingGroups.ComputePage.computeRequirementsSummaryPageTitle
    );
  });

  it("TC6: I dont need Compute/Delete all Compute Instance", () => {
    cy.deleteALLInstanceOrRequirement("Compute", "instances");
  });
});
