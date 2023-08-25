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
    let pt = "TC-Step-04-Background:Current Environment-Functional-" + randomAlphaNumeric(5);
    let scope = "Project Scope-" + randomString(5);

    // functional testing data:
    const docFile = "cypress/fixtures/files/testFileSysDiagram.docx"
    const pdfFile = "cypress/fixtures/files/dd1155.pdf"
    const xlsFile = "cypress/fixtures/files/testMigration.xlsx"

    // page#6
    let deployedRegions = [
        'conusEast',
        'conusCentral',
        'conusWest',
        'africom',
        'centcom',
        'eucom',
        'indopacom',
        'southcom',
    ]
    let impactLevelCheckboxes = [ // accepts only one option
        // 'UnclassifiedIL2',
        //'UnclassifiedIL4',
        //'UnclassifiedIL5',
        'SecretIL6',
        // 'TopSecret'
    ]
    let storageOptions = ['Object' //Block, Object, File, Archive
    ]
    let performanceTierOption = ['computeOptimized' //generalPurpose, computeOptimized, memoryOptimized, storageOptimized
    ]

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
    //section#4 data
    //section#5 data
    const additionalInformation = "Additional Info is--" + randomString(5);

    // page#5
    const impactLevelMap = {
        UnclassifiedIL2: background.IL2Radiobox,
        UnclassifiedIL4: background.IL4Radiobox,
        UnclassifiedIL5: background.IL5Radiobox,
        SecretIL6: background.IL6Radiobox,
        TopSecret: background.tsRadiobox
    }
    const storageTypeOptionsMap = {
        Block: background.blockStorageOption,
        Object: background.objectTypeStorageOption,
        File: background.fileStorageOption,
        Archive: background.archiveStorageOption,
    }
    const performanceTierOptionsMap = {
        generalPurpose: background.generalPurposeRadiobox,
        computeOptimized: background.computeOptimRadiobox,
        memoryOptimized: background.memoryOptimizedRadiobox,
        storageOptimized: background.storageOptimRadiobox,
    }

    // Summary page:
    const deployedRegionCheckboxesList = deployedRegions.join(' ,').toUpperCase().replace(/\s/g, '');
    const impactLevelCheckboxesList = impactLevelCheckboxes.join(' ,').toUpperCase();
    const expctedMemory = memoryByte + "GB";
    const storageOptionsList = storageOptions.join(' ,').toUpperCase();
    const storageExpected = storageOptionsList + ":" + storage + "GB";
    const performanceTierOptions = performanceTierOption.join(' ,').toUpperCase();

    beforeEach(() => {
        cy.goToAcqPackageStepOne(pt, scope);
        cy.clickSideStepper(common.stepBackgroundLink, " Background ");
        cy.activeStep(common.stepBackgroundText);
        cy.clickSideStepper(common.substepCurrentEnvironmentLink, " Current Environment ");
        cy.activeStep(common.substepCurrentEnvironmentText);
    });


    function cloudandPremiseDataClassification() { //cloud &onPremise
        impactLevelCheckboxes.forEach(impactLevelCheckbox => {
            cy.findElement(impactLevelMap[impactLevelCheckbox]).click({
                force: true
            });
        });
    }

    function page5CLoudandOnpremiseInstances() {
        //Cloud Instances
        cy.findElement(background.unClassCloudCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.scCloudCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.tsCloudCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.verifyCheckBoxLabels(background.CloudClassificationCheckboxes, bgCEData.CEPage5.expectedLabelsUnCL);
        cy.findElement(background.CloudClassificationCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");

        //Onpremise Instances
        cy.findElement(background.unClassPremCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.scPremCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.tsPremCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked")
        cy.verifyCheckBoxLabels(background.onPremiseClassificationCheckboxes, bgCEData.CEPage5.expectedLabelsOnPrem);
        cy.findElement(background.onPremiseClassificationCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
    }

    function section3InstanceConfigurations() {
        cy.findElement(background.licenseTextbox).type(licensing)
        cy.findElement(background.numofVCPTextbox).type(noOfVCPU)
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.processorSpeedTextbox).type(precessSpeed)
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.operatingSysTextbox).type(operatingSystem)
        cy.findElement(background.memoryTextbox).type(memoryByte)
        cy.findElement(background.storageTypeDropdown).click();
        cy.waitUntil(function () {
            return cy.findElement(background.blockStorageOption).should("exist");
        })
        cy.findElement(storageTypeOptionsMap[storageOptions]).click({
            force: true
        });
        cy.findElement(background.storageSizeLable).scrollIntoView();
        cy.textExists(background.storageSizeLable, bgCEData.CEPage6.storageSizeTextLable);
        cy.findElement(background.storageSizeField + background.byteSizeDropdown).click();
        cy.waitUntil(function () {
            return cy.findElement(background.storageSizeField + background.gigabyteOption).should("exist");
        })
        cy.findElement(background.storageSizeField + background.gigabyteOption).click({
            force: true
        });
        cy.findElement(background.storageAmountTextbox).type(storage)
        cy.findElement(performanceTierOptionsMap[performanceTierOption]).click({
            force: true
        });
        cy.findElement(background.instancesTextbox).clear().type(instances);
        cy.findElement(background.dataegressTextbox).type(egressMonth);
    }

    function section2CurrentUsageandUsers() {
        cy.verifyRadioGroupLabels(background.currentUsageRadioGroup, bgCEData.CEPage6.section2Radioboxes);
        cy.radioBtn(background.regularUsageRadiobox, "EVEN_USAGE").click({
            force: true
        });
        cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
            force: true
        });
        cy.verifyCheckBoxLabels(background.spikesCheckboxes, bgCEData.CEPage6.spikesCheckboxes);
        cy.findElement(background.spikesCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.highUsageEventTextbox).type(eventCause)
        cy.findElement(background.highUsagePeriodTextbox).type(periodCause)
        cy.findElement(background.regionUsersCheckboxes + background.conusWestCheckbox).check({
            force: true
        }).should("be.checked");
        cy.findElement(background.conusWestTextbox).type(users);
    }

    function section7verifyTableData() {
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "Classification", impactLevelCheckboxesList);
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "Quantity", instances);
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "vCPU", noOfVCPU);
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "Memory", expctedMemory);
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "Storage", storageExpected);
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "Performance", performanceTierOptions);

    }

    it("TC1: Current Environment: Functional Testcase- Hybrid-Cloud Environment", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage1.pageText1);
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        cy.verifyRadioGroupLabels(background.existingEnvNoRadioGroup, bgCEData.CEPage2.section1Radioboxes);
        cy.radioBtn(background.systemDocsYesRadioBtn, "YES")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile(pdfFile, {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        })

        // Page#3:  Have you completed a migration assessment, analysis, or process to identify the cloud services and tools needed?  
        cy.clickContinueButton(background.systemDocsYesRadioBtn, bgCEData.CEPage3.pageHeader3);
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage3.pageText3);
        cy.radioBtn(background.existNoRadioOption, "NO")
        .click({
            force: true
        });
        cy.radioBtn(background.existYesRadioOption, "YES").not("not.checked")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile(docFile, {
            force: true
        });
        cy.findElement(background.uploadFileSysDiagram).selectFile(xlsFile, {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        });

        // Page#4 :  Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.radioBtn(background.hybridRadio, "HYBRID")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#5 :Tell us about your current data classification and impact levels 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage5.pageHeader5);
        page5CLoudandOnpremiseInstances();

        // Page#6 : Let’s start gathering details about each instance in your environment 
        cy.clickContinueButton(background.tsPremCheckbox, bgCEData.CEPage6.pageHeader6);
        //section#1:  1. Tell us about Instance #1 
        cy.verifyTextMatches(background.section1Question3, bgCEData.CEPage6.section1Question1Hybrid);
        cy.verifyRadioGroupLabels(background.instanceRadioGroup, bgCEData.CEPage6.section1RadioboxesHybrid);
        cy.radioBtn(background.cloudRadiobox, "CLOUD").not("[disabled]").and("not.checked")
            .click({
                force: true
            });
        cy.get(background.regionDeployedAllCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.verifyRadioGroupLabels(background.classificationRadioGroup, bgCEData.CEPage6.section1Radioboxes);
        cloudandPremiseDataClassification();

        //Section#2: Current usage and users
        cy.findElement(background.section2Question1).scrollIntoView();
        cy.textExists(background.section2Question1, bgCEData.CEPage6.section2Question1);
        section2CurrentUsageandUsers();

        //Section# 3. Instance configurations 
        section3InstanceConfigurations();

        //section#4: Pricing Details
        cy.textExists(background.section4Message, bgCEData.CEPage6.section4Legend);
        cy.findElement(background.section4Message).scrollIntoView();
        cy.verifyRadioGroupLabels(background.currentPaymentRadioGroup, bgCEData.CEPage6.section4Radioboxes);
        cy.radioBtn(background.payAsYouGoRadiobox, "PAY_AS_YOU_GO").click({
            force: true
        });

        //section#5: Additional Information
        cy.textExists(background.section5Question, bgCEData.CEPage6.section5Question);
        cy.findElement(background.additionalInfoTextbox).click().type(additionalInformation);

        // Page#7 : Current Environment Summary
        cy.clickContinueButton(background.additionalInfoTextbox, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.introPText, bgCEData.CEPage7.pageText7);
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "Location", "CLOUD" + deployedRegionCheckboxesList);
        section7verifyTableData();
    })

    it("TC2: Current Environment: Functional Testcase- Hybrid-OnPremise Environment", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.verifyRadioGroupLabels(background.existingEnvNoRadioGroup, bgCEData.CEPage1.section1Radioboxes);
        cy.radioBtn(background.existYesRadioOption, "YES").not("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage2.pageText2);
        cy.radioBtn(background.systemDocsNoRadioBtn, "NO")
            .click({
                force: true
            });
        cy.radioBtn(background.systemDocsYesRadioBtn, "YES")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile(docFile, {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        })

        // Page#3:  Have you completed a migration assessment, analysis, or process to identify the cloud services and tools needed?  
        cy.clickContinueButton(background.systemDocsYesRadioBtn, bgCEData.CEPage3.pageHeader3);
        cy.verifyRadioGroupLabels(background.existingEnvNoRadioGroup, bgCEData.CEPage2.section1Radioboxes);
        cy.radioBtn(background.existYesRadioOption, "YES").not("[disabled]").and("not.checked")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile(pdfFile, {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        });

        // Page#4 : Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.radioBtn(background.hybridRadio, "HYBRID").not("[disabled]").and("not.checked").click({
            force: true
        });

        // Page#5 :Tell us about your current data classification and impact levels 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage5.pageHeader5);
        page5CLoudandOnpremiseInstances();

        // Page#6 : Let’s start gathering details about each instance in your environment 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage6.pageHeader6);

        //section#1:  1. Tell us about Instance #1 
        cy.verifyTextMatches(background.section1Question3, bgCEData.CEPage6.section1Question1Hybrid);
        cy.verifyRadioGroupLabels(background.instanceRadioGroup, bgCEData.CEPage6.section1RadioboxesHybrid);
        cy.radioBtn(background.onPremRadiobox, "ON_PREM").not("[disabled]").and("not.checked")
            .click({
                force: true
            });
        cy.textExists(background.section1Question2OnPrem, bgCEData.CEPage6.section1Question1OnPrem);
        cy.verifyRadioGroupLabels(background.classificationRadioGroup, bgCEData.CEPage6.section1RadioboxesOnPrem);
        cloudandPremiseDataClassification();

        //Section#2: Current usage and users
        cy.findElement(background.section2Question1).scrollIntoView();
        cy.textExists(background.section2Question1, bgCEData.CEPage6.section2Question1);
        section2CurrentUsageandUsers();

        //Section# 3. Instance configurations 
        section3InstanceConfigurations();

        //section#4: Additional Information
        cy.findElement(background.additionalInfoTextbox).click().type(additionalInformation);

        // Page#7 : Current Environment Summary
        cy.clickContinueButton(background.additionalInfoTextbox, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.page7Title, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.introPText, bgCEData.CEPage7.pageText7);
        cy.verifyTableData(background.summaryCETableHeader, background.summaryCETableData, "Location", "ON-PREMISEMISSINGINFO");
        section7verifyTableData();

    })
});