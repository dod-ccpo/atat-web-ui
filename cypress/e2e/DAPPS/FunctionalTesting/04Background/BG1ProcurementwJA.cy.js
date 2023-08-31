import {
    colors,
    randomString,
    randomNumber,
    formatDateInMMDDYYYY
} from "../../../../helpers"
import background from "../../../../selectors/background.sel";
import fo from "../../../../selectors/fairOpportunityProcess.sel";
import common from "../../../../selectors/common.sel";
import bgCEData from "../../../../fixtures/bgCEData.json";



describe("Test suite: Step04-Procurement History", () => {


    const pt = "TC-Step-4-Background-JA-procurement" + randomString(5);
    const scope = "Backgound-procurerment-" + randomString(5);

    const oneCSP = "YES_FAR_16_505_B_2_I_B";

    const invalidContractNo = randomNumber(14);
    const validContractNo = randomNumber(13);
    const validContractNo1 = randomNumber(13);
    const editContractNo = "Test" + randomNumber(9);
    const taskOrderNo = randomNumber(13);

    //Period of Performance(POP)
    const dayOfMonth = "10";

    //Contractor Details
    const cName = "testContractName-" + randomString(5);
    const cName1 = "testContractName1-" + randomString(4);

    //procurement History Summary
    const deleteInstanceTitle = `Delete ${cName}?`
    const date = new Date();
    const startDateFormatted = formatDateInMMDDYYYY(date, 10, "previous");
    const expiredDateFormatted = formatDateInMMDDYYYY(date, 10, "next");
    const expectedPOP = startDateFormatted + " - " + expiredDateFormatted;
    const expectedProcurementHistoryData = [
        [cName, editContractNo, taskOrderNo, expectedPOP],
        [cName1, validContractNo1, taskOrderNo, expectedPOP]
    ]
    const updatedProcurementHistoryData = [
        [cName1, validContractNo1, taskOrderNo, expectedPOP],
        [cName, validContractNo, taskOrderNo, expectedPOP]
    ];
    const rowCount = 2;
    //after delete the updated count
    const updatedRowCount = 1;
    const descriptionDetails = [`${updatedRowCount} previous contract: ${validContractNo1}`];
    const UpdatedDescriptionDetails = [
        rowCount + " previous contracts: " + validContractNo, validContractNo1

    ];

    before(() => {

        cy.goToECStep(pt, scope);
        cy.radioBtn(fo.radioOneCSP, oneCSP).click({
            force: true
        });
        cy.clickContinueButton(
            fo.radioUrgent,
            "Which CSP does this exception to fair opportunity apply to?"
        );
        cy.findElement(common.stepBackgroundText)
            .should("be.visible")
            .and("contain", " Background ")
            .click().then(() => {
                cy.waitUntil(function () {
                    return cy.findElement(common.stepBackgroundText).should("have.css", "color", colors.primary);
                });
            });
        cy.waitUntil(() => cy.findElement(background.ccYesRadioOption).should("exist"));
        cy.radioBtn(background.ccYesRadioOption, "YES").click({
            force: true
        });

        cy.clickContinueButton(background.ccYesRadioOption,
            " Let’s gather some details about your previous or current contract "
        );

    })

    function completeGatherDetailsForm(contractNo, taskOrderNo, dayOfMonth, cName) {
        cy.enterTextInTextField(background.contractNoTxtBox, contractNo);
        cy.enterTextInTextField(background.taskOrderNumberTxtBox, taskOrderNo);
        cy.findElement(background.sbSetAsideRadioOption).click({
            force: true
        });

        cy.selectDatefromDatePicker(
            background.startDatePickerBtnIcon,
            background.startDatePreviousMonth,
            background.selectDate,
            dayOfMonth,
            background.startDatepicker
        );
        cy.waitUntil(function () {
            return cy.findElement(background.startDateTextField).should("have.value", startDateFormatted);
        });
        cy.selectDatefromDatePicker(
            background.expirationDatePickerIcon,
            background.navigateNextMonth,
            background.expirationSelectDate,
            dayOfMonth,
            background.expirationDatePicker
        );
        cy.waitUntil(function () {
            return cy.findElement(background.expirationDatePickerInputbox).should("have.value", expiredDateFormatted);
        });
        cy.enterTextInTextField(background.incumbentTxtBox, cName);
        cy.findElement(background.hubRadioOption).click({
            force: true
        });

    };

    function verifyEditGatherDetailsForm(contractNo, taskOrderNo, startDateFormatted, expiredDateFormatted, cName) {
        cy.verifyEnteredInputTxt(background.contractNoTxtBox, contractNo);
        cy.verifyEnteredInputTxt(background.taskOrderNumberTxtBox, taskOrderNo);
        cy.verifySelectedRadioOption(background.competitionActiveRadio, "Small business (SB) set-aside");
        cy.verifyEnteredInputTxt(background.startDateTextField, startDateFormatted);
        cy.verifyEnteredInputTxt(background.expirationDatePickerInputbox, expiredDateFormatted);
        cy.verifyEnteredInputTxt(background.incumbentTxtBox, cName);
        cy.verifySelectedRadioOption(background.businessSizeActiveRadioOption, "HUBZone").click({
            force: true
        });

    };

    it("TC1:Asserts: Let’s gather some details about your previous or current contract", () => {

        cy.log(" TestReport: Let’s gather some details about your previous or current contract");
        cy.hoverToolTip(
            background.contractNoTooltipBtn,
            background.contractNoTootipText,
            bgCEData.procurementGatherDetails.contractnumber
        );

        cy.hoverToolTip(
            background.taskOrderNumberToolTipBtn,
            background.taskOrderNumberTooltipText,
            bgCEData.procurementGatherDetails.taskOrderNumber
        );

        cy.verifyRadioGroupLabels(
            background.competitionRadioGroup,
            bgCEData.competitionRadioLabels
        );

        cy.findElement(background.largeRadioOption).scrollIntoView();
        cy.verifyRadioGroupLabels(
            background.businessSizeRadioOption,
            bgCEData.businessSizeRadioOptions
        );
    });


    it("TC2:Message Validations", () => {

        cy.log(" TestReport: Message Validations");

        cy.log("Validation error for contract number text box");
        cy.verifyRequiredInput(
            background.contractNoTxtBox,
            background.contractNoTxtError,
            "Please enter a contract number."
        );

        cy.log("Validation error for contract number, if morethan 13 characters");
        cy.findElement(background.contractNoTxtBox).type(validContractNo);
        cy.clickSomethingElse(background.startDateTextField).then(() => {
            cy.findElement(background.contractNoTxtBox).scrollIntoView();
            cy.findElement(background.contractNoTxtError).should("not.exist");
        });
        cy.findElement(background.contractNoTxtBox).type(invalidContractNo)
            .blur({
                force: true
            })
            .then(() => {
                cy.checkErrorMessage(
                    background.contractNoTxtError,
                    "Your contract number must be 13 alphanumeric characters."
                );
            });

        cy.log("Validation error for Period of Performance");
        cy.findElement(background.startDateTextField).should("be.visible").clear()
            .click()
            .blur({
                force: true
            })
        cy.findElement(background.expirationDatePickerInputbox).should("be.visible")
            .clear()
            .click()
            .blur({
                force: true
            })
            .then(() => {
                cy.checkErrorMessage(
                    background.popValidationError,
                    "Please enter your PoP start and expiration dates"
                );
            });

        cy.log("Validation for CompetitiveStatus,if it is blank")
        cy.findElement(background.otherThanRadioOption).focus();
        cy.clickSomethingElse(background.competitiveStatusOptionError)
            .then(() => {
                cy.checkErrorMessage(
                    background.competitiveStatusOptionError,
                    "Please select a level of competition."
                );
            });
        cy.clickContinueButton(
            background.businessSizeRadioOption,
            "Your Procurement History"
        );
        //commenting below code due to UI changes
        // cy.verifyTextMatches(background.recurringPageText,bgCEData.procsummaryIntroText);
        // cy.findElement(background.procurementHistoryTable).should("exist");
        // cy.verifyColumnHeaders(1, "Contractor Name", "Missing info");              

    });

    it("TC3:Procurement History Summary-Add Contract", () => {
        cy.log(" TestReport:Procurement History-Add Contract");
        cy.clickAndWaitForVisible(background.addInstanceNoDataBtn, background.contractOverviewTitle);
        cy.verifyPageHeader(
            "Let’s gather some details about your previous or current contract"
        );
        // Enter details on the form        
        completeGatherDetailsForm(validContractNo, taskOrderNo, dayOfMonth, cName);
        cy.findElement(background.hubRadioOption).scrollIntoView();
        cy.clickContinueButton(
            background.businessSizeRadioOption,
            "Your Procurement History");
        cy.findElement(background.procurementHistoryTable).should("exist");
        cy.verifyColumnHeaders(1, "Contractor Name", cName);
        cy.verifyColumnHeaders(2, "Contract Number", validContractNo);
        cy.verifyColumnHeaders(3, "Task Order Number", taskOrderNo);
        cy.verifyColumnHeaders(4, "Period of Performance", expectedPOP);

    });

    it("TC4:Procurement History Summary-Edit contract details", () => {

        cy.log(" TestReport:Procurement History-Edit");
        cy.findElement(background.edit0).should("be.visible").click()
        verifyEditGatherDetailsForm(validContractNo, taskOrderNo, startDateFormatted, expiredDateFormatted, cName);
        // edit the ContractNumber
        cy.enterTextInTextField(background.contractNoTxtBox, editContractNo);
        cy.findElement(background.hubRadioOption).scrollIntoView();
        cy.clickContinueButton(
            background.businessSizeRadioOption,
            "Your Procurement History");
        cy.verifyColumnHeaders(2, "Contract Number", editContractNo);

        cy.log(" TestReport:Procurement History-add other instance to the existing instance");
        cy.clickAndWaitForVisible(background.addInstance, background.contractOverviewTitle);
        cy.verifyPageHeader(
            "Let’s gather some details about your previous or current contract"
        );
        completeGatherDetailsForm(validContractNo1, taskOrderNo, dayOfMonth, cName1);
        cy.findElement(background.hubRadioOption).scrollIntoView();
        cy.clickContinueButton(
            background.businessSizeRadioOption,
            "Your Procurement History");
        cy.verifyTableValues(background.procurementHistoryTable, expectedProcurementHistoryData, 4);
        cy.findElement(background.procurementHistoryTable)
            .find('tbody tr')
            .its('length')
            .then((count) => {
                const getCount = count
                cy.log(" get row Count is: ", getCount)
                expect(getCount).equal(rowCount);

            });
    });
    it("TC5:Procurement History Summary-Delete contract", () => {
        cy.log(" TestReport:Procurement History-Delete Contract");
        cy.findElement(background.deleteO)
            .should("be.visible").click()
            .then(() => {
                cy.dialogModalExist(
                    background.deleteInstanceModal,
                    background.deleteInstanceTitle,
                    deleteInstanceTitle
                );
            })
        cy.btnClick(background.deleteModalBtn, " Delete contract ");
        cy.findElement(background.delete1).should("not.exist");
        cy.findElement(background.procurementHistoryTable)
            .find('tbody tr')
            .its('length')
            .then((count) => {
                const getCount = count
                cy.log(" get row Count is: ", getCount)
                expect(getCount).equal(updatedRowCount);

            });
    });

    it("TC6:Step04 Summary-Procurement History", () => {
        cy.log(" TestReport:Summary-Procurement History Details");

        cy.clickContinueButton(
            background.procurementHistoryTable,
            "Do you have a current environment to rehost?"
        );
        cy.clickContinueButton(
            background.existingEnvYesRadioBtn,
            "Your Background Summary"
        );
        cy.verifyTextMatches(
            background.procurementHistoryHeaderText,
            "Procurement History");
        cy.verifyListMatches(background.procurementHistoryDescription, descriptionDetails);

    });

    it("TC7:Step04 Summary-Procurement History:View/Edit", () => {
        cy.log(" TestReport:Summary-Procurement History Details:View/Edit");
        cy.clickAndWaitForElementExists(
            background.procurementHistoryCompleteBtn,
            background.ccYesRadioOption
        );
        cy.verifySelectedRadioOption(background.activeRadioOption, "Yes");
        cy.clickContinueButton(
            background.ccYesRadioOption,
            "Your Procurement History"
        );
        cy.clickAndWaitForVisible(background.addInstance, background.contractOverviewTitle);
        cy.verifyPageHeader(
            "Let’s gather some details about your previous or current contract"
        );
        completeGatherDetailsForm(validContractNo, taskOrderNo, dayOfMonth, cName);
        cy.findElement(background.hubRadioOption).scrollIntoView();
        cy.clickContinueButton(
            background.businessSizeRadioOption,
            "Your Procurement History");
        cy.verifyTableValues(background.procurementHistoryTable, updatedProcurementHistoryData, 4);
        cy.clickContinueButton(
            background.procurementHistoryTable,
            "Your Background Summary"
        );
        //updated the added record        
        cy.verifyListMatches(background.procurementHistoryDescription, UpdatedDescriptionDetails);
    });


});