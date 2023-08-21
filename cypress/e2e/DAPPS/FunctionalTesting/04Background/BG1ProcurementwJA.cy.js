import {
    colors,
    randomString,
    randomNumber,
    formatDateInMMDDYYYY
} from "../../../../helpers"
import background from "../../../../selectors/background.sel";
import common from "../../../../selectors/common.sel";
import bgCEData from "../../../../fixtures/bgCEData.json";



describe("Test suite: Step04-Procurement History", () => {


    const pt = "TC-Step-4-Background-JA-procurement" + randomString(5);
    const scope = "Backgound-procurerment-" + randomString(5);
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
    const deleteInstanceTitle = `Delete this contract?`
    const date = new Date();
    const startDateFormatted = formatDateInMMDDYYYY(date, 10, "previous");
    const expiredDateFormatted = formatDateInMMDDYYYY(date, 10, "next");
    const expectedPOP = startDateFormatted + " - " + expiredDateFormatted;  
    const expectedProcurementHistoryData=[
        [cName, editContractNo, taskOrderNo, expectedPOP],
        [cName1,validContractNo1,taskOrderNo, expectedPOP]
    ]
    

    before(() => {

        cy.goToECStep(pt, scope);
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
            "Let’s gather some details about your previous or current contract"
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
        cy.selectDatefromDatePicker(
            background.expirationDatePickerIcon,
            background.navigateNextMonth,
            background.selectDate,
            dayOfMonth,
            background.expirationDatePicker
        );
        cy.enterTextInTextField(background.incumbentTxtBox, cName);
        cy.findElement(background.hubRadioOption).click({
            force: true
        });

    };

    function verifyEditGatherDetailsForm(contractNo, taskOrderNo,startDateFormatted,expiredDateFormatted,cName) {
        cy.verifyEnteredInputTxt(background.contractNoTxtBox, contractNo);
        cy.verifyEnteredInputTxt(background.taskOrderNumberTxtBox, taskOrderNo);
        cy.verifySelectedRadioOption(background.competitionActiveRadio, "Small business (SB) set-aside"); 
        cy.verifyEnteredInputTxt(background.startDateTextField, startDateFormatted); 
        cy.verifyEnteredInputTxt(background.expirationDatePickerInputbox,expiredDateFormatted);    
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
        cy.findElement(background.contractNoTxtBox, ).type(invalidContractNo)
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
        cy.verifyTextMatches(background.recurringPageText,bgCEData.procsummaryIntroText);
        cy.findElement(background.procurementHistoryTable).should("exist");
        cy.verifyColumnHeaders(1, "Contractor Name", "Missing info");              
        
        });

    it("TC3:Procurement History Summary-Delete", () => {  
        cy.log(" TestReport:Procurement History-Delete Contract");    
        cy.findElement(background.deleteO)
            .should("be.visible").click()
            .then(()=>{
                cy.dialogModalExist(
                    background.deleteInstanceModal,
                    background.deleteInstanceTitle,
                    deleteInstanceTitle
                );
            cy.btnClick(background.deleteModalBtn, " Delete contract ");            
            cy.findElement(background.deleteO).should("not.exist")
        });
    });
    it("TC4:Procurement History Summary-Add Contract", () => {
        cy.log(" TestReport:Procurement History-Add Contract");
        cy.clickAndWaitForVisible(background.addInstanceNoDataBtn,background.contractOverviewTitle ); 
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

    it("TC5:Procurement History Summary-Edit", () => {

        cy.log(" TestReport:Procurement History-Edit");
        cy.findElement(background.edit0).should("be.visible").click()
        verifyEditGatherDetailsForm(validContractNo, taskOrderNo,startDateFormatted,expiredDateFormatted,cName);
        // edit the ContractNumber
        cy.enterTextInTextField(background.contractNoTxtBox, editContractNo);
        cy.findElement(background.hubRadioOption).scrollIntoView();
        cy.clickContinueButton(
            background.businessSizeRadioOption,
            "Your Procurement History");
        cy.verifyColumnHeaders(2, "Contract Number", editContractNo);

        cy.log(" TestReport:Procurement History-add other instance to the existing instance");
        cy.clickAndWaitForVisible(background.addInstance,background.contractOverviewTitle ); 
        cy.verifyPageHeader(
            "Let’s gather some details about your previous or current contract"
        );
        completeGatherDetailsForm(validContractNo1, taskOrderNo, dayOfMonth, cName1);
        cy.findElement(background.hubRadioOption).scrollIntoView();
        cy.clickContinueButton(
            background.businessSizeRadioOption,
            "Your Procurement History");
        cy.verifyTableValues(background.procurementHistoryTable, expectedProcurementHistoryData, 4)

        });


    });