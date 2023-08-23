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
    const txtFile = "cypress/fixtures/files/textfile.txt"

    // page#5
    let cloudClassLevelCheckboxes = [ // Cloud computing
        'UnClassifiedCloud',
        'SecretCloud',
        'TSCloud'
    ]
    let unClassLevelCheckboxes = [ //cloud Computing
        'levelIL2',
        //'levelIL4',
        //'levelIL5'
    ]
    // page#6
    let deployedRegionCheckboxes = [
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
    let currentUsage = "evenlyDistributed" //evenlyDistributed, irregularUsage
    let spikesUsage = "periodBased" // eventBased, periodBased
    let storageOptions = ['Object' //Block, Object, File, Archive
    ]
    let performanceTierOptions = ['computeOptimized' //generalPurpose, computeOptimized, memoryOptimized, storageOptimized
    ]
    let currentPayment = ['reserved' //reserved, payAsyouGo
    ]

    //section#2 data
    const eventCauseText = "Event that causes a surge in usage for testing- " + randomString(3);
    const periodCauseText = "period of the year surge in usage for testing- " + randomString(3);
    const noOfUsers = randomNumber(2);
    //section#3 data
    const licensingText = "LicensingTest--" + randomAlphaNumeric(3);
    const noOfVCPUs = randomNumber(2);
    const precessorSpeed = randomNumber(4);
    const operatingSystemText = "OperatingSystemTest--" + randomString(3);
    const memory = randomNumber(2);
    const storageSize = randomNumber(3);
    const noOfInstances = randomNumberBetween(1, 9);
    const egressPerMonth = randomNumber(2);
    //section#4 data
    const expirationDate = randomNumberBetween(1, 30);
    //section#5 data
    const additionalInformationText = "Optional Additional Information is--" + randomString(5);

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
    const deployedRegionCheckboxesList = deployedRegionCheckboxes.join(' ,').toUpperCase().replace(/\s/g, '');
    const impactLevelCheckboxesList = impactLevelCheckboxes.join(' ,').toUpperCase();
    const expctedMemory = memory + "GB";
    const storageOptionsList = storageOptions.join(' ,').toUpperCase();
    const expctedStorage = storageOptionsList + ":" + storageSize + "GB";
    const performanceTierOptionsList = performanceTierOptions.join(' ,').toUpperCase();

    beforeEach(() => {
        cy.goToAcqPackageStepOne(pt, scope);
        cy.clickSideStepper(common.stepBackgroundLink, " Background ");
        cy.activeStep(common.stepBackgroundText);
        cy.clickSideStepper(common.substepCurrentEnvironmentLink, " Current Environment ");
        cy.activeStep(common.substepCurrentEnvironmentText);
    });

    // functions for this page:
    //Page#6

    function cloudandPremiseDataClassification() { //cloud &onPremise
        impactLevelCheckboxes.forEach(impactLevelCheckbox => {
            cy.findElement(impactLevelMap[impactLevelCheckbox]).click({
                force: true
            });
        });
    }

    function verifyTableData(columnHeader, expectedValue) {
        cy.get(background.summaryCETableHeader).each(($el, index, $list) => {
            const text = $el.text();
            if (text.includes(columnHeader)) {
                cy.get(background.summaryCETableData).eq(index).then(function (value) {
                    const actualValue = value.text().trim();
                    if (isNaN(actualValue)) {
                        const trimmedActualValue = actualValue.toUpperCase().replace(/\s/g, '').replace(/[/()]/g, '')
                        expect(trimmedActualValue).to.equal(expectedValue)
                    } else {
                        expect(Number(actualValue)).to.equal(Number(expectedValue));
                    }
                })
            }
        })
    }

    it("TC1: Current Environment: Functional Testcase- Cloud Environment", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        //Select Yes, upload one file, remove same file and upload again
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
        //Select Yes, upload two files, remove one file and continue
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

        // Page#4 :  Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.radioBtn(background.cloudComputingRadio, "CLOUD")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#5 :Tell us about your current data classification and impact levels 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage5.pageHeader5);
        cy.verifyCheckBoxLabels(background.unClassCloudCheckboxes, bgCEData.CEPage5.expectedLabelsCL);
        cy.get(background.unClassCloudCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.verifyCheckBoxLabels(background.CloudClassificationCheckboxes, bgCEData.CEPage5.expectedLabelsUnCL);
        cy.get(background.CloudClassificationCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");

        // Page#6 : Let’s start gathering details about each instance in your environment 
        cy.clickContinueButton(background.tsPremCheckbox, bgCEData.CEPage6.pageHeader6);
        //section#1:1. Tell us about Instance #1 
        cy.get(background.regionDeployedAllCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.verifyRadioGroupLabels(background.classificationRadioGroup, bgCEData.CEPage6.section1Radioboxes);
        cloudandPremiseDataClassification();

        //Section#2: Current usage and users
        cy.findElement(background.section2Question1).scrollIntoView();
        cy.textExists(background.section2Question1, bgCEData.CEPage6.section2Question1);
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
        cy.findElement(background.highUsageEventTextbox).type(eventCauseText)
        cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText)
        cy.findElement(background.regionUsersCheckboxes + background.conusWestCheckbox).check({
            force: true
        }).should("be.checked");
        cy.findElement(background.conusWestTextbox).type(noOfUsers);

        //Section# 3. Instance configurations 
        cy.findElement(background.licenseTextbox).type(licensingText) //Licensing Textbox
        cy.findElement(background.numofVCPTextbox).type(noOfVCPUs) //numOfVCPUs Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.processorSpeedTextbox).type(precessorSpeed) //Processor Speed Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.operatingSysTextbox).type(operatingSystemText) //Operating System Textbox
        cy.findElement(background.memoryTextbox).type(memory) //Memory Textbox
        cy.findElement(background.storageTypeDropdown).click(); // storage type dropdown
        cy.waitUntil(function () {
            return cy.findElement(background.blockStorageOption).should("exist");
        })
        cy.findElement(storageTypeOptionsMap[storageOptions]).click({
            force: true
        });
        cy.findElement(background.storageSizeLable).scrollIntoView();
        cy.textExists(background.storageSizeLable, bgCEData.CEPage6.storageSizeTextLable); // storage size
        cy.findElement(background.storageSizeField + background.byteSizeDropdown).click(); //dropdownGB
        cy.waitUntil(function () {
            return cy.findElement(background.storageSizeField + background.gigabyteOption).should("exist");
        })
        cy.findElement(background.storageSizeField + background.gigabyteOption).click({
            force: true
        });
        cy.findElement(background.storageAmountTextbox).type(storageSize)
        cy.findElement(performanceTierOptionsMap[performanceTierOptions]).click({ //Performance Tier
            force: true
        });
        cy.findElement(background.instancesTextbox).clear().type(noOfInstances); //Instances Textbox
        cy.findElement(background.dataegressTextbox).type(egressPerMonth); //data/Internet Textbox

        //section#4: Pricing Details
        cy.textExists(background.section4Message, bgCEData.CEPage6.section4Legend);
        cy.findElement(background.section4Message).scrollIntoView();
        cy.verifyRadioGroupLabels(background.currentPaymentRadioGroup, bgCEData.CEPage6.section4Radioboxes);
        cy.radioBtn(background.payAsYouGoRadiobox, "PAY_AS_YOU_GO").click({
            force: true
        });

        //section#5: Additional Information
        cy.textExists(background.section5Question, bgCEData.CEPage6.section5Question);
        cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText);

        // Page#7 : Current Environment Summary
        cy.clickContinueButton(background.additionalInfoTextbox, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.introPText, bgCEData.CEPage7.pageText7); 
        verifyTableData("Location", deployedRegionCheckboxesList);
        verifyTableData("Classification", impactLevelCheckboxesList);
        verifyTableData("Quantity", noOfInstances);
        verifyTableData("vCPU", noOfVCPUs);
        verifyTableData("Memory", expctedMemory);
        verifyTableData("Storage", expctedStorage);
        verifyTableData("Performance", performanceTierOptionsList);
    })

    it("TC2: Current Environment: Functional Testcase- OnPremise Environment", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        //Select Yes, upload one file, remove same file and upload again
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

        // Page#4 :  Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.radioBtn(background.onPremiseRadio, "ON_PREM").click({
            force: true
        });

        // Page#5 :Tell us about your current data classification and impact levels 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage5.pageHeader5);
        cy.get(background.unClassCloudCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        //onpremise Classification verification
        cy.textExists(background.unClassificationText, bgCEData.CEPage5.pageClassQuestion3);
        cy.textExists(background.unClassificationMessage, bgCEData.CEPage5.pageSelectALLMsg);
        cy.verifyCheckBoxLabels(background.onPremiseClassificationCheckboxes, bgCEData.CEPage5.expectedLabelsOnPrem);
        cy.get(background.onPremiseClassificationCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");

        // Page#6 : Let’s start gathering details about each instance in your environment 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage6.pageHeader6);
        //section#1:  1. Tell us about Instance #1 
        cy.textExists(background.section1Question2OnPrem, bgCEData.CEPage6.section1Question1OnPrem);
        cy.verifyRadioGroupLabels(background.classificationRadioGroup, bgCEData.CEPage6.section1RadioboxesOnPrem);
        cloudandPremiseDataClassification();

        //Section#2: Current usage and users
        cy.textExists(background.section2Question1, bgCEData.CEPage6.section2Question1);
        cy.findElement(background.section2Question1).scrollIntoView();
        cy.verifyRadioGroupLabels(background.currentUsageRadioGroup, bgCEData.CEPage6.section2Radioboxes);
        cy.radioBtn(background.regularUsageRadiobox, "EVEN_USAGE").click({
            force: true
        });
        cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
            force: true
        });
        cy.textExists(background.section2Question2, bgCEData.CEPage6.section2Question2);
        cy.verifyCheckBoxLabels(background.spikesCheckboxes, bgCEData.CEPage6.spikesCheckboxes);
        cy.get(background.spikesCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.textExists(background.highUsageEventTextboxLable, bgCEData.CEPage6.eventMessage);
        cy.findElement(background.highUsageEventTextbox).type(eventCauseText)
        cy.textExists(background.highUsagePeriodTextboxLable, bgCEData.CEPage6.periodMessage);
        cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText)
        cy.textExists(background.section2Question3, bgCEData.CEPage6.section2Question3);
        cy.textExists(background.section2Message, bgCEData.CEPage6.section2Message);
        cy.findElement(background.eucomCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.eucomTextbox).type(noOfUsers);

        //Section# 3. Instance configurations 
        cy.findElement(background.licenseTextbox).type(licensingText) //Licensing Textbox
        cy.findElement(background.numofVCPTextbox).type(noOfVCPUs) //numOfVCPUs Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.processorSpeedTextbox).type(precessorSpeed) //Processor Speed Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.operatingSysTextbox).type(operatingSystemText) //Operating System Textbox
        cy.findElement(background.memoryTextbox).type(memory) //Memory Textbox
        cy.findElement(background.storageTypeDropdown).click(); // storage type dropdown
        cy.waitUntil(function () {
            return cy.findElement(background.blockStorageOption).should("exist");
        })
        cy.findElement(storageTypeOptionsMap[storageOptions]).click({
            force: true
        });

        cy.findElement(background.storageSizeLable).scrollIntoView();
        cy.textExists(background.storageSizeLable, bgCEData.CEPage6.storageSizeTextLable); // storage size
        cy.findElement(background.storageSizeField + background.byteSizeDropdown).click(); //dropdownGB
        cy.waitUntil(function () {
            return cy.findElement(background.storageSizeField + background.gigabyteOption).should("exist");
        })
        cy.findElement(background.storageSizeField + background.gigabyteOption).click({
            force: true
        });
        cy.findElement(background.storageAmountTextbox).type(storageSize)
        cy.textExists(background.performanceTiertitle, bgCEData.CEPage6.performanceTierLable); //Performance Tier
        cy.findElement(performanceTierOptionsMap[performanceTierOptions]).click({
            force: true
        });
        cy.findElement(background.instancesTextbox).clear().type(noOfInstances); //Instances Textbox
        cy.findElement(background.dataegressTextbox).type(egressPerMonth); //data/Internet Textbox

        //section#4: Additional Information
        cy.textExists(background.section5Question, bgCEData.CEPage6.section5Question);
        cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText);

        // Page#7 : Current Environment Summary
        cy.clickContinueButton(background.additionalInfoTextbox, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.page7Title, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.introPText, bgCEData.CEPage7.pageText7); 
        verifyTableData("Location", deployedRegionCheckboxesList);
        verifyTableData("Classification", impactLevelCheckboxesList);
        verifyTableData("Quantity", noOfInstances);
        verifyTableData("vCPU", noOfVCPUs);
        verifyTableData("Memory", expctedMemory);
        verifyTableData("Storage", expctedStorage);
        verifyTableData("Performance", performanceTierOptionsList);
    })

    it("TC3: Current Environment: Functional Testcase- Hybrid-Cloud Environment", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        //Select Yes, upload one file, remove same file and upload again
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
        //Select Yes, upload two files, remove one file and continue
        cy.radioBtn(background.existYesRadioOption, "YES").not("[disabled]").and("not.checked")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile(pdfFile, {
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
        cy.findElement(background.highUsageEventTextbox).type(eventCauseText)
        cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText)
        cy.findElement(background.regionUsersCheckboxes + background.conusWestCheckbox).check({
            force: true
        }).should("be.checked");
        cy.findElement(background.conusWestTextbox).type(noOfUsers);

        //Section# 3. Instance configurations 
        cy.findElement(background.licenseTextbox).type(licensingText) //Licensing Textbox
        cy.findElement(background.numofVCPTextbox).type(noOfVCPUs) //numOfVCPUs Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.processorSpeedTextbox).type(precessorSpeed) //Processor Speed Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.operatingSysTextbox).type(operatingSystemText) //Operating System Textbox
        cy.findElement(background.memoryTextbox).type(memory) //Memory Textbox
        cy.findElement(background.storageTypeDropdown).click(); // storage type dropdown
        cy.waitUntil(function () {
            return cy.findElement(background.blockStorageOption).should("exist");
        })
        cy.findElement(storageTypeOptionsMap[storageOptions]).click({
            force: true
        });
        cy.findElement(background.storageSizeLable).scrollIntoView();
        cy.textExists(background.storageSizeLable, bgCEData.CEPage6.storageSizeTextLable); // storage size
        cy.findElement(background.storageSizeField + background.byteSizeDropdown).click(); //dropdownGB
        cy.waitUntil(function () {
            return cy.findElement(background.storageSizeField + background.gigabyteOption).should("exist");
        })
        cy.findElement(background.storageSizeField + background.gigabyteOption).click({
            force: true
        });
        cy.findElement(background.storageAmountTextbox).type(storageSize)
        cy.findElement(performanceTierOptionsMap[performanceTierOptions]).click({ //Performance Tier
            force: true
        });
        cy.findElement(background.instancesTextbox).clear().type(noOfInstances); //Instances Textbox
        cy.findElement(background.dataegressTextbox).type(egressPerMonth); //data/Internet Textbox

        //section#4: Pricing Details
        cy.textExists(background.section4Message, bgCEData.CEPage6.section4Legend);
        cy.findElement(background.section4Message).scrollIntoView();
        cy.verifyRadioGroupLabels(background.currentPaymentRadioGroup, bgCEData.CEPage6.section4Radioboxes);
        cy.radioBtn(background.payAsYouGoRadiobox, "PAY_AS_YOU_GO").click({
            force: true
        });

        //section#5: Additional Information
        cy.textExists(background.section5Question, bgCEData.CEPage6.section5Question);
        cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText);

        // Page#7 : Current Environment Summary
        cy.clickContinueButton(background.additionalInfoTextbox, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.introPText, bgCEData.CEPage7.pageText7); 
        verifyTableData("Location", "CLOUD" + deployedRegionCheckboxesList);
        verifyTableData("Classification", impactLevelCheckboxesList);
        verifyTableData("Quantity", noOfInstances);
        verifyTableData("vCPU", noOfVCPUs);
        verifyTableData("Memory", expctedMemory);
        verifyTableData("Storage", expctedStorage);
        verifyTableData("Performance", performanceTierOptionsList);
    })

    it("TC4: Current Environment: Functional Testcase- Hybrid-OnPremise Environment", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
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
        cy.findElement(background.onPremiseClassificationCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");

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
        cy.verifyRadioGroupLabels(background.currentUsageRadioGroup, bgCEData.CEPage6.section2Radioboxes);
        cy.radioBtn(background.regularUsageRadiobox, "EVEN_USAGE").click({
            force: true
        });
        cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
            force: true
        });
        cy.textExists(background.section2Question2, bgCEData.CEPage6.section2Question2);
        cy.verifyCheckBoxLabels(background.spikesCheckboxes, bgCEData.CEPage6.spikesCheckboxes);
        cy.findElement(background.spikesCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.textExists(background.highUsageEventTextboxLable, bgCEData.CEPage6.eventMessage);
        cy.findElement(background.highUsageEventTextbox).type(eventCauseText)
        cy.textExists(background.highUsagePeriodTextboxLable, bgCEData.CEPage6.periodMessage);
        cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText)
        cy.textExists(background.section2Question3, bgCEData.CEPage6.section2Question3);
        cy.textExists(background.section2Message, bgCEData.CEPage6.section2Message);
        cy.findElement(background.conusEastCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.conusEastTextbox).type(noOfUsers);

        //Section# 3. Instance configurations 
        cy.findElement(background.licenseTextbox).type(licensingText) //Licensing Textbox
        cy.findElement(background.numofVCPTextbox).type(noOfVCPUs) //numOfVCPUs Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.processorSpeedTextbox).type(precessorSpeed) //Processor Speed Textbox
        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.findElement(background.operatingSysTextbox).type(operatingSystemText) //Operating System Textbox
        cy.findElement(background.memoryTextbox).type(memory) //Memory Textbox
        cy.findElement(background.storageTypeDropdown).click(); // storage type dropdown
        cy.waitUntil(function () {
            return cy.findElement(background.blockStorageOption).should("exist");
        })
        cy.findElement(storageTypeOptionsMap[storageOptions]).click({
            force: true
        });
        cy.findElement(background.storageSizeLable).scrollIntoView();
        cy.textExists(background.storageSizeLable, bgCEData.CEPage6.storageSizeTextLable); // storage size
        cy.findElement(background.storageSizeField + background.byteSizeDropdown).click(); //dropdownGB
        cy.waitUntil(function () {
            return cy.findElement(background.storageSizeField + background.gigabyteOption).should("exist");
        })
        cy.findElement(background.storageSizeField + background.gigabyteOption).click({
            force: true
        });
        cy.findElement(background.storageAmountTextbox).type(storageSize)
        cy.findElement(performanceTierOptionsMap[performanceTierOptions]).click({ //Performance Tier
            force: true
        });
        cy.findElement(background.instancesTextbox).clear().type(noOfInstances); //Instances Textbox
        cy.findElement(background.dataegressTextbox).type(egressPerMonth); //data/Internet Textbox

        //section#4: Additional Information
        cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText);

        // Page#7 : Current Environment Summary
        cy.clickContinueButton(background.additionalInfoTextbox, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.page7Title, bgCEData.CEPage7.pageHeader7);
        cy.textExists(background.introPText, bgCEData.CEPage7.pageText7); 
        //verifyTableData("Location", "CLOUD" + deployedRegionCheckboxesList); //due to bug
        verifyTableData("Location", "ON-PREMISEMISSINGINFO");
        verifyTableData("Classification", impactLevelCheckboxesList);
        verifyTableData("Quantity", noOfInstances);
        verifyTableData("vCPU", noOfVCPUs);
        verifyTableData("Memory", expctedMemory);
        verifyTableData("Storage", expctedStorage);
        verifyTableData("Performance", performanceTierOptionsList);
    })

});