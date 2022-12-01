/* eslint-disable cypress/no-unnecessary-waiting */
import 'cypress-iframe';
import { cleanText} from "../helpers";
import common from "../selectors/common.sel";
import fo from "../selectors/fairOpportunityProcess.sel";
import ep from "../selectors/evaluationPlan.sel";


Cypress.Commands.add("selectFairOppRadioOption", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(fo.fairOppRadioActiveBtn)
    .then(($radioBtn) => {
      const selectedOption = $radioBtn.text();
      cy.log(selectedOption);       
      const optionSelectedText = "radio_button_checkedNone" +
        " of these exceptions apply to this acquisition."; 
      if (selectedOption != optionSelectedText) {
        cy.findElement("#JandAMMRWarningAlert").should("exist")
      }      
      cy.btnClick(common.continueBtn, " Continue ");
      if (selectedOption === optionSelectedText) {
        cy.wait(1000)
        cy.textExists(common.header,"Let’s work on an evaluation plan for your requirement");
      } else {
        cy.wait(1000)        
        cy.textExists(
          common.header,
          "Based on what you told us, you do not need an evaluation plan for this acquisition."
        );
      }
      
    })  
  
});

Cypress.Commands.add("selectEvaluationPlanOption", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(ep.evalPlanRadioActiveBtn)
    .then(($radioBtn) => {
      const unformattedText = $radioBtn.text()
      const selectedOption = cleanText(unformattedText);
      cy.log(selectedOption);      
      const techProsopalOption = "radio_button_checkedI require a technical proposal." +
        " Award will be made on either a LPTA or Best Value Trade-Off (BVTO) basis.";
      const setLumpSum = "radio_button_checked" +
        "I would like to purchase a set lump sum dollar amount of offerings from any one CSP." +
        " Award will be made to the CSP offering either the “best use” or “lowest risk” solution.";
      if (selectedOption === techProsopalOption) {        
        cy.wait(1000);
        cy.findElement(ep.methodSelection).should("exist");
        cy.textExists(
          ep.methodSelectionSecLabel,
          "Based on your selection above," +
          " which method of evaluation is applicable to your requirement? "
        );
        cy.findElement(ep.lptaRadioBtn).should("exist").not("[disabled]");
        cy.findElement(ep.bvtoRadioBtn).should("exist").not("[disabled]");
      } else if (selectedOption === setLumpSum) {
        cy.wait(1000);
        cy.findElement(ep.methodSelection).should("exist");
        cy.textExists(
          ep.methodSelectionSecLabel,          
          "Based on your selection above, which technique is applicable to your requirement?"
        );
        cy.findElement(ep.bestUseRadioBtn).should("exist").not("[disabled]");
        cy.findElement(ep.lowestRiskRadioBtn).should("exist").not("[disabled]");
      } else {      
        cy.wait(1000)
        cy.findElement(ep.methodSelection).should("not.exist");
      }
    })
})

Cypress.Commands.add("selectMethodSelectionSectionOption", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(ep.methodSecActiveBtn)
    .then(($radioBtn) => {
      const unformattedText = $radioBtn.text()
      const selectedOption = cleanText(unformattedText);
      cy.log(selectedOption);
      cy.textExists(common.continueBtn, "Continue").click();
      const lptaOption = "radio_button_checkedLowest Price" +
        " Technically Acceptable" +
        " (LPTA)Award will be made to the lowest priced offeror meeting the compliance standards.";
      const bvtoOption = "radio_button_checkedBest Value Trade-Off" +
        " (BVTO)Award will be made to the CSP providing the best value.";
      const bestUse = "radio_button_checked“Best use” solutionAward" +
        " will be made to the CSP offering the “best use.”"
      const lowestRisk = "radio_button_checked“Lowest risk” solutionAward" +
        " will be made to the CSP providing the lowest risk."
      if (selectedOption === lptaOption || selectedOption === bvtoOption) {
        cy.wait(1000);
        cy.verifyPageHeader(
          "Now let’s review compliance standards when technical proposals are required"
        );
        cy.textExists(fo.evalPlanAlertHeader, "Compliance Standards");
        if (selectedOption === lptaOption) {
          cy.verifyTextMatches(
            ep.techPropAlertSubHeader,
            "Award will be made to the lowest priced offeror meeting the following" +
            " compliance standards:"
          );
        } else {
          cy.verifyTextMatches(
            ep.techPropAlertSubHeader,
            "Award will be made to the CSP providing the best value and meets the following" +
            " compliance standards:"
          );
        }
      } else if (selectedOption === bestUse || selectedOption === lowestRisk) {
        cy.wait(1000);
        cy.verifyPageHeader("Now let’s review assessment criteria required for white papers");
        cy.textExists(fo.evalPlanAlertHeader, "Assessment Areas");
        if (selectedOption === bestUse) {
          cy.verifyTextMatches(
            ep.techPropAlertSubHeader,
            "Award will be made to the CSP whose white paper offers the “best use” solution" +
            " and meets the following assessment areas:"
          );
        } else {
          cy.verifyTextMatches(
            ep.techPropAlertSubHeader,
            "Award will be made to the CSP whose white paper offers the “lowest risk” solution" +
            " and meets the following assessment areas:"
          );
        }
      }
        
    });
});

Cypress.Commands.add("selectCustomStandardsRadioOption", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(ep.customRadioActiveBtn)
    .then(($radioBtn) => {
      const unformattedText = $radioBtn.text()
      const selectedOption = cleanText(unformattedText);
      cy.log(selectedOption);
      const yesOption = "radio_button_checkedYes," +
        " I want to write my own custom compliance standard(s)."
      if (selectedOption === yesOption) {
        cy.findElement(ep.customSpecSection).should("exist");
        cy.findElement(ep.custom0SpecTextbox).should("be.visible").and("be.empty");
      } else {
        cy.findElement(ep.customSpecSection).should("not.exist");
      }
    });
});

Cypress.Commands.add("customSpecExists", () => {
  cy.findElement(common. wrap)
    .then((main) => {
      if (main.find(ep.customSpec0Control).length > 0) {
        cy.log("CustomSpec1 FOUND");
        cy.findElement(ep.custom0DeleteBtn)
          .should("exist")
          .and("not.be.disabled");
        cy.findElement(ep.custom1DeleteBtn)
          .should("exist")
          .and("not.be.disabled");                                
      } else {
        cy.log("CustomSpec1 NOT FOUND!");
        cy.findElement(ep.custom0DeleteBtn)
          .should("exist")
          .and("be.disabled")
      }
    });

});

Cypress.Commands.add("selectCustomAssessmentCheckboxOption", () => {
  cy.checkBoxOption(ep.customAssessmentCheckBox, "CustomAssessment").click({ force: true })
    .then(() => {
      cy.findElement(ep.customSpecSection).should("exist");
      cy.findElement(ep.custom0SpecTextbox).should("be.visible").and("be.empty"); 
    })  
  
});

Cypress.Commands.add("selectOtherCheckboxOption", (checkBoxSelector,value,selector) => {
  cy.checkBoxOption(checkBoxSelector,value ).click({ force: true })
    .then(() => {
      cy.findElement(selector).should("exist");       
    })  
  
});