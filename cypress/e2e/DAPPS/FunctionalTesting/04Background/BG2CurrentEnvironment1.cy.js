import {
  randomAlphaNumeric,
  randomNumber,
  randomNumberBetween,
  randomString,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import background from "../../../../selectors/background.sel";
import bgCEData from "../../../../fixtures/bgCEData.json";

describe("Test suite: Background- Current Environment: Functional Testing1", () => {
  const pt =
    "TC-Step-04-Background:Current Environment-Functional-" +
    randomAlphaNumeric(5);
  const scope = "Project Scope-" + randomString(5);

  // functional testing data:
  const docFile = "cypress/fixtures/files/testFileSysDiagram.docx";
  const pdfFile = "cypress/fixtures/files/dd1155.pdf";
  const xlsFile = "cypress/fixtures/files/testMigration.xlsx";
  const txtFile = "cypress/fixtures/files/textfile.txt";

  // page#6
  const deployedRegionCheckboxes = [
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

  //section#2 data
  const eventCauseText = "Event Test " + randomString(2);
  const periodCauseText = "period Cause test " + randomString(4);
  const noOfUsers = randomNumber(1);
  //section#3 data
  const licensingText = "LicensingTest--" + randomAlphaNumeric(4);
  const noOfVCPUs = randomNumberBetween(2, 9);
  const precessorSpeed = randomNumber(3);
  const operatingSystemText = "OperatingSystemTest--" + randomString(4);
  const memory = randomNumber(3);
  const storageSize = randomNumber(2);
  const noOfInstances = randomNumberBetween(3, 9);
  const egressMonth = randomNumberBetween(2, 9);
  //section#4 data
  const expirationDate = randomNumberBetween(1, 28);
  //section#5 data
  const additionalInformationText = "Additional Info:" + randomString(4);
  const storageTypeOptionsMap = {
    Block: background.blockStorageOption,
    Object: background.objectTypeStorageOption,
    File: background.fileStorageOption,
    Archive: background.archiveStorageOption,
  };
  // Summary page:
  const deployedRegionCheckboxesList = deployedRegionCheckboxes
    .join(" ,")
    .toUpperCase()
    .replace(/\s/g, "");
  const expctedMemory = memory + "GB";
  const storageOptionsList = storageOptions.join(" ,").toUpperCase();
  const expctedStorage = storageOptionsList + ":" + storageSize + "GB";

  beforeEach(() => {
    cy.clickOnCurrentEnvironmentStep(pt, scope);
  });  

  it("TC1: Current Environment: Functional Testcase- Screen Validation Pages1-5", () => {
    //Page#1: Do you have a current environment to rehost? Yes No
    cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage1.pageText1
    );
    cy.verifyRadioGroupLabels(
      background.existingEnvNoRadioGroup,
      bgCEData.CEPage1.section1Radioboxes
    );
    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.existYesRadioOption
    );

    // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage2.pageText2
    );
    cy.verifyRadioGroupLabels(
      background.existingEnvNoRadioGroup,
      bgCEData.CEPage2.section1Radioboxes
    );
    //Select Yes, upload one file, remove same file and upload again
    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.systemDocsYesRadioBtn
    );

    cy.findElement(background.fileUploadSection)
      .should("exist")
      .and("be.visible");
    cy.findElement(background.dragandDropText).should(
      "contain.text",
      bgCEData.CEPage2.dragandDropText
    );
    cy.findElement(background.browsetoUploadText).should(
      "contain.text",
      bgCEData.CEPage2.browseToUploadText
    );
    cy.findElement(background.supportFileText).should(
      "contain.text",
      bgCEData.CEPage2.supportedFileTypes
    );
    cy.systemDiagramsUploadDoc(docFile);
    //remove the file, verify file is removed and upload again
    cy.findElement(background.removeFile1)
      .click()
      .then(() => {
        cy.findElement(background.removeFile1).should("not.exist");
      });
    //upload again
    cy.systemDiagramsUploadDoc(docFile);

    // Page#3:  Have you completed a migration assessment, analysis, .... tools needed?
    cy.clickContinueButton(
      background.systemDocsYesRadioBtn,
      bgCEData.CEPage3.pageHeader3
    );
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage3.pageText3
    );
    cy.verifyRadioGroupLabels(
      background.existingEnvNoRadioGroup,
      bgCEData.CEPage2.section1Radioboxes
    );
    //Select Yes, upload two files, remove one file and continue

    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.existYesRadioOption
    );
    cy.systemDiagramsUploadDoc(pdfFile);
    cy.systemDiagramsUploadDoc(xlsFile);

    cy.findElement(background.fileLinkFile1)
      .should("exist")
      .contains("dd1155.pdf");
    cy.findElement(background.fileLinkFile2)
      .should("exist")
      .contains("testMigration.xlsx");
    //remove one file, verify file is removed
    cy.findElement(background.removeFile1)
      .click({
        force: true,
      })
      .then(() => {
        cy.findElement(background.removeFile2).should("not.exist");
      });
    // Page#4 :  Where is your current environment located?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage4.pageHeader4
    );
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage4.pageText4
    );
    cy.verifyRadioGroupLabels(
      background.envLocationRadioGroup,
      bgCEData.CEPage4.section1Radioboxes
    );
    cy.radioBtn(background.cloudComputingRadio, "CLOUD")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });
    cy.radioBtn(background.onPremiseRadio, "ON_PREM")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });
    cy.radioBtn(background.hybridRadio, "HYBRID")
      .not("[disabled]")
      .and("not.checked")
      .click({
        force: true,
      });
    cy.environmentType("Cloud");

    // Page#5 :Tell us about your current data classification and impact levels
    cy.clickContinueButton(
      background.cloudComputingRadio,
      bgCEData.CEPage5.pageHeader5
    );
    cy.verifyTextMatches(background.introPText, bgCEData.CEPage5.pageText5);
    cy.textExists(
      background.classificationText,
      bgCEData.CEPage5.pageClassQuestion1
    );
    cy.textExists(
      background.classificationMessage,
      bgCEData.CEPage5.pageSelectALLMsg
    );
    cy.verifyCheckBoxLabels(
      background.unClassCloudCheckboxes,
      bgCEData.CEPage5.expectedLabelsCL
    );
    cy.dataClassificationLevels();
    cy.textExists(
      background.unClassificationText,
      bgCEData.CEPage5.pageClassQuestion2
    );
    cy.textExists(
      background.unClassificationMessage,
      bgCEData.CEPage5.pageSelectALLMsg
    );
    cy.verifyCheckBoxLabels(
      background.CloudClassificationCheckboxes,
      bgCEData.CEPage5.expectedLabelsUnCL
    );
    cy.UnclassificationLevels();

    // Page # 6-8 validations in next test case
  });

  it("TC2: Current Environment: Functional Testcase- Screen Validation pages 6-8", () => {
    //Page#1: Do you have a current environment to rehost? Yes No
    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.existYesRadioOption
    );

    // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.environmentsystemDiagramsMigrationOptions(
      "No",
      background.systemDocsNoRadioBtn
    );

    // Page#3:  Have you completed a migration assessment, .... and tools needed?
    cy.clickContinueButton(
      background.systemDocsYesRadioBtn,
      bgCEData.CEPage3.pageHeader3
    );
    cy.environmentsystemDiagramsMigrationOptions(
      "No",
      background.existNoRadioOption
    );

    // Page#4 :  Where is your current environment located?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage4.pageHeader4
    );
    cy.environmentType("Cloud");

    // Page#5 :Tell us about your current data classification and impact levels
    cy.clickContinueButton(
      background.cloudComputingRadio,
      bgCEData.CEPage5.pageHeader5
    );
    cy.dataClassificationLevels();
    cy.UnclassificationLevels();

    // Page#6 : Let’s start gathering details about each instance in your environment
    cy.clickContinueButton(
      background.unClassCloudCheckbox,
      bgCEData.CEPage6.pageHeader6
    );
    cy.verifyPageHeader(bgCEData.CEPage6.pageHeader6);
    cy.verifyTextMatches(background.page6TitleText, bgCEData.CEPage6.pageText6);

    //section#1:  1. Tell us about Instance #1
    cy.textExists(
      background.section1Question1,
      bgCEData.CEPage6.section1Question1
    );
    cy.findElement(background.regionDeployedAllCheckboxes)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.textExists(
      background.section1Question2,
      bgCEData.CEPage6.section1Question2
    );
    cy.verifyRadioGroupLabels(
      background.classificationRadioGroup,
      bgCEData.CEPage6.section1Radioboxes
    );
    cy.findElement(background.regionDeployedAllCheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.radioBtn(background.regularUsageRadiobox, "EVEN_USAGE").click({
      force: true,
    });

    //Section#2: Current usage and users
    cy.textExists(
      background.section2Question1,
      bgCEData.CEPage6.section2Question1
    );
    cy.findElement(background.section2Question1).scrollIntoView();
    cy.verifyRadioGroupLabels(
      background.currentUsageRadioGroup,
      bgCEData.CEPage6.section2Radioboxes
    );
    cy.findElement(background.IL5Radiobox).click({
      force: true,
    });
    cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
      force: true,
    });
    cy.textExists(
      background.section2Question2,
      bgCEData.CEPage6.section2Question2
    );
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
    cy.textExists(
      background.highUsageEventTextboxLable,
      bgCEData.CEPage6.eventMessage
    );
    cy.findElement(background.highUsageEventTextbox).type(eventCauseText);
    cy.textExists(
      background.highUsagePeriodTextboxLable,
      bgCEData.CEPage6.periodMessage
    );
    cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText);
    cy.textExists(
      background.section2Question3,
      bgCEData.CEPage6.section2Question3
    );
    cy.textExists(background.section2Message, bgCEData.CEPage6.section2Message);
    cy.findElement(background.regionUsersAllCheckboxes)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.conusEastTextbox).type(noOfUsers);
    cy.findElement(background.conusCentralTextbox).type(noOfUsers);
    cy.findElement(background.conusWestTextbox).type(noOfUsers);
    cy.findElement(background.africomTextbox).type(noOfUsers);
    cy.findElement(background.centcomTextbox).type(noOfUsers);
    cy.findElement(background.eucomTextbox).type(noOfUsers);
    cy.findElement(background.indopacomTextbox).type(noOfUsers);
    cy.findElement(background.southcomTextbox).type(noOfUsers);

    //Section# 3. Instance configurations
    cy.log("Licensing Textbox");
    cy.textExists(
      background.licenseTextboxLable,
      bgCEData.CEPage6.licensingTextboxLable
    );
    cy.findElement(background.licenseTextbox).type(licensingText);

    cy.log("numOfVCPUs Textbox");
    cy.textExists(
      background.numofVCPTextboxLable,
      bgCEData.CEPage6.vCPsTextboxLable
    );
    cy.findElement(background.numofVCPTextbox).type(noOfVCPUs);

    cy.findElement(background.licenseTextboxLable).scrollIntoView();
    cy.log("Processor Speed Textbox");
    cy.textExists(
      background.processorSpeedTextboxLable,
      bgCEData.CEPage6.processorTextboxLable
    );
    cy.findElement(background.processorSpeedTextbox).type(precessorSpeed);

    cy.findElement(background.licenseTextboxLable).scrollIntoView();
    cy.log("Operating System Textbox");
    cy.textExists(
      background.operatingSysTextboxLable,
      bgCEData.CEPage6.operatingSytemTextboxLable
    );
    cy.findElement(background.operatingSysTextbox).type(operatingSystemText);

    cy.log("Memory Textbox");
    cy.textExists(
      background.memoryTextboxLable,
      bgCEData.CEPage6.memoryTextboxLable
    );
    cy.findElement(background.memoryTextbox).type(memory);

    cy.log("storage type dropdown");
    cy.textExists(
      background.storageTypeLable,
      bgCEData.CEPage6.storageTypeTextboxLable
    );
    cy.findElement(background.storageTypeDropdown).click();
    cy.waitUntil(function () {
      return cy.findElement(background.blockStorageOption).should("exist");
    });
    cy.findElement(storageTypeOptionsMap[storageOptions]).click({
      force: true,
    });
    cy.findElement(background.blockStorageOption).should(
      "contain.text",
      " Block storage "
    );
    cy.findElement(
      background.blockStorageOption + background.storageSubtitle
    ).should("contain.text", bgCEData.CEPage6.blockStorageSubtitle);

    cy.findElement(background.objectTypeStorageOption).should(
      "contain.text",
      " Object storage "
    );
    cy.findElement(
      background.objectTypeStorageOption + background.storageSubtitle
    ).should("contain.text", bgCEData.CEPage6.objectStorageSubtitle);

    cy.findElement(background.fileStorageOption).should(
      "contain.text",
      " File storage "
    );
    cy.findElement(
      background.fileStorageOption + background.storageSubtitle
    ).should("contain.text", bgCEData.CEPage6.fileStorageSubtitle);

    cy.findElement(background.archiveStorageOption).should(
      "contain.text",
      " Archive storage "
    );
    cy.findElement(
      background.archiveStorageOption + background.storageSubtitle
    ).should("contain.text", bgCEData.CEPage6.archiveStorageSubtitle);

    cy.findElement(background.storageSizeLable).scrollIntoView();
    cy.textExists(
      background.storageSizeLable,
      bgCEData.CEPage6.storageSizeTextLable
    );
    cy.findElement(
      background.storageSizeField + background.byteSizeDropdown
    ).click(); //dropdownGB
    cy.waitUntil(function () {
      return cy
        .findElement(background.storageSizeField + background.gigabyteOption)
        .should("exist");
    });
    cy.findElement(
      background.storageSizeField + background.gigabyteOption
    ).should("contain.text", " Gigabyte (GB) ");
    cy.findElement(
      background.storageSizeField + background.terabyteOption
    ).should("contain.text", " Terabyte (TB) ");
    cy.findElement(
      background.storageSizeField + background.petayteOption
    ).should("contain.text", " Petabyte (PB) ");
    cy.findElement(
      background.storageSizeField + background.gigabyteOption
    ).click({
      force: true,
    });
    cy.findElement(background.storageAmountTextbox).type(storageSize);

    cy.textExists(
      background.performanceTiertitle,
      bgCEData.CEPage6.performanceTierLable
    );
    cy.verifyRadioGroupLabels(
      background.performanceTierRadioGroup,
      bgCEData.CEPage6.performanceRadioboxes
    );

    cy.radioBtn(background.generalPurposeRadiobox, "GENERAL").click({
      force: true,
    });
    cy.textExists(
      background.instancesTextboxLable,
      bgCEData.CEPage6.instancesTextboxLable
    );
    cy.findElement(background.instancesTextbox).clear().type(noOfInstances);

    cy.textExists(
      background.dataegressTextboxLable,
      bgCEData.CEPage6.monthlyDataTextboxLable
    );
    cy.findElement(background.dataegressTextbox).type(egressMonth);

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
    cy.radioBtn(background.reservedRadiobox, "PREPAID").click({
      force: true,
    });
    cy.selectDatefromDatePicker(
      background.reservedExpirationDatePicker,
      background.reservedNavigateNextMonth,
      background.selectDate,
      expirationDate,
      background.datePicker
    );

    //section#5: Additional Information
    cy.textExists(
      background.section5Question,
      bgCEData.CEPage6.section5Question
    );
    cy.textExists(background.section5Note, bgCEData.CEPage6.section5Note);
    cy.findElement(background.additionalInfoTextbox)
      .click()
      .type(additionalInformationText);

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
      deployedRegionCheckboxesList
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Classification",
      "UNCLASSIFIEDIL5"
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Quantity",
      noOfInstances
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "vCPU",
      noOfVCPUs
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
      expctedStorage
    );
    cy.verifyTableData(
      background.summaryCETableHeader,
      background.summaryCETableData,
      "Performance",
      "GENERALPURPOSE"
    );

    cy.clickContinueButton(
      background.currentEnvHistoryTable,
      bgCEData.BackgroundSummary.pageHeader8
    );
    cy.textExists(
      background.backgroundSummaryTitleText,
      bgCEData.BackgroundSummary.summaryTitle
    );
    cy.textExists(
      background.currentEnvironmentHeaderText,
      bgCEData.BackgroundSummary.currentEnvironmentTitle
    );
    cy.textExists(
      background.currentEnvironmentDescription,
      "Cloud environment deployed in Unclassified"
    );

    cy.textExists(
      background.currentEnvironmentCompleteBtn,
      bgCEData.BackgroundSummary.currentEnvironmentViewButton
    );

    cy.findElement(background.currentEnvironmentCompleteBtn).click();
  });

  it("TC3: Current Environment: Functional Testcase- No flow", () => {
    //Page#1: Do you have a current environment to rehost? Yes No
    cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage1.pageText1
    );

    //select No and verify the continue button takes to Performance step
    cy.environmentsystemDiagramsMigrationOptions(
      "No",
      background.existNoRadioOption
    );
    cy.clickContinueButton(
      background.existNoRadioOption,
      bgCEData.BackgroundSummary.pageHeader8
    );
    // navigating back to CurrentEnvironment page#1
    cy.btnClick(common.backBtn, "Back");
    cy.clickSideStepper(
      common.substepCurrentEnvironmentLink,
      " Current Environment "
    );
    cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
    cy.radioBtn(background.existYesRadioOption, "YES").click({
      force: true,
    });

    // Page#2: Do you have system diagrams, data architecture diagrams, charts etc..?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.environmentsystemDiagramsMigrationOptions(
      "No",
      background.systemDocsNoRadioBtn
    );

    // Page#3:  Have you completed a migration assessment,analysis,... tools needed?
    cy.clickContinueButton(
      background.systemDocsNoRadioBtn,
      bgCEData.CEPage3.pageHeader3
    );
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage3.pageText3
    );
    cy.environmentsystemDiagramsMigrationOptions(
      "No",
      background.existingEnvNoRadioBtn
    );

    cy.clickContinueButton(
      background.existNoRadioOption,
      bgCEData.CEPage4.pageHeader4
    );
  });

  it("TC4: Current Environment: Functional Testcase- Error message validation", () => {
    //Page#1: Do you have a current environment to rehost? Yes No
    cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
    cy.radioBtn("#developerToggleButton", "").click({
      force: true,
    });
    cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
    cy.checkErrorMessage(
      background.errorMessage,
      bgCEData.CEPage1.errorMessageText
    );
    cy.screenshot(" Page#1 screen is");
    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.existYesRadioOption
    );

    // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
    cy.checkErrorMessage(
      background.errorMessage,
      bgCEData.CEPage1.errorMessageText
    );
    //Select Yes, do NOT upload the file and click continue
    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.systemDocsYesRadioBtn
    );
    cy.btnClick(common.continueBtn, " Continue ");
    cy.checkErrorMessage(
      background.errorMessage,
      bgCEData.CEPage2.uploadMessageText
    );
    cy.environmentsystemDiagramsMigrationOptions(
      "No",
      background.systemDocsNoRadioBtn
    );

    // Page#3:  Have you completed a migration assessment,analysis,orprocess ... needed?
    cy.clickContinueButton(
      background.systemDocsYesRadioBtn,
      bgCEData.CEPage3.pageHeader3
    );
    cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
    cy.checkErrorMessage(
      background.errorMessage,
      bgCEData.CEPage1.errorMessageText
    );
    //Select Yes, upload txt file and click continue
    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.existYesRadioOption
    );
    cy.findElement(background.uploadFileSysDiagram).selectFile(txtFile, {
      force: true,
    });
    cy.checkErrorMessage(
      background.errorMessage,
      bgCEData.CEPage2.uploadMessageText
    );
    cy.systemDiagramsUploadDoc(xlsFile);

    // Page#4 : Where is your current environment located?
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage4.pageHeader4
    );
    cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
    cy.checkErrorMessage(
      background.errorMessage,
      bgCEData.CEPage4.environmentMessageText
    );
    cy.environmentType("Cloud");

    // Page#5 :Tell us about your current data classification and impact levels
    cy.clickContinueButton(
      background.cloudComputingRadio,
      bgCEData.CEPage5.pageHeader5
    );
    cy.dataClassificationLevels();
    cy.UnclassificationLevels();

    // Page#6 : Let’s start gathering details about each instance in your environment
    cy.clickContinueButton(
      background.level2Checkbox,
      bgCEData.CEPage6.pageHeader6
    );

    //Section#1
    cy.btnClick(common.continueBtn, " Continue ");
    cy.checkErrorMessage(
      background.classandImpactErrorMessage,
      bgCEData.CEPage6.classificationImpactMessageText
    );

    // //Section#2
    cy.checkErrorMessage(
      background.currentUsageErrorMessage,
      bgCEData.CEPage6.currentUsageMessageText
    );
    cy.checkErrorMessage(
      background.regionsErrorMessage,
      bgCEData.CEPage6.regionMessageText
    );
    cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
      force: true,
    });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.checkErrorMessage(
      background.spikesCausesErrorMessage,
      bgCEData.CEPage6.spikesCausesMessageText
    );
    cy.findElement(background.spikesCheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.checkErrorMessage(
      background.highUsageEventErrorMessage,
      bgCEData.CEPage6.highUsageEventMessageText
    );
    cy.checkErrorMessage(
      background.highUsagePeriodErrorMessage,
      bgCEData.CEPage6.highUsagePeriodMessageText
    );
    cy.findElement(background.highUsageEventTextbox).type(eventCauseText);
    cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText);

    //Section#3
    cy.findElement(background.licensingErrorMessage).scrollIntoView();
    cy.checkErrorMessage(
      background.licensingErrorMessage,
      bgCEData.CEPage6.licensingMessageText
    );
    cy.checkErrorMessage(
      background.noofVCPErrorMessage,
      bgCEData.CEPage6.vCPUSMessageText
    );
    cy.checkErrorMessage(
      background.processorSpeedErrorMessage,
      bgCEData.CEPage6.processorSpeedMessageText
    );
    cy.checkErrorMessage(
      background.operatingSysErrorMessage,
      bgCEData.CEPage6.operatingSystemMessageText
    );
    cy.checkErrorMessage(
      background.memoryErrorMessage,
      bgCEData.CEPage6.memoryMessageText
    );
    cy.checkErrorMessage(
      background.storageTypeErrorMessage,
      bgCEData.CEPage6.storageTypeMessageText
    );
    cy.findElement(background.storageSizeErrorMessage).scrollIntoView();
    cy.checkErrorMessage(
      background.storageSizeErrorMessage,
      bgCEData.CEPage6.storageSizeMessageText
    );
    cy.checkErrorMessage(
      background.performanceTierErrorMessage,
      bgCEData.CEPage6.performanceTierMessageText
    );
    cy.checkErrorMessage(
      background.monthlyDataErrorMessage,
      bgCEData.CEPage6.monthlyDataMessageText
    );

    //Section#4
    cy.findElement(background.pricingModelErrorMessage).scrollIntoView();
    cy.checkErrorMessage(
      background.pricingModelErrorMessage,
      bgCEData.CEPage6.pricingModelMessageText
    );
    cy.radioBtn(background.reservedRadiobox, "PREPAID").click({
      force: true,
    });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.checkErrorMessage(
      background.expirationDateErrorMessage,
      bgCEData.CEPage6.expirationMessageText
    );
    cy.selectDatefromDatePicker(
      background.reservedExpirationDatePicker,
      background.reservedNavigateNextMonth,
      background.selectDate,
      expirationDate,
      background.datePicker
    );
    cy.findElement(background.additionalInfoTextbox)
      .click()
      .type(additionalInformationText); //#Section5
  });
});
