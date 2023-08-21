import {
    colors,
    randomString,
    randomNumber
} from "../../../../helpers"
import background from "../../../../selectors/background.sel";
import fo from "../../../../selectors/fairOpportunityProcess.sel";
import ep from "../../../../selectors/evaluationPlan.sel";
import evalCriteria from "../../../../fixtures/evaluationCriteria.json";
import common from "../../../../selectors/common.sel";
import bgCEData from "../../../../fixtures/bgCEData.json";


describe("Test suite: Step04-Previous or Current Contract with EvaluationPlan", () => {


    const pt = "TC-Step-4-Background-evalplan-procurement" + randomString(5);
    const scope = "Background-Procurement-" + randomString(5);   
    const contractNo = randomNumber(14);
    const validContractNo = randomNumber(13);
    

    before(() => {

        cy.goToECStep(pt, scope);
        cy.selectFairOppRadioOption(fo.radioNoneApply, "NO_NONE");
        cy.selectEvaluationPlanOption(ep.equalLumpSum, "EQUAL_SET_LUMP_SUM");
        cy.clickContinueButton(
            ep.equalLumpSum,
            evalCriteria.setEqualLumpSum.headerText
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

    })
    it("TC1:Message Validation: Current Contract screen", () => {
        cy.log(" TestReport: Step4-Background-Previous/Current Contract")
        cy.verifyPageHeader("Do you have a current contract for this effort?");
        cy.radioBtn(background.ccYesRadioOption, "YES").not("[disabled]");
        cy.radioBtn(background.ccNoRadioOption, "NO").not("[disabled]");
        cy.radioBtn(background.ccNoRadioOption, "NO").focus()
            .focus();
        cy.clickSomethingElse(background.radioOptionError)
            .then(() => {
                cy.checkErrorMessage(background.radioOptionError, "Please select an option");
            });

        cy.findElement("#developerToggleButton")
            .click({
                force: true
            });
        
        cy.btnClick(common.continueBtn, " Continue ").then(() => {
            cy.findElement(background.incumbentTxtBox).should("not.exist");
        });
        cy.radioBtn(background.ccYesRadioOption, "YES").click({
            force: true
        });

        cy.clickContinueButton(background.ccYesRadioOption,
            "Let’s gather some details about your previous or current contract"
        );

    });
    it("TC2:Message Validations: Let’s gather some details about your previous or current contract", () => {

        cy.log(" TestReport: Let’s gather some details about your previous or current contract");
        cy.hoverToolTip(
            background.tNoTooltipBtn,
            background.tNoTooltipText,
            bgCEData.gatherDetails.taskNoTooltipText
        );

        cy.hoverToolTip(
            background.expirationTooltipBtn,
            background.expirationTooltipText,
            bgCEData.gatherDetails.orderExpTootipText
        );

        cy.log("Validation error for incumbent text box");
        cy.verifyRequiredInput(
            background.incumbentTxtBox,
            background.incumbentError,
            "Enter the contractor’s name."
        );

        cy.log("Validation error for contract number text box");
        cy.verifyRequiredInput(
            background.contractNoTxtBox,
            background.contractNoTxtError,
            "Enter your contract number."
        );

        cy.log("Validation error for expiration date picker");
        cy.findElement(background.expirationDatePickerInputbox).should("be.visible").clear()
            .click()
            .blur({ force: true })
            .then(() => {
                cy.checkErrorMessage(
                    background.expirationDatePickerError,
                    "Please enter your contract/order expiration date."
                );
            });
        cy.log("Validation for Contract if more than 13 characters")
        cy.findElement(background.contractNoTxtBox).type(validContractNo);
        cy.clickSomethingElse(background.expirationDatePickerInputbox).then(() => {
        cy.findElement(background.contractNoTxtBox).scrollIntoView();
        cy.findElement(background.contractNoTxtError).should("not.exist");      
        }); 
        cy.findElement(background.contractNoTxtBox).type(validContractNo)
            .blur({ force: true }).then(() => {
                cy.checkErrorMessage(
                background.contractNoTxtError,
                "Your contract number must be 13 alphanumeric characters."
            );
        });

        cy.btnClick(common.continueBtn, " Continue ").then(() => {
            cy.findElement(background.existYesRadioOption).should("not.exist");
        });

        
    });

})