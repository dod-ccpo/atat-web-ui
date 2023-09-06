import {
    randomString,
    randomAlphaNumeric,
    cleanText
} from "../../../helpers";
import ep from "../../../selectors/evaluationPlan.sel";
import fo from "../../../selectors/fairOpportunityProcess.sel";


describe("Test suite: Step02-Evaluation plan", () => {

    const pt = "TC-Step-2-FairOpp-EvaluationPlan-" + randomAlphaNumeric(5);
    const scope = "EvaluationCriteria-EvaluationPlan" + randomString(5);

    //select different eval plan option
    let evalPlanOption = "techProposal"; //techProposal,noTechProposal,equalLumpSum,setLumpSum
    const noTechProposalTxt = "no technical proposal is"
    const techProposalTxt = "technical proposals are"

    // Based on the eval plan,selectionMethodText         
    const selectionMethodText = () => {
        if (evalPlanOption === "techProposal") {
            return techProposalTxt;
        } else {
            return noTechProposalTxt;
        }

    };
    const selectionMethodTechHeader = cleanText(`Now let’s review compliance standards when ${selectionMethodText()} required`);
    let setTechProposalSelectionMethod = "LPTA"; //BVTO,LPTA;

    const customCompliance = "Yes" //Yes,No
    const customText = randomString(5);

    //if evalPlanOption is selected to setLumpSum,then set the following Option
    let setLumpSumSelectionMethod = "LowestRisk" //BestUse,LowestRisk

    //summary
    const exceptionToFairOppDescriptionText =`No exceptions apply to this acquisition.A J&A and MRR are NOT required in your final acquisition package.`;

    beforeEach(() => {
        cy.selectNoneOption(pt, scope);

    });

    function selectEvalPlanOptionTechProposal(setTechProposalSelectionMethod, customCompliance, customText) {
        cy.findElement(ep.techProposal).click({
            force: true
        });
        if (setTechProposalSelectionMethod === "BVTO") {
            cy.findElement(ep.bvtoRadioBtn).click({
                force: true
            });
            cy.clickContinueButton(ep.bvtoRadioBtn, selectionMethodTechHeader);
            selectCustomComplianceOption(customCompliance, customText);
            cy.clickContinueButton(ep.customRadioNoBtn, "What differentiator(s) should be used to distinguish between technical proposals?");
            cy.selectCheckBoxes([ep.levelComplexityCheckbox, ep.capGain]);
            cy.clickContinueButton(ep.otherCheckboxOption, "Your Evaluation Criteria Summary");
        } else {
            cy.findElement(ep.lptaRadioBtn).click({
                force: true
            });
            cy.clickContinueButton(ep.lptaRadioBtn, selectionMethodTechHeader);
            selectCustomComplianceOption(customCompliance, customText);
            cy.clickContinueButton(ep.customRadioNoBtn, "Your Evaluation Criteria Summary");
        }
    };

    function selectEvalPlanOptionNoTechProposal(customCompliance, customText) {
        cy.findElement(ep.noTechProposal).click({
            force: true
        });
        cy.clickContinueButton(ep.noTechProposal, selectionMethodTechHeader);
        selectCustomComplianceOption(customCompliance, customText);
        cy.clickContinueButton(ep.customRadioNoBtn, "Your Evaluation Criteria Summary");
    };

    function selectCustomComplianceOption(customCompliance, customText) {
        if (customCompliance === "Yes") {
            cy.radioBtn(ep.customRadioYesBtn, "YES").click({
                force: true
            });
            cy.enterTextInTextField(ep.custom0SpecTextbox, customText);
        } else {
            cy.radioBtn(ep.customRadioNoBtn, "NO").click({
                force: true
            });
        }
    };

    function selectEvalPlanOptionSetLumpSum(setLumpSumSelectionMethod, customText) {
        cy.findElement(ep.setLumpSum).click({
            force: true
        });
        if (setLumpSumSelectionMethod === "BestUse") {
            cy.findElement(ep.bestUseRadioBtn).click({
                force: true
            });
        } else {
            cy.findElement(ep.lowestRiskRadioBtn).click({
                force: true
            });
        }
        cy.clickContinueButton(ep.setLumpSum, "Now let’s review assessment criteria required for white papers");
        cy.selectCustomAssessmentCheckboxOption();
        cy.enterTextInTextField(ep.custom0SpecTextbox, customText);
        if (setLumpSumSelectionMethod === "BestUse") {
            cy.selectCheckBoxes([ep.riskToGovCheckBox, ep.automationCapabilityCheckBox]);
        } else {
            cy.selectCheckBoxes([ep.automationCapabilityCheckBox]);
        }
        cy.clickContinueButton(ep.riskToGovCheckBox, "Your Evaluation Criteria Summary");
    };

    function selectEvalPlanOptionEqualLumpSum() {
        cy.findElement(ep.equalLumpSum).click({
            force: true
        });
        cy.clickContinueButton(
            ep.equalLumpSum,
            "Based on your evaluation method, there are no required compliance standards, differentiators, or assessment areas."
        );
        cy.clickContinueButton(
            ep.evalPlanAlertHeader,
            "Your Evaluation Criteria Summary"
        );
    };

    function evalplanDescriptionDetails() {
        let description = "";

        switch (evalPlanOption) {
            case "noTechProposal":
                description = "Technical proposal not required; award will be made on a LPTA basis.";
                break;
            case "techProposal":
                description = setTechProposalSelectionMethod === "BVTO" ?
                    "Technical proposal required; award will be made on a BVTO basis." :
                    "Technical proposal required; award will be made on a LPTA basis.";
                break;
            case "setLumpSum":
                description = setLumpSumSelectionMethod === "BestUse" ?
                    "Purchase a set lump sum dollar amount from one CSP; award will be made to the “BEST_USE” solution." :
                    "Purchase a set lump sum dollar amount from one CSP; award will be made to the “LOWEST_RISK” solution.";
                break;
            case "equalLumpSum":
                description = "Purchase an equal set lump sum dollar amount from each CSP.";
                break;

        }

        cy.verifyTextMatches(fo.evalPlanDesriptionText, description);
    }


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
        cy.verifyTextMatches(fo.exceptionToFairOppDescriptionText, exceptionToFairOppDescriptionText);
        evalplanDescriptionDetails()

    });

});