import {
    randomAlphaNumeric,
    randomNumber,
    randomNumberBetween,
    randomString,
} from "../../../helpers";
import background from "../../../selectors/background.sel";
import bgCEData from "../../../fixtures/bgCEData.json";

const fairOpp="none";//none,ja

if(fairOpp==="none"){
require("./04BGProcurementwEP.cy")
}else{
require("./04BGProcurementwJA.cy")
}

describe("Test suite: Step04-Background-Current Environment", () => {
    
    // page#4
    let currentEnvironment = "Cloud"; // "Cloud", "Onpremise" , "Hybrid"
    // when CurrentEnvironment is "Hybrid" choose below:
    let hybridRadioboxes = "Cloud"; // "Cloud", ,"Onpremise"  

    // page#5
    let cloudClassLevelCheckboxes = [ // Cloud computing
        'UnClassifiedCloud',
        'SecretCloud',
        'TSCloud'
    ]
    let unClassLevelCheckboxes = [ //cloud Computing
        'levelIL2',
        'levelIL4',
        'levelIL5'
    ]
    let premUnclassLevelCheckboxes = [ // onPremise
        'unClassifiedPrem',
        'secretPrem',
        'topSecretPrem'
    ]
    let unClassInstancesCheckboxes = [ // onPremise
        'publicRelease',
        'cUI',
        'nationalSecurity'
    ]
    // page#6
    let deployedRegionCheckboxes = [
        'conusEast',
        'conusCentral',
        'conusWest',
        //'africom',
        //'centcom',
        //'eucom',
        //'indopacom',
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

    // page#4
    const currentEnvironmentMap = {
        Cloud: background.cloudComputingRadio,
        Onpremise: background.onPremiseRadio,
        Hybrid: background.hybridRadio
    }
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
    const premUnclassificationLevelMap = { //onPremise
        unClassifiedPrem: background.unClassPremCheckbox,
        secretPrem: background.scPremCheckbox,
        topSecretPrem: background.tsPremCheckbox
    }
    const unClassificationInstancesMap = { //onPremise
        publicRelease: background.publicReleaseCheckbox,
        cUI: background.cUICheckbox,
        nationalSecurity: background.nationalSecurityCheckbox
    }
    // page#6
    const hybridOptionsMap = {
        Cloud: background.cloudRadiobox,
        Onpremise: background.onPremRadiobox,
    }
    const deployedRegionsMap = {
        conusEast: background.conusEastCheckbox,
        conusCentral: background.conusCentralCheckbox,
        conusWest: background.conusWestCheckbox,
        africom: background.africomCheckbox,
        centcom: background.centcomCheckbox,
        eucom: background.eucomCheckbox,
        indopacom: background.indopacomCheckbox,
        southcom: background.southcomCheckbox,
    }
    const regionUsersTextMap = {
        conusEast: background.conusEastTextbox,
        conusCentral: background.conusCentralTextbox,
        conusWest: background.conusWestTextbox,
        africom: background.africomTextbox,
        centcom: background.centcomTextbox,
        eucom: background.eucomTextbox,
        indopacom: background.indopacomTextbox,
        southcom: background.southcomTextbox,
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

    before(() => {
        //Page#1: Do you have a current environment to rehost? Yes No
        cy.radioBtn(background.existYesRadioOption, "YES")
            .click({
                force: true
            });
    });

    // functions for this page:
    // page#5
    function cloudClassificationandImpactLevels() { //cloud computing
        cloudClassLevelCheckboxes.forEach(cloudClassLevelCheckbox => {
            cy.findElement(cloudClassificationLevelMap[cloudClassLevelCheckbox]).click({
                force: true
            });
        });
        unClassLevelCheckboxes.forEach(unClassLevelCheckbox => {
            cy.findElement(unClassificationLevelMap[unClassLevelCheckbox]).click({
                force: true
            });
        });
    }

    function premiseClassificationandImpactLevels() { //onPremise
        premUnclassLevelCheckboxes.forEach(premUnclassLevelCheckbox => {
            cy.findElement(premUnclassificationLevelMap[premUnclassLevelCheckbox]).click({
                force: true
            });
        });
        unClassInstancesCheckboxes.forEach(unClassInstancesCheckbox => {
            cy.findElement(unClassificationInstancesMap[unClassInstancesCheckbox]).click({
                force: true
            });
        });
    }
    //Page#6
    function cloudRegionsDeployed() { //cloud computing
        deployedRegionCheckboxes.forEach(deployedRegionCheckbox => {
            cy.findElement(background.regionDeployedCheckboxes + deployedRegionsMap[deployedRegionCheckbox]).click({
                force: true
            });
        });
    }

    function cloudandPremiseDataClassification() { //cloud &onPremise
        impactLevelCheckboxes.forEach(impactLevelCheckbox => {
            cy.findElement(impactLevelMap[impactLevelCheckbox]).click({
                force: true
            });
        });
    }

    function currentUsageandUsersSection2() { //#Section2: Current usage and users
        cy.findElement(background.regularUsageRadiobox).scrollIntoView();
        if (currentUsage === "evenlyDistributed") {
            cy.radioBtn(background.regularUsageRadiobox, "EVEN_USAGE").click({
                force: true
            });
        } else if (currentUsage == "irregularUsage") {
            cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
                force: true
            });
            if (spikesUsage == "eventBased") {
                cy.findElement(background.eventBasedCheckbox).click({
                    force: true
                });
                cy.findElement(background.highUsageEventTextbox).type(eventCauseText)
            } else if (spikesUsage == "periodBased") {
                cy.findElement(background.certainPeriodCheckbox).click({
                    force: true
                });
                cy.findElement(background.highUsagePeriodTextbox).type(periodCauseText)
            }
        }
        deployedRegionCheckboxes.forEach(deployedRegionCheckbox => {
            cy.findElement(background.regionUsersCheckboxes + deployedRegionsMap[deployedRegionCheckbox]).click({
                force: true
            });
            cy.findElement(regionUsersTextMap[deployedRegionCheckbox]).type(noOfUsers);
        });
    }

    function instanceConfigurationsSection3() { //#Section3 : Instance configurations
        cy.findElement(background.licenseTextbox).type(licensingText);
        cy.findElement(background.numofVCPTextbox).type(noOfVCPUs);
        cy.findElement(background.processorSpeedTextbox).type(precessorSpeed);
        cy.findElement(background.operatingSysTextbox).type(operatingSystemText);
        cy.findElement(background.memoryTextbox).type(memory);
        cy.findElement(background.storageTypeDropdown).click();
        cy.waitUntil(function () {
            return cy.findElement(background.blockStorageOption).should("exist");
        })
        cy.findElement(storageTypeOptionsMap[storageOptions]).click({
            force: true
        });
        cy.findElement(background.storageAmountTextbox).type(storageSize);
        cy.findElement(performanceTierOptionsMap[performanceTierOptions]).click({
            force: true
        });
        cy.findElement(background.instancesTextbox).clear().type(noOfInstances);
        cy.findElement(background.dataegressTextbox).type(egressPerMonth);
    }

    function cloudPricingDetails() { //#Section4 : Pricing Details
        if (currentPayment == "reserved") {
            cy.findElement(background.reservedRadiobox).click({
                force: true
            });
            cy.selectDatefromDatePicker(
                background.reservedExpirationDatePicker, background.reservedNavigateNextMonth,
                background.selectDate, expirationDate, background.datePicker
            );
        } else if (currentPayment == "payAsyouGo") {
            cy.findElement(background.payAsYouGoRadiobox).click({
                force: true
            });
        }
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

    function verifyEnvironmentType() {
        let environmentType = "";
        if (currentEnvironment === "Cloud") {
            environmentType = "Cloud Environment";
        } else if (currentEnvironment === "Onpremise") {
            environmentType = "On-premise Environment";
        } else if (currentEnvironment == "Hybrid") {
            environmentType = "Hybrid Environment";
        }
        return environmentType;
    }

    it("TC1: Current Environment: E2E Happy path", () => {       

        // Page#2: Do you have system diagrams, data architecture diagrams, charts etc..? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage2.pageHeader2)
        cy.radioBtn(background.systemDocsYesRadioBtn, "YES")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile("cypress/fixtures/files/testFileSysDiagram.docx", {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        })

        // Page#3: Have you completed a migration assessment, analysis, or process to identify the cloud services and tools needed?  
        cy.clickContinueButton(background.systemDocsYesRadioBtn, bgCEData.CEPage3.pageHeader3);
        cy.radioBtn(background.existYesRadioOption, "YES")
            .click({
                force: true
            });
        cy.findElement(background.uploadFileSysDiagram).selectFile("cypress/fixtures/files/testMigration.xlsx", {
            force: true
        });
        cy.waitUntil(function () {
            return cy.findElement(background.removeFile1).should("exist");
        });

        // Page#4 : Where is your current environment located? 
        cy.clickContinueButton(background.existYesRadioOption, bgCEData.CEPage4.pageHeader4);
        cy.findElement(currentEnvironmentMap[currentEnvironment]).click({ //Cloud computing //On premise //Hybrid environment
            force: true
        });
        cy.clickContinueButton(background.cloudComputingRadio, bgCEData.CEPage5.pageHeader5);
        if (currentEnvironment == "Cloud") { //cloud computing
            cloudClassificationandImpactLevels(); //page#5
            cy.clickContinueButton(background.unClassCloudCheckbox, bgCEData.CEPage6.pageHeader6); //page#6
            cloudRegionsDeployed(); //section#1
            cloudandPremiseDataClassification(); //section#1
            currentUsageandUsersSection2(); //section#2
            instanceConfigurationsSection3(); //section#3
            cloudPricingDetails(); //section#4
            cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText); //#Section5

        } else if (currentEnvironment == "Onpremise") { //onPremise
            premiseClassificationandImpactLevels() //page#5
            cy.clickContinueButton(background.unClassPremCheckbox, bgCEData.CEPage6.pageHeader6); //page#6
            cloudandPremiseDataClassification(); //section#1
            currentUsageandUsersSection2(); //section#2
            instanceConfigurationsSection3(); //section#3
            cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText); //#Section5

        } else if (currentEnvironment == "Hybrid") { //hybrid
            cloudClassificationandImpactLevels(); // page#5 -cloud computing
            premiseClassificationandImpactLevels() // page#5- onPremise
            cy.clickContinueButton(background.unClassPremCheckbox, bgCEData.CEPage6.pageHeader6); //page#6
            cy.findElement(hybridOptionsMap[hybridRadioboxes]).click({
                force: true
            });
            if (hybridRadioboxes == 'Cloud') { //cloud
                cloudRegionsDeployed(); //section#1
                cloudandPremiseDataClassification(); //section#1
                currentUsageandUsersSection2(); //section#2
                instanceConfigurationsSection3(); //section#3
                cloudPricingDetails(); //section#4
                cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText); //#Section5

            } else if (hybridRadioboxes == 'Onpremise') { //onPremise
                cloudandPremiseDataClassification(); //section#1
                currentUsageandUsersSection2(); //section#2
                instanceConfigurationsSection3(); //section#3
                cy.findElement(background.additionalInfoTextbox).click().type(additionalInformationText); //#Section5
            }
        }

        // Page#7 : Current Environment Summary
        cy.clickContinueButton(background.additionalInfoTextbox, bgCEData.CEPage7.pageHeader7);

        cy.findElement(background.summaryEnvironmentType).contains(verifyEnvironmentType());
        if ((currentEnvironment === "Cloud")) {
            verifyTableData("Location", deployedRegionCheckboxesList);
        }
        if ((currentEnvironment === "Hybrid") && (hybridRadioboxes == "Cloud")) {
            verifyTableData("Location", "CLOUD" + deployedRegionCheckboxesList);
        }
        verifyTableData("Classification", impactLevelCheckboxesList);
        verifyTableData("Quantity", noOfInstances);
        verifyTableData("vCPU", noOfVCPUs);
        verifyTableData("Memory", expctedMemory);
        verifyTableData("Storage", expctedStorage);
        verifyTableData("Performance", performanceTierOptionsList);
    });

});