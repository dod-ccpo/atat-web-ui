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
    
    let storageOptions = ['Object' //Block, Object, File, Archive
    ]
    let performanceTierOptions = ['computeOptimized' //generalPurpose, computeOptimized, memoryOptimized, storageOptimized
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
    const cloudClassificationLevelMap = { //cloud computing
        UnClassifiedCloud: background.unClassCloudCheckbox,
        SecretCloud: background.scCloudCheckbox,
        TSCloud: background.tsCloudCheckbox
    }
    const unClassificationLevelMap = { //cloud computing
        levelIL2: background.level2Checkbox,
        levelIL4: background.level4Checkbox,
        levelIL5: background.level5Checkbox
    }
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

     
    function cloudandPremiseDataClassification() { //cloud &onPremise
        impactLevelCheckboxes.forEach(impactLevelCheckbox => {
            cy.findElement(impactLevelMap[impactLevelCheckbox]).click({
                force: true
            });
        });
    }
    function verifyTableData(columnHeader, expectedValue) {
        cy.findElement(background.summaryCETableHeader).each(($el, index, $list) => {
            const text = $el.text();
            if (text.includes(columnHeader)) {
                cy.findElement(background.summaryCETableData).eq(index).then(function (value) {
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

    it("TC1: Current Environment: Functional Testcase- Screen Validation Pages1-5", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage1.pageText1);
        cy.verifyRadioGroupLabels(background.existingEnvNoRadioGroup, bgCEData.CEPage1.section1Radioboxes);
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage2.pageText2);
        cy.verifyRadioGroupLabels(background.existingEnvNoRadioGroup, bgCEData.CEPage2.section1Radioboxes);
        //Select Yes, upload one file, remove same file and upload again
        cy.radioBtn(background.systemDocsYesRadioBtn, "YES")
            .click({
                force: true
            });
        cy.findElement(background.fileUploadSection).should("exist").and("be.visible");
        cy.findElement(background.dragandDropText).should("contain.text", bgCEData.CEPage2.dragandDropText);
        cy.findElement(background.browsetoUploadText).should("contain.text", bgCEData.CEPage2.browseToUploadText);
        cy.findElement(background.supportFileText).should("contain.text", bgCEData.CEPage2.supportedFileTypes);
        cy.findElement(background.uploadFileSysDiagram).selectFile(docFile, {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        })
        //remove the file, verify file is removed and upload again
        cy.findElement(background.removeFile1).click().then(() => {
            cy.findElement(background.removeFile1).should("not.exist");
        })
        //upload again
        cy.findElement(background.uploadFileSysDiagram).selectFile(docFile, {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        })

        // Page#3:  Have you completed a migration assessment, analysis, or process to identify the cloud services and tools needed?  
        cy.clickContinueButton(background.systemDocsYesRadioBtn, bgCEData.CEPage3.pageHeader3);
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage3.pageText3);
        cy.verifyRadioGroupLabels(background.existingEnvNoRadioGroup, bgCEData.CEPage2.section1Radioboxes);
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
        cy.findElement(background.fileLinkFile1).should("exist").contains("dd1155.pdf");
        cy.findElement(background.fileLinkFile2).should("exist").contains("testMigration.xlsx");
        //remove one file, verify file is removed
        cy.findElement(background.removeFile1).click().then(() => {
            cy.findElement(background.removeFile2).should("not.exist");
        })

        // Page#4 :  Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage4.pageText4);
        cy.verifyRadioGroupLabels(background.envLocationRadioGroup, bgCEData.CEPage4.section1Radioboxes);
        cy.radioBtn(background.cloudComputingRadio, "CLOUD")
            .not("[disabled]").and("not.checked").click({
                force: true
            });
        cy.radioBtn(background.onPremiseRadio, "ON_PREM")
            .not("[disabled]").and("not.checked").click({
                force: true
            });
        cy.radioBtn(background.hybridRadio, "HYBRID")
            .not("[disabled]").and("not.checked").click({
                force: true
            });
        cy.radioBtn(background.cloudComputingRadio, "CLOUD").click({
            force: true
        });

        // Page#5 :Tell us about your current data classification and impact levels 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage5.pageHeader5);
        cy.verifyTextMatches(background.introPText, bgCEData.CEPage5.pageText5);
        cy.textExists(background.classificationText, bgCEData.CEPage5.pageClassQuestion1);
        cy.textExists(background.classificationMessage, bgCEData.CEPage5.pageSelectALLMsg);
        cy.verifyCheckBoxLabels(background.unClassCloudCheckboxes, bgCEData.CEPage5.expectedLabelsCL);
        cy.findElement(background.unClassCloudCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.textExists(background.unClassificationText, bgCEData.CEPage5.pageClassQuestion2);
        cy.textExists(background.unClassificationMessage, bgCEData.CEPage5.pageSelectALLMsg);
        cy.verifyCheckBoxLabels(background.CloudClassificationCheckboxes, bgCEData.CEPage5.expectedLabelsUnCL);
        cy.findElement(background.CloudClassificationCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");

        // Page # 6-8 validations in next test case

    })

    it("TC2: Current Environment: Functional Testcase- Screen Validation pages 6-8", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        cy.radioBtn(background.systemDocsNoRadioBtn, "NO")
            .click({
                force: true
            });

        // Page#3:  Have you completed a migration assessment, analysis, or process to identify the cloud services and tools needed?  
        cy.clickContinueButton(background.systemDocsYesRadioBtn, bgCEData.CEPage3.pageHeader3);
        cy.radioBtn(background.existNoRadioOption, "NO").not("[disabled]").and("not.checked")
            .click({
                force: true
            });

        // Page#4 :  Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.radioBtn(background.cloudComputingRadio, "CLOUD").click({
            force: true
        });

        // Page#5 :Tell us about your current data classification and impact levels 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage5.pageHeader5);
        cy.findElement(background.unClassCloudCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(background.CloudClassificationCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");

        // Page#6 : Let’s start gathering details about each instance in your environment 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage6.pageHeader6);
        cy.verifyPageHeader(bgCEData.CEPage6.pageHeader6);
        cy.verifyTextMatches(background.page6TitleText, bgCEData.CEPage6.pageText6);

        //section#1:  1. Tell us about Instance #1 
        cy.textExists(background.section1Question1, bgCEData.CEPage6.section1Question1);
        cy.findElement(background.regionDeployedAllCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.textExists(background.section1Question2, bgCEData.CEPage6.section1Question2);
        cy.verifyRadioGroupLabels(background.classificationRadioGroup, bgCEData.CEPage6.section1Radioboxes);
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
        cy.findElement(background.spikesCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.textExists(background.highUsageEventTextboxLable, bgCEData.CEPage6.eventMessage);
        cy.findElement(background.highUsageEventTextbox).type(eventCauseText)
        cy.textExists(background.highUsagePeriodTextboxLable, bgCEData.CEPage6.periodMessage);
        cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText)
        cy.textExists(background.section2Question3, bgCEData.CEPage6.section2Question3);
        cy.textExists(background.section2Message, bgCEData.CEPage6.section2Message);
        cy.findElement(background.regionUsersAllCheckboxes).should("not.be.checked").check({
            force: true
        }).should("be.checked");
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
        cy.textExists(background.licenseTextboxLable, bgCEData.CEPage6.licensingTextboxLable);
        cy.findElement(background.licenseTextbox).type(licensingText)

        cy.textExists(background.numofVCPTextboxLable, bgCEData.CEPage6.vCPsTextboxLable); //numOfVCPUs Textbox
        cy.findElement(background.numofVCPTextbox).type(noOfVCPUs)

        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.textExists(background.processorSpeedTextboxLable, bgCEData.CEPage6.processorTextboxLable); //Processor Speed Textbox
        cy.findElement(background.processorSpeedTextbox).type(precessorSpeed)

        cy.findElement(background.licenseTextboxLable).scrollIntoView();
        cy.textExists(background.operatingSysTextboxLable, bgCEData.CEPage6.operatingSytemTextboxLable); //Operating System Textbox
        cy.findElement(background.operatingSysTextbox).type(operatingSystemText)

        cy.textExists(background.memoryTextboxLable, bgCEData.CEPage6.memoryTextboxLable); //Memory Textbox
        cy.findElement(background.memoryTextbox).type(memory)

        cy.textExists(background.storageTypeLable, bgCEData.CEPage6.storageTypeTextboxLable); // storage type dropdown
        cy.findElement(background.storageTypeDropdown).click();
        cy.waitUntil(function () {
            return cy.findElement(background.blockStorageOption).should("exist");
        })
        cy.findElement(storageTypeOptionsMap[storageOptions]).click({
            force: true
        });
        cy.findElement(background.blockStorageOption).should("contain.text", " Block storage ");
        cy.findElement(background.blockStorageOption + background.storageSubtitle).should("contain.text", bgCEData.CEPage6.blockStorageSubtitle);

        cy.findElement(background.objectTypeStorageOption).should("contain.text", " Object storage ");
        cy.findElement(background.objectTypeStorageOption + background.storageSubtitle).should("contain.text", bgCEData.CEPage6.objectStorageSubtitle);

        cy.findElement(background.fileStorageOption).should("contain.text", " File storage ");
        cy.findElement(background.fileStorageOption + background.storageSubtitle).should("contain.text", bgCEData.CEPage6.fileStorageSubtitle);

        cy.findElement(background.archiveStorageOption).should("contain.text", " Archive storage ");
        cy.findElement(background.archiveStorageOption + background.storageSubtitle).should("contain.text", bgCEData.CEPage6.archiveStorageSubtitle);

        cy.findElement(background.storageSizeLable).scrollIntoView();
        cy.textExists(background.storageSizeLable, bgCEData.CEPage6.storageSizeTextLable); // storage size
        cy.findElement(background.storageSizeField + background.byteSizeDropdown).click(); //dropdownGB
        cy.waitUntil(function () {
            return cy.findElement(background.storageSizeField + background.gigabyteOption).should("exist");
        })
        cy.findElement(background.storageSizeField + background.gigabyteOption).should("contain.text", " Gigabyte (GB) ");
        cy.findElement(background.storageSizeField + background.terabyteOption).should("contain.text", " Terabyte (TB) ");
        cy.findElement(background.storageSizeField + background.petayteOption).should("contain.text", " Petabyte (PB) ");
        cy.findElement(background.storageSizeField + background.gigabyteOption).click({
            force: true
        });
        cy.findElement(background.storageAmountTextbox).type(storageSize)

        cy.textExists(background.performanceTiertitle, bgCEData.CEPage6.performanceTierLable); //Performance Tier
        cy.verifyRadioGroupLabels(background.performanceTierRadioGroup, bgCEData.CEPage6.performanceRadioboxes); //failing?
        cy.findElement(performanceTierOptionsMap[performanceTierOptions]).click({
            force: true
        });

        cy.textExists(background.instancesTextboxLable, bgCEData.CEPage6.instancesTextboxLable); //Instances Textbox
        cy.findElement(background.instancesTextbox).clear().type(noOfInstances);

        cy.textExists(background.dataegressTextboxLable, bgCEData.CEPage6.monthlyDataTextboxLable); //data/Internet Textbox
        cy.findElement(background.dataegressTextbox).type(egressPerMonth);

        //section#4: Pricing Details
        cy.textExists(background.section4Message, bgCEData.CEPage6.section4Legend);
        cy.findElement(background.section4Message).scrollIntoView();
        cy.verifyRadioGroupLabels(background.currentPaymentRadioGroup, bgCEData.CEPage6.section4Radioboxes);
        cy.radioBtn(background.payAsYouGoRadiobox, "PAY_AS_YOU_GO").click({
            force: true
        });
        cy.radioBtn(background.reservedRadiobox, "PREPAID").click({
            force: true
        });
        cy.selectDatefromDatePicker(
            background.reservedExpirationDatePicker, background.reservedNavigateNextMonth,
            background.selectDate, expirationDate, background.datePicker
        );
        
        //section#5: Additional Information
        cy.textExists(background.section5Question, bgCEData.CEPage6.section5Question);
        cy.textExists(background.section5Note, bgCEData.CEPage6.section5Note);
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

    it("TC3: Current Environment: Functional Testcase- No flow", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage1.pageText1);

        //select No and verify the continue button takes to Performance step
        cy.radioBtn(background.existNoRadioOption, "NO")
            .not("[disabled]").and("not.checked").click({
                force: true
            });
        cy.clickContinueButton(background.existNoRadioOption, bgCEData.PerformanceStartPage.pageHeader8);
        // navigating back to CurrentEnvironment page#1
        cy.btnClick(background.backBtntoStep4, "Back to Step 4");
        cy.clickSideStepper(common.substepCurrentEnvironmentLink, " Current Environment ");
        cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
        cy.radioBtn(background.existYesRadioOption, "YES")
            .click({
                force: true
            });

        // Page#2: Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        cy.radioBtn(background.systemDocsNoRadioBtn, "NO")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#3:  Have you completed a migration assessment,analysis,orprocess to identify the cloud services tools needed? Yes No
        cy.clickContinueButton(background.systemDocsNoRadioBtn, bgCEData.CEPage3.pageHeader3);
        cy.verifyTextMatches(background.recurringPageText, bgCEData.CEPage3.pageText3);
        cy.radioBtn(background.existNoRadioOption, "NO")
            .not("[disabled]").and("not.checked").click({
                force: true
            });
        cy.clickContinueButton(background.existNoRadioOption, bgCEData.CEPage4.pageHeader4);
    })

    it("TC4: Current Environment: Functional Testcase- Error message validation", () => {

        //Page#1: Do you have a current environment to rehost? Yes No
        cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
        cy.radioBtn("#developerToggleButton", "").click({
            force: true
        });
        cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage1.errorMessageText);
        cy.screenshot(" Page#1 screen is");
        cy.radioBtn(background.existYesRadioOption, "YES")
            .not("[disabled]").and("not.checked").click({
                force: true
            });

        // Page#2:  Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage1.errorMessageText);
        //Select Yes, do NOT upload the file and click continue
        cy.radioBtn(background.systemDocsYesRadioBtn, "YES")
            .click({
                force: true
            });
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage2.uploadMessageText);
        cy.screenshot(" Page#2 screen is");
        cy.radioBtn(background.systemDocsNoRadioBtn, "NO").click({
            force: true
        });

        // Page#3:  Have you completed a migration assessment,analysis,orprocess to identify the cloud services tools needed? Yes No
        cy.clickContinueButton(background.systemDocsYesRadioBtn, bgCEData.CEPage3.pageHeader3);
        cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage1.errorMessageText);
        //Select Yes, upload txt file and click continue 
        cy.radioBtn(background.existYesRadioOption, "YES")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile(txtFile, {
            force: true
        });
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage2.uploadMessageText);
        cy.radioBtn(background.existYesRadioOption, "YES")
            .click({
                force: true
            });

        // Page#4 : Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage4.environmentMessageText);
        cy.radioBtn(background.cloudComputingRadio, "CLOUD").click({ //Cloud computing //On premise //Hybrid environment
            force: true
        });

        // Page#5 :  Tell us about your current data classification and impact levels 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage5.pageHeader5);
        cy.btnClick(common.continueBtn, " Continue "); // no selection, error message
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage5.classificationMessageText);
        // cloud Environment
        cloudClassLevelCheckboxes.forEach(cloudClassLevelCheckbox => {
            cy.findElement(cloudClassificationLevelMap[cloudClassLevelCheckbox]).click({
                force: true
            });
        });
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(background.errorMessage, bgCEData.CEPage5.impactLevelMessageText);

        unClassLevelCheckboxes.forEach(unClassLevelCheckbox => {
            cy.findElement(unClassificationLevelMap[unClassLevelCheckbox]).click({
                force: true
            });
        });

        // Page#6 : Let’s start gathering details about each instance in your environment 
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage6.pageHeader6);

        //Section#1
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(background.classandImpactErrorMessage, bgCEData.CEPage6.classificationImpactMessageText);

        //Section#2
        cy.checkErrorMessage(background.currentUsageErrorMessage, bgCEData.CEPage6.currentUsageMessageText);
        cy.checkErrorMessage(background.regionsErrorMessage, bgCEData.CEPage6.regionMessageText);
        cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
            force: true
        });
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(background.spikesCausesErrorMessage, bgCEData.CEPage6.spikesCausesMessageText);
        cy.findElement(background.spikesCheckboxes).check({
            force: true
        }).should("be.checked");
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(background.highUsageEventErrorMessage, bgCEData.CEPage6.highUsageEventMessageText);
        cy.checkErrorMessage(background.highUsagePeriodErrorMessage, bgCEData.CEPage6.highUsagePeriodMessageText);
        cy.findElement(background.highUsageEventTextbox).type(eventCauseText)
        cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText)

        //Section#3
        cy.findElement(background.licensingErrorMessage).scrollIntoView();
        cy.checkErrorMessage(background.licensingErrorMessage, bgCEData.CEPage6.licensingMessageText);
        cy.checkErrorMessage(background.noofVCPErrorMessage, bgCEData.CEPage6.vCPUSMessageText);
        cy.checkErrorMessage(background.processorSpeedErrorMessage, bgCEData.CEPage6.processorSpeedMessageText);
        cy.checkErrorMessage(background.operatingSysErrorMessage, bgCEData.CEPage6.operatingSystemMessageText);
        cy.checkErrorMessage(background.memoryErrorMessage, bgCEData.CEPage6.memoryMessageText);
        cy.checkErrorMessage(background.storageTypeErrorMessage, bgCEData.CEPage6.storageTypeMessageText);
        cy.findElement(background.storageSizeErrorMessage).scrollIntoView();
        cy.checkErrorMessage(background.storageSizeErrorMessage, bgCEData.CEPage6.storageSizeMessageText);
        cy.checkErrorMessage(background.performanceTierErrorMessage, bgCEData.CEPage6.performanceTierMessageText);
        cy.checkErrorMessage(background.monthlyDataErrorMessage, bgCEData.CEPage6.monthlyDataMessageText);

        //Section#4
        cy.findElement(background.pricingModelErrorMessage).scrollIntoView();
        cy.checkErrorMessage(background.pricingModelErrorMessage, bgCEData.CEPage6.pricingModelMessageText);
        cy.radioBtn(background.reservedRadiobox, "PREPAID").click({
            force: true
        });
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(background.expirationDateErrorMessage, bgCEData.CEPage6.expirationMessageText);
        cy.selectDatefromDatePicker(
            background.reservedExpirationDatePicker, background.reservedNavigateNextMonth,
            background.selectDate, expirationDate, background.datePicker
        );
         cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText); //#Section5
      
    })

});