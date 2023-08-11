import {randomString,randomAlphaNumeric,cleanText} from "../../../helpers";
import ep from "../../../selectors/evaluationPlan.sel";


describe("Test suite: Happy path flow Evaluation plan", () => {
    
    const pt = "TC-Step-2-FairOpp-EvaluationPlan-" + randomAlphaNumeric(5);
    const scope = "EvaluationCriteria-EvaluationPlan" + randomString(5);

    //select different eval plan option
    let evalPlanOption ="setLumpSum";//techProposal,noTechProposal,equalLumpSum,setLumpSum
    const noTechProposalTxt = "no technical proposal is"
    const techProposalTxt ="technical proposals are"

    // Based on the eval plan,selectionMethodText         
    const selectionMethodText = () => {
        if (evalPlanOption === "techProposal") {
            return techProposalTxt;
        } else {
        return noTechProposalTxt;
        }

    };
    const selectionMethodTechHeader = cleanText(`Now let’s review compliance standards when ${selectionMethodText()} required`);
    let setTechProposalSelectionMethod="BVTO";//BVTO,LPTA;

    const customCompliance="Yes"//Yes,No
    const customText = randomString(5);

    //if evalPlanOption is selected to serLumpSum set the following Option
    let setLumpSumSelectionMethod="BestUse"//BestUse,LowestRisk

    beforeEach(() => {
    cy.selectNoneOption(pt, scope);      
    
    });

    function selectEvalPlanOptionTechProposal(setTechProposalSelectionMethod, customCompliance, customText) {
        cy.findElement(ep.techProposal).click({ force: true });
        if (setTechProposalSelectionMethod === "BVTO") {
            cy.findElement(ep.bvtoRadioBtn).click({ force: true });
            cy.clickContinueButton(ep.bvtoRadioBtn, selectionMethodTechHeader);
            selectCustomComplianceOption(customCompliance, customText);
            cy.clickContinueButton(ep.customRadioNoBtn, "What differentiator(s) should be used to distinguish between technical proposals?");
            cy.selectCheckBoxes([ep.levelComplexityCheckbox, ep.capGain]);
            cy.clickContinueButton(ep.otherCheckboxOption, "Let’s gather details about the duration of your task order");
        } else {
            cy.findElement(ep.lptaRadioBtn).click({ force: true });
            cy.clickContinueButton(ep.lptaRadioBtn, selectionMethodTechHeader);
            selectCustomComplianceOption(customCompliance, customText);
            cy.clickContinueButton(ep.customRadioNoBtn, "Let’s gather details about the duration of your task order");
        }
    };

    function selectEvalPlanOptionNoTechProposal(customCompliance, customText) {
        cy.findElement(ep.noTechProposal).click({ force: true });
        cy.clickContinueButton(ep.noTechProposal, selectionMethodTechHeader);
        selectCustomComplianceOption(customCompliance, customText);
        cy.clickContinueButton(ep.customRadioNoBtn, "Let’s gather details about the duration of your task order");
    };

    function selectCustomComplianceOption(customCompliance,customText) {
        if (customCompliance === "Yes") {
            cy.radioBtn(ep.customRadioYesBtn, "YES").click({ force: true });
            cy.enterTextInTextField(ep.custom0SpecTextbox, customText);
        } else {
            cy.radioBtn(ep.customRadioNoBtn, "NO").click({ force: true });
        }
    };

    function selectEvalPlanOptionSetLumpSum(setLumpSumSelectionMethod, customText) {
        cy.findElement(ep.setLumpSum).click({ force: true });
        if (setLumpSumSelectionMethod === "BestUse") {
            cy.findElement(ep.bestUseRadioBtn).click({ force: true });
        } else {
            cy.findElement(ep.lowestRiskRadioBtn).click({ force: true });
        }
        cy.clickContinueButton(ep.setLumpSum, "Now let’s review assessment criteria required for white papers");
        cy.selectCustomAssessmentCheckboxOption();
        cy.enterTextInTextField(ep.custom0SpecTextbox, customText);
        if (setLumpSumSelectionMethod === "BestUse") {
            cy.selectCheckBoxes([ep.riskToGovCheckBox, ep.automationCapabilityCheckBox]);
        } else {
            cy.selectCheckBoxes([ep.automationCapabilityCheckBox]);
        }
        cy.clickContinueButton(ep.riskToGovCheckBox, "Let’s gather details about the duration of your task order");
    };
    
    function selectEvalPlanOptionEqualLumpSum() {
        cy.findElement(ep.equalLumpSum).click({ force: true });
        cy.clickContinueButton(ep.equalLumpSum, "Based on your evaluation method, there are no required compliance standards, differentiators, or assessment areas.");
    };

    it("TC1: Select Eval plan", () => {               
        if (evalPlanOption === "techProposal") {
                selectEvalPlanOptionTechProposal(setTechProposalSelectionMethod, customCompliance, customText);
        } else if (evalPlanOption === "noTechProposal") {
            selectEvalPlanOptionNoTechProposal(customCompliance, customText);
        } else if (evalPlanOption === "setLumpSum") {
            selectEvalPlanOptionSetLumpSum(setLumpSumSelectionMethod, customText);
        } else if (evalPlanOption === "equalLumpSum") {
            selectEvalPlanOptionEqualLumpSum();
        }
        
    });

});
