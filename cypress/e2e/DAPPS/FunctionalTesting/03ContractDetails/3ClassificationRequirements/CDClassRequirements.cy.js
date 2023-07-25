import {
    randomString,
    randomNumber,
    randomAlphaNumeric,
    suffixId,

} from "../../../../../helpers";
import common from "../../../../../selectors/common.sel";
import contractDetails from "../../../../../selectors/contractDetails.sel";
import securityRequirements from "../../../../../fixtures/securityRequirement.json";
import CDData from '../../../../../fixtures/ContractDetailsData/CDData.json';

describe("Test suite: Functional Testing - 03 Contract Details> ClassificationRequirements", () => {

    let pt = "TC-Step-3-ContractDetails-ClassLevel-" + randomAlphaNumeric(5);
    let scope = "Project Scope-" + randomString(5);

    let classInput = randomNumber(2);
    const projectFSText = "Test Projected FileStream - " + randomAlphaNumeric(3);
    const anticipatedText = "Test Anticipated Usage Textbox - " + randomAlphaNumeric(17);
   
    beforeEach(() => {
        cy.goToAcqPackageStepOne(pt, scope);
        cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
        cy.activeStep(common.stepContractDetailsText);
        cy.clickSideStepper(common.subStepClassReqsLink, " Classification Requirements ");
    });

    it("TC1: Functional Testing: Screen Validation: Classification Requirements", () => {

        cy.log(" TestReport: Step3-ContractDetails-Classification Requirements Functional Testing start ") // select all check boxes in page#1
        cy.log(" TestReport: Verify header and text messages and select all check boxes in Page#1 ")
        cy.verifyPageHeader(CDData.classLevelPage1.pageHeaderCL1);
        cy.verifyTextMatches(contractDetails.introPText, CDData.classLevelPage1.expectedintroText);
        cy.textExists(contractDetails.selectMess, CDData.classLevelPage1.selectALLMsgCLPage);
        cy.verifyCheckBoxLabels(contractDetails.classCheckBoxes, CDData.classLevelPage1.expectedLabels);
        cy.get(contractDetails.classCheckBoxes).should("not.be.checked").check({
            force: true
          }).should("be.checked");
        cy.verifyTextMatches(contractDetails.alertMessage, CDData.classLevelPage1.alertMessage);
        cy.clickContinueButton(contractDetails.ts, CDData.classLevelPage2.pageHeaderCL2);

        cy.log(" TestReport: Verify header and text messages and select all check boxes in Page#2 ") // select all check boxes in page#2
        cy.verifyPageHeader(CDData.classLevelPage2.pageHeaderCL2);
        cy.verifyTextMatches(contractDetails.introPText, CDData.classLevelPage2.cspMessage);
        cy.textExists(contractDetails.messageSecret, CDData.classLevelPage2.scSection);
        cy.textExists(contractDetails.messageNoteSecret, CDData.classLevelPage2.selectALLSecretMsg);
        cy.verifyCheckBoxLabels(contractDetails.secretCheckbox, securityRequirements.secret.checkboxes);
        cy.get(contractDetails.secretCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.textExists(contractDetails.messageTopSecret, CDData.classLevelPage2.tsSection);
        cy.textExists(contractDetails.messageNoteTopSecret, CDData.classLevelPage2.selectALLTopSecretMsg);
        cy.verifyCheckBoxLabels(contractDetails.tsCheckbox, securityRequirements.topSecret.checkboxes);
        cy.get(contractDetails.tsCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.clickContinueButton(contractDetails.introPText, CDData.classLevelPage3.pageHeaderCL3);

        cy.log(" TestReport: Verify header and text messages and select all check boxes in Page#3 ") // select all check boxes in page#3
        cy.verifyPageHeader(CDData.classLevelPage3.pageHeaderCL3);
        cy.findElement(contractDetails.cdsNoOption)
            .click({
                force: true
            })
            .then(() => {
                cy.findElement(contractDetails.cds).should("not.exist");
            });

        cy.findElement(contractDetails.cdsYesOption)
            .click({
                force: true
            })
            .then(() => {
                cy.findElement(contractDetails.cds).should("be.visible");
            });
        cy.textExists(contractDetails.cdsLabel, CDData.classLevelPage3.cdsLabelTxt)
        cy.textExists(contractDetails.cdsLabel2, CDData.classLevelPage3.cdsLabelTxt2); 
        cy.verifyCheckBoxLabels(contractDetails.cdsCheckbox, securityRequirements.classCDS.checkboxes);

         cy.get(contractDetails.cdsCheckbox).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.enterTextInTextField(contractDetails.cdsUtoSTxtbox, classInput);
        cy.enterTextInTextField(contractDetails.cdsTxtbox, classInput);
        cy.enterTextInTextField(contractDetails.cdsStoUTxtbox, classInput);
        cy.enterTextInTextField(contractDetails.cdsStoTSTxtbox, classInput);
        cy.enterTextInTextField(contractDetails.cdsTStoUTxtbox, classInput);
        cy.enterTextInTextField(contractDetails.cdsTStoSTxtbox, classInput);

        cy.textExists(contractDetails.projectedFSFieldLabel, CDData.classLevelPage3.projectFSFieldLabel)
        cy.enterTextInTextField(contractDetails.projectedFSField, projectFSText);

        //verify lables
        cy.textExists(contractDetails.anticipatedFieldLabel, CDData.classLevelPage3.anticipatedLabel1)
        cy.textExists(contractDetails.anticipatedFieldLabel2, CDData.classLevelPage3.anticipatedLabel2);
        cy.enterTextInTextField(contractDetails.anticipatedTxtbox, anticipatedText);

        cy.textExists(contractDetails.basePeriodLabel1, CDData.classLevelPage3.baseLabel1)
        cy.radioBtn(contractDetails.entiredDurationYes, "YES").not("[disabled]").click({
            force: true
        });
        cy.radioBtn(contractDetails.entiredDurationNo, "NO").not("[disabled]").click({
            force: true
        });
        cy.textExists(contractDetails.basePeriodLabel2, CDData.classLevelPage3.baseLabel2)
       // cy.verifyCheckBoxLabels(contractDetails.basePeriodCheckbox,"Base period")
        cy.clickContinueButton(contractDetails.entiredDurationNo, CDData.classificationSummary.pageHeaderSummary);
    });


    // Skipped due to Bug#AT-9419
    it.skip("TC2: Functional Testing: Message Validations: Classification Requirements", () => {

        //Page#1
        cy.findElement(contractDetails.level2).should("not.be.checked");
        cy.findElement(contractDetails.level4).should("not.be.checked")
        cy.findElement(contractDetails.level5).should("not.be.checked")
        cy.findElement(contractDetails.level6).should("not.be.checked")
        cy.findElement(contractDetails.ts).should("not.be.checked")
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(contractDetails.errorClassCheckBox, "Please select at least one classification level.");
        cy.findElement(contractDetails.level5).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.findElement(contractDetails.ts).should("not.be.checked").check({
            force: true
        }).should("be.checked");
        cy.clickContinueButton(contractDetails.ts, CDData.classLevelPage1.pageHeaderCL2);

        //Page#2
        cy.btnClick(common.continueBtn, " Continue ");
        cy.checkErrorMessage(contractDetails.errorClassCheckBox, "Please select at least one classification level.");
        //cy.selectCheckBoxes([scCheckbox1, scCheckbox4]);
        //cy.selectCheckBoxes([tsCheckbox1, tsCheckbox3]);
        cy.clickContinueButton(contractDetails.ts, CDData.classLevelPage1.pageHeaderCL2);

        //Page#3
        cy.verifyRequiredRadioBtn(contractDetails.cdsNoOption, contractDetails.cdsRadioOptionError, "Please select Yes or No.");
        cy.findElement(contractDetails.cdsYesOption).click({
            force: true
        });
        cy.verifyRequiredCheckbox(contractDetails.unclastoSecrCB, contractDetails.cdsDomainPairError, "Please select at least one type of cross-domain solution.");
        cy.selectCheckBoxes([contractDetails.unclastoSecrCB]).then(() => {
            cy.verifyRequiredInput(contractDetails.cdsUtoSTxtbox, contractDetails.cdsDPTxtbox0Error, "Enter the approximate quantity of data/month.");
        });
        cy.verifyRequiredInput(contractDetails.projectedFSField, contractDetails.projectedFSError, "Enter a projected file stream/type");
        cy.verifyRequiredInput(contractDetails.anticipatedTxtbox, contractDetails.anticipatedTxtboxError, "Provide your statement of objective.");
        cy.verifyRequiredRadioBtn(contractDetails.entiredDurationNo, contractDetails.entiredDurationError, "Please select an option.");
        cy.verifyRequiredCheckbox(contractDetails.entiredDurationNo, contractDetails.basePeriodCheckboxError, "Please select at least one base or option period.");
    });

   

});