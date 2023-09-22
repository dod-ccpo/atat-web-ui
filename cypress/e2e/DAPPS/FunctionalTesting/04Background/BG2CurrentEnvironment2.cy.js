import {
  randomAlphaNumeric,
  randomNumber,
  randomNumberBetween,
  randomString,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import background from "../../../../selectors/background.sel";
import bgCEData from "../../../../fixtures/bgCEData.json";

describe("Test suite: Background- Current Environment: Functional Testing", () => {
  const pt =
    "TC-Step-04-Background:Current Environment-Functional-" +
    randomAlphaNumeric(5);
  const scope = "Project Scope-" + randomString(5);

  // functional testing data:
  const docFile = "cypress/fixtures/files/testFileSysDiagram.docx";
  const pdfFile = "cypress/fixtures/files/dd1155.pdf";
  const xlsFile = "cypress/fixtures/files/testMigration.xlsx";

  // page#6
  const deployedRegions = [
    "conusEast",
    "conusCentral",
    "conusWest",
    "africom",
    "centcom",
    "eucom",
    "indopacom",
    "southcom",
  ];
  const storageOptions = [
    "Object", //Block, Object, File, Archive
  ];
  const performanceTierOption = [
    "computeOptimized", //generalPurpose, computeOptimized, memoryOptimized, storageOptimized
  ];

  //section#2 data
  const eventCause = "Event Cause " + randomString(2);
  const periodCause = "period Cause- " + randomString(2);
  const users = randomNumber(1);
  //section#3 data
  const licensing = "License" + randomAlphaNumeric(3);
  const noOfVCPU = randomNumber(2);
  const precessSpeed = randomNumber(4);
  const operatingSystem = "OS Test--" + randomString(3);
  const memoryByte = randomNumber(2);
  const storage = randomNumber(3);
  const instances = randomNumberBetween(1, 9);
  const egressMonth = randomNumber(2);
  const additionalInformation = "Additional Info is--" + randomString(5);

  const storageTypeOptionsMap = {
    Block: background.blockStorageOption,
    Object: background.objectTypeStorageOption,
    File: background.fileStorageOption,
    Archive: background.archiveStorageOption,
  };
  const performanceTierOptionsMap = {
    generalPurpose: background.generalPurposeRadiobox,
    computeOptimized: background.computeOptimRadiobox,
    memoryOptimized: background.memoryOptimizedRadiobox,
    storageOptimized: background.storageOptimRadiobox,
  };

  // Summary page:
  const deployedRegionCheckboxesList = deployedRegions
    .join(" ,")
    .toUpperCase()
    .replace(/\s/g, "");
  const expctedMemory = memoryByte + "GB";
  const storageOptionsList = storageOptions.join(" ,").toUpperCase();
  const storageExpected = storageOptionsList + ":" + storage + "GB";
  const performanceTierOptions = performanceTierOption.join(" ,").toUpperCase();

  beforeEach(() => {
    cy.goToAcqPackageStepOne(pt, scope);
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.activeStep(common.stepBackgroundText);
    cy.clickSideStepper(
      common.substepCurrentEnvironmentLink,
      " Current Environment "
    );
    cy.activeStep(common.substepCurrentEnvironmentText);
  });

  function page5CLoudandOnpremiseInstances() {
    //Cloud Instances
    cy.findElement(background.unClassCloudCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.scCloudCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.tsCloudCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.verifyCheckBoxLabels(
      background.CloudClassificationCheckboxes,
      bgCEData.CEPage5.expectedLabelsUnCL
    );
    cy.findElement(background.CloudClassificationCheckboxes)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");

    //Onpremise Instances
    cy.findElement(background.unClassPremCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.scPremCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.tsPremCheckbox)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.verifyCheckBoxLabels(
      background.onPremiseClassificationCheckboxes,
      bgCEData.CEPage5.expectedLabelsOnPrem
    );
    cy.findElement(background.onPremiseClassificationCheckboxes)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
  }

  function section3InstanceConfigurations() {
    cy.findElement(background.licenseTextbox).type(licensing);
    cy.findElement(background.numofVCPTextbox).type(noOfVCPU);
    cy.findElement(background.licenseTextboxLable).scrollIntoView();
    cy.findElement(background.processorSpeedTextbox).type(precessSpeed);
    cy.findElement(background.licenseTextboxLable).scrollIntoView();
    cy.findElement(background.operatingSysTextbox).type(operatingSystem);
    cy.findElement(background.memoryTextbox).type(memoryByte);
    cy.findElement(background.storageTypeDropdown).click();
    cy.waitUntil(function () {
      return cy.findElement(background.blockStorageOption).should("exist");
    });
    cy.findElement(storageTypeOptionsMap[storageOptions]).click({
      force: true,
    });
    cy.findElement(background.storageSizeLable).scrollIntoView();
    cy.textExists(
      background.storageSizeLable,
      bgCEData.CEPage6.storageSizeTextLable
    );
    cy.findElement(
      background.storageSizeField + background.byteSizeDropdown
    ).click();
    cy.waitUntil(function () {
      return cy
        .findElement(background.storageSizeField + background.gigabyteOption)
        .should("exist");
    });
    cy.findElement(
      background.storageSizeField + background.gigabyteOption
    ).click({
      force: true,
    });
    cy.findElement(background.storageAmountTextbox).type(storage);
    cy.findElement(performanceTierOptionsMap[performanceTierOption]).click({
      force: true,
    });
    cy.findElement(background.instancesTextbox).clear().type(instances);
    cy.findElement(background.dataegressTextbox).type(egressMonth);
  }

  function section2CurrentUsageandUsers() {
    cy.verifyRadioGroupLabels(
      background.currentUsageRadioGroup,
      bgCEData.CEPage6.section2Radioboxes
    );
    cy.radioBtn(background.regularUsageRadiobox, "EVEN_USAGE").click({
      force: true,
    });
    cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
      force: true,
    });
    cy.verifyCheckBoxLabels(
      background.spikesCheckboxes,
      bgCEData.CEPage6.spikesCheckboxes
    );
    cy.findElement(background.spikesCheckboxes)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.highUsageEventTextbox).type(eventCause);
    cy.findElement(background.highUsagePeriodTextbox).type(periodCause);
    cy.findElement(
      background.regionUsersCheckboxes + background.conusWestCheckbox
    )
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.conusWestTextbox).type(users);
  }

  function section7verifyTableData(impactLevelCheckboxesList) {
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Classification",
      impactLevelCheckboxesList
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Quantity",
      instances
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "vCPU",
      noOfVCPU
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Memory",
      expctedMemory
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Storage",
      storageExpected
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Performance",
      performanceTierOptions
    );
  }

  it("TC1: Current Environment: Functional Testcase- Hybrid-Cloud Environment", () => {
    //Page#1: Do you have a current environment to rehost? Yes No
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage1.pageText1
    );
    cy.radioBtn(background.existYesRadioOption, "YES")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });

    // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.verifyRadioGroupLabels(
      background.existingEnvNoRadioGroup,
      bgCEData.CEPage2.section1Radioboxes
    );
    cy.radioBtn(background.systemDocsYesRadioBtn, "YES").click({
      force: true,
    });
    cy.findElement(background.uploadFileSysDiagram).selectFile(pdfFile, {
      force: true,
    });
    cy.waitUntil(function () {
      return cy.findElement(background.removeFile1).should("exist");
    });

    // Page#3:  Have you completed a migration assessment, analysis, ------- needed?
    cy.clickContinueButton(
      background.systemDocsYesRadioBtn,
      bgCEData.CEPage3.pageHeader3
    );
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage3.pageText3
    );
    cy.radioBtn(background.existNoRadioOption, "NO").click({
      force: true,
    });
    cy.radioBtn(background.existYesRadioOption, "YES")
      .not("not.checked")
      .click({
        force: true,
      });
    cy.findElement(background.uploadFileSysDiagram).selectFile(docFile, {
      force: true,
    });
    cy.findElement(background.uploadFileSysDiagram).selectFile(xlsFile, {
      force: true,
    });
    cy.waitUntil(function () {
      return cy.findElement(background.removeFile1).should("exist");
    });

    // Page#4 :  Where is your current environment located?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage4.pageHeader4
    );
    cy.radioBtn(background.hybridRadio, "HYBRID")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });

    // Page#5 :Tell us about your current data classification and impact levels
    cy.clickContinueButton(
      background.cloudComputingRadio,
      bgCEData.CEPage5.pageHeader5
    );
    page5CLoudandOnpremiseInstances();

    // Page#6 : Let’s start gathering details about each instance in your environment
    cy.clickContinueButton(
      background.tsPremCheckbox,
      bgCEData.CEPage6.pageHeader6
    );
    //section#1:  1. Tell us about Instance #1
    cy.verifyTextMatches(
      background.section1Question3,
      bgCEData.CEPage6.section1Question1Hybrid
    );
    cy.verifyRadioGroupLabels(
      background.instanceRadioGroup,
      bgCEData.CEPage6.section1RadioboxesHybrid
    );
    cy.radioBtn(background.cloudRadiobox, "CLOUD")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });
    cy.get(background.regionDeployedAllCheckboxes)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.verifyRadioGroupLabels(
      background.classificationRadioGroup,
      bgCEData.CEPage6.section1Radioboxes
    );
    cy.findElement(background.IL4Radiobox).click({
      force: true,
    });

    //Section#2: Current usage and users
    cy.findElement(background.section2Question1).scrollIntoView();
    cy.textExists(
      background.section2Question1,
      bgCEData.CEPage6.section2Question1
    );
    section2CurrentUsageandUsers();

    //Section# 3. Instance configurations
    section3InstanceConfigurations();

    //section#4: Pricing Details
    cy.textExists(background.section4Message, bgCEData.CEPage6.section4Legend);
    cy.findElement(background.section4Message).scrollIntoView();
    cy.verifyRadioGroupLabels(
      background.currentPaymentRadioGroup,
      bgCEData.CEPage6.section4Radioboxes
    );
    cy.radioBtn(background.payAsYouGoRadiobox, "PAY_AS_YOU_GO").click({
      force: true,
    });

    //section#5: Additional Information
    cy.textExists(
      background.section5Question,
      bgCEData.CEPage6.section5Question
    );
    cy.findElement(background.additionalInfoTextbox)
      .click()
      .type(additionalInformation);

    // Page#7 : Current Environment Summary
    cy.clickContinueButton(
      background.additionalInfoTextbox,
      bgCEData.CEPage7.pageHeader7
    );
    cy.textExists(background.introPText, bgCEData.CEPage7.pageText7);
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Location",
      "CLOUD" + deployedRegionCheckboxesList
    );
    section7verifyTableData("UNCLASSIFIEDIL4");

    // Page#7 : Background Summary

    cy.clickContinueButton(
      background.currentEnvHistoryTable,
      bgCEData.BackgroundSummary.pageHeader8
    );
    cy.textExists(
      background.currentEnvironmentHeaderText,
      bgCEData.BackgroundSummary.currentEnvironmentTitle
    );
    cy.textExists(
      background.currentEnvironmentDescription,
      "Hybrid environment:"
    );
    cy.findElement(background.currentEnvironmentDescription).contains(
      "1 cloud instance (Unclassified/IL4)"
    );
    cy.textExists(
      background.currentEnvironmentCompleteBtn,
      bgCEData.BackgroundSummary.currentEnvironmentViewButton
    );
  });

  it("TC2: Current Environment: Functional Testcase- Hybrid-OnPremise Environment", () => {
    //Page#1: Do you have a current environment to rehost? Yes No
    cy.verifyRadioGroupLabels(
      background.existingEnvNoRadioGroup,
      bgCEData.CEPage1.section1Radioboxes
    );
    cy.radioBtn(background.existYesRadioOption, "YES")
      .not("not.checked")
      .click({
        force: true,
      });

    // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage2.pageText2
    );
    cy.radioBtn(background.systemDocsNoRadioBtn, "NO").click({
      force: true,
    });
    cy.radioBtn(background.systemDocsYesRadioBtn, "YES").click({
      force: true,
    });
    cy.findElement(background.uploadFileSysDiagram).selectFile(docFile, {
      force: true,
    });
    cy.waitUntil(function () {
      return cy.findElement(background.removeFile1).should("exist");
    });

    // Page#3:  Have you completed a migration assessment, analysis, ... needed?
    cy.clickContinueButton(
      background.systemDocsYesRadioBtn,
      bgCEData.CEPage3.pageHeader3
    );
    cy.verifyRadioGroupLabels(
      background.existingEnvNoRadioGroup,
      bgCEData.CEPage2.section1Radioboxes
    );
    cy.radioBtn(background.existYesRadioOption, "YES")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });
    cy.findElement(background.uploadFileSysDiagram).selectFile(pdfFile, {
      force: true,
    });
    cy.waitUntil(function () {
      return cy.findElement(background.removeFile1).should("exist");
    });

    // Page#4 : Where is your current environment located?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage4.pageHeader4
    );
    cy.radioBtn(background.hybridRadio, "HYBRID")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });

    // Page#5 :Tell us about your current data classification and impact levels
    cy.clickContinueButton(
      background.cloudComputingRadio,
      bgCEData.CEPage5.pageHeader5
    );
    page5CLoudandOnpremiseInstances();

    // Page#6 : Let’s start gathering details about each instance in your environment
    cy.clickContinueButton(
      background.cloudComputingRadio,
      bgCEData.CEPage6.pageHeader6
    );

    //section#1:  1. Tell us about Instance #1
    cy.verifyTextMatches(
      background.section1Question3,
      bgCEData.CEPage6.section1Question1Hybrid
    );
    cy.verifyRadioGroupLabels(
      background.instanceRadioGroup,
      bgCEData.CEPage6.section1RadioboxesHybrid
    );
    cy.radioBtn(background.onPremRadiobox, "ON_PREM")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });
    cy.textExists(
      background.section1Question2OnPrem,
      bgCEData.CEPage6.section1Question1OnPrem
    );
    cy.verifyRadioGroupLabels(
      background.classificationRadioGroup,
      bgCEData.CEPage6.section1RadioboxesOnPrem
    );
    cy.findElement(background.IL6Radiobox).click({
      force: true,
    });
    //Section#2: Current usage and users
    cy.findElement(background.section2Question1).scrollIntoView();
    cy.textExists(
      background.section2Question1,
      bgCEData.CEPage6.section2Question1
    );
    section2CurrentUsageandUsers();

    //Section# 3. Instance configurations
    section3InstanceConfigurations();

    //section#4: Additional Information
    cy.findElement(background.additionalInfoTextbox)
      .click()
      .type(additionalInformation);

    // Page#7 : Current Environment Summary
    cy.clickContinueButton(
      background.additionalInfoTextbox,
      bgCEData.CEPage7.pageHeader7
    );
    cy.textExists(background.page7Title, bgCEData.CEPage7.pageHeader7);
    cy.textExists(background.introPText, bgCEData.CEPage7.pageText7);
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Location",
      "ON-PREMISEMISSINGINFO"
    );
    section7verifyTableData("SECRETIL6");

    // Page#7 : Background Summary
    cy.clickContinueButton(
      background.currentEnvHistoryTable,
      bgCEData.BackgroundSummary.pageHeader8
    );
    cy.textExists(
      background.currentEnvironmentHeaderText,
      bgCEData.BackgroundSummary.currentEnvironmentTitle
    );
    cy.textExists(
      background.currentEnvironmentDescription,
      "Hybrid environment:"
    );
    cy.findElement(background.currentEnvironmentDescription).contains(
      "1 on-premise instance (Secret/IL6)"
    );
    cy.textExists(
      background.currentEnvironmentReviewBtn,
      bgCEData.BackgroundSummary.currentEnvironmentReviewButton
    );
  });
});
