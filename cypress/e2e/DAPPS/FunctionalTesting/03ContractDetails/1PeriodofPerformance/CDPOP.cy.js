import {
    randomNumberBetween,
    randomAlphaNumeric,
    randomString
} from "../../../../../helpers";
import common from "../../../../../selectors/common.sel";
import contractDetails from "../../../../../selectors/contractDetails.sel";
import CDData from '../../../../../fixtures/ContractDetailsData/CDData.json';

describe("Test suite: Functional Testing - 03 Contract Details> Period of Performance", () => {

    let pt = " TC-Step-3-ContractDetails-E2E-" + randomAlphaNumeric(5);
    let scope = "Project Scope-" + randomString(5);
    let foundDropdownItems = 0
    let option;
    const randomMonth = randomNumberBetween(1, 12);
    const optionYear = 1;


    beforeEach(() => {
        cy.goToAcqPackageStepOne(pt, scope);
        cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
        cy.activeStep(common.stepContractDetailsText);
        cy.clickSideStepper(common.subStepPopLink, " Period of Performance ");
    });

    it("TC1: Functional Testing: Screen Validation: Period of Performance", () => {

        //Page#1 validations starts
        cy.log(" TestReport: Step3-ContractDetails-Period of Performance Functional Testing start ")
        cy.verifyPageHeader(CDData.POPPage1.pageHeader1);
        cy.verifyTextMatches("p.mb-10", CDData.POPPage1.expectedPOPText);
        cy.findElement(contractDetails.popLearnMoreLink).should("exist");
        cy.textExists(contractDetails.popLengthLabelText, CDData.POPPage1.popLengthLabel);

        cy.log(" TestReport: Verify Base and dropdown fields");
        cy.textExists(contractDetails.baseLabelText, "Base");
        cy.findElement(contractDetails.baseInputTxtBox).should("exist");
        cy.defaultPoPLengthValue(contractDetails.baseInputTxtBox, contractDetails.baseDropdownDefault);
        cy.findElement(contractDetails.baseDropdownIcon).click();
        let expOptions = CDData.POPPage1.expectedOptions
        cy.findElement(contractDetails.baseDropdownList).children().each(($el) => {
            const text = $el.text();
            if (expOptions.indexOf(text) > -1) {
                foundDropdownItems++
            }
            return foundDropdownItems === expOptions.length;
        });
        cy.log(" TestReport: Verify Add option link and delete option record");
        cy.findElement(contractDetails.baseDuplicateButton).should("not.be.disabled");
        cy.findElement(contractDetails.baseDeleteButton).should("be.disabled")
        cy.findElement(contractDetails.addOptionLink).should("exist").click();
        cy.defaultPoPLengthValue(contractDetails.optionalTextBox, contractDetails.optionOneDropdownDefault);
        cy.popLengthOptionYearExists();
        cy.findElement(contractDetails.baseDeleteButton).click();

        cy.log(" TestReport: Verify add duplicate, option text box and dropdown");
        cy.findElement(contractDetails.baseDropdownIcon).click();
        cy.findElement(contractDetails.baseDropdownMonth).click();
        cy.findElement(contractDetails.baseInputTxtBox).clear().type(randomMonth);
        cy.findElement(contractDetails.baseDuplicateButton).click({
                force: true
            })
            .then(() => {
                cy.findElement(contractDetails.optionalTextBox).should("exist")
                    .and("have.value", randomMonth)
                cy.findElement(contractDetails.optionOneDropdownSelected).should("exist")
                    .and("have.text", "Month(s)")
            });

        cy.log(" After Drag and Drop , Base' textbox has 'Option#2' value &'Option#2' textbox has 'Base' value");
        cy.findElement(contractDetails.addOptionLink).should("exist").click();
        cy.findElement(contractDetails.optionalTwoTextBox).clear().type(optionYear);
        cy.findElement(contractDetails.sourceItem)
            .drag(contractDetails.targetItem)
            .then((success) => {
                assert.isTrue(success)
                cy.findElement(contractDetails.sourceItem).trigger("dragend");
            });
        cy.findElement(contractDetails.optionalTwoTextBox).should("have.value", randomMonth);
        cy.findElement(contractDetails.baseInputTxtBox).should("have.value", optionYear);
        cy.log(" TestReport: Step3-ContractDetails-Period of Performance Page#1 Functional Testing complete ")


        //Page2- POP Start Date validations starts ********************
        cy.log("verify page2 fields- POP Start Date")
        cy.clickContinueButton(contractDetails.baseInputTxtBox, CDData.POPPage2.pageHeader2);
        cy.verifyTextMatches(contractDetails.popText, CDData.POPPage2.expectedPOPText);

        cy.log(" TestReport: Verify radio button options exists and click- Yes/No options ")
        cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES")
            .not("[disabled]").and("not.checked");
        cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO")
            .not("[disabled]").and("not.checked")
        cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO").click({
            force: true
        });
        cy.findElement(contractDetails.requestedStartDate).should("not.exist")
        cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").click({
            force: true
        });
        cy.log(" TestReport: Verify Request Start Date options - Select No sooner than ")
        cy.findElement(contractDetails.requestedStartDate).should("exist");
        cy.findElement(contractDetails.requestedStartDropdownIcon).click();
        cy.verifyStringArray(contractDetails.requestedStartDropdownList, CDData.POPPage2.listOptions);
        cy.findElement(contractDetails.requestedStartDateNosoonerthan).click();
        cy.selectDatefromDatePicker(contractDetails.calendarIcon, contractDetails.navigateNextMonth,
            contractDetails.selectDate, "11", contractDetails.datePicker);
        cy.log(" TestReport: Verify Request Start Date options - Select Not later than  ")
        cy.findElement(contractDetails.requestedStartDropdownIcon).click();
        cy.findElement(contractDetails.requestedStartDateNotlaterthan).click().then(() => {
            cy.findElement(contractDetails.warningTextMessage).should("exist");
        });
        cy.verifyTextMatches(contractDetails.warningTextMessage, CDData.POPPage2.expectedWarningMessageNLT);
        cy.selectDatefromDatePicker(
            contractDetails.calendarIcon,
            contractDetails.navigateNextMonth,
            contractDetails.selectDate,
            "13",
            contractDetails.datePicker
        );
        cy.log(" TestReport: Step3-ContractDetails-Period of Performance Page#2 Functional Testing complete ")


        //Page3- Recurring Requirementvalidations start ********************
        cy.log(" TestReport: verify page3 fields- Recurring Requirement ")
        cy.clickContinueButton(contractDetails.popStartDateNoRadioOption, CDData.POPPage3.pageHeader3);
        cy.verifyTextMatches(contractDetails.popText, CDData.POPPage3.expectedstartTextPage3);
        cy.radioBtn(contractDetails.yesRadioOption, "YES").not("[disabled]").click({
            force: true
        });
        cy.radioBtn(contractDetails.noRadioOption, "NO").not("[disabled]").click({
            force: true
        });
        cy.clickContinueButton(contractDetails.noRadioOption, CDData.contractTypePage.pageHeader4);
        cy.log(" TestReport: Step3-ContractDetails-Period of Performance Page# 3 Functional Testing complete ")
    });

    it("TC2: Functional Testing: Message Validations: Period of Performance", () => {

        cy.log(" TestReport: verify error messages in page#1-poplength ")
        const showValidationMessage = (() => {
            cy.checkErrorMessage(contractDetails.errorMessageText,
                " The length of this period must be " + option + " or less.");
        });
        cy.findElement(contractDetails.baseInputTxtBox).clear().type("6").then(() => { //enter Base value> 1yr 
            option = " 1 year ";
            showValidationMessage()
        });
        cy.findElement(contractDetails.baseInputTxtBox).clear().type("13") //enter Base value> 13months 
        cy.findElement(contractDetails.baseDropdownIcon).click();
        cy.findElement(contractDetails.baseDropdownMonth).click().then(() => {
            option = "12 months"
            showValidationMessage()
        });
        cy.findElement(contractDetails.baseInputTxtBox).clear().type("367") //enter Base value> 365days
        cy.findElement(contractDetails.baseDropdownIcon).click();
        cy.findElement(contractDetails.baseDropdownDays).click().then(() => {
            option = "365 days"
            showValidationMessage()
        });
        cy.findElement(contractDetails.baseInputTxtBox).clear().type("55") //enter Base value> 52 weeks
        cy.findElement(contractDetails.baseDropdownIcon).click();
        cy.findElement(contractDetails.baseDropdownWeek).click().then(() => {
            option = "52 weeks"
            showValidationMessage()
        });

        cy.log(" TestReport: verify error messages in in page#2-popstartdate ")
        cy.clickContinueButton(contractDetails.baseInputTxtBox, CDData.POPPage2.pageHeader2);
        cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").focus();
        cy.clickSomethingElse(contractDetails.popStartRadioError)
            .then(() => {
                cy.checkErrorMessage(contractDetails.popStartRadioError, CDData.POPPage2.popStartRadioError);
            });
        cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES")
            .click({
                force: true
            }).then(() => {
                cy.findElement("#RequestDateOption_dropdown_field_control").should("exist");
                cy.findElement(contractDetails.requestDatePicker).focus().click();
                cy.clickSomethingElse()
                    .then(() => {
                        cy.checkErrorMessage(contractDetails.requestDatePickerError, CDData.POPPage2.requestDatePickerError)
                    });
            });
        cy.log(" TestReport: Step3-ContractDetails-Period of Performance Message Validations complete ")

    });


});