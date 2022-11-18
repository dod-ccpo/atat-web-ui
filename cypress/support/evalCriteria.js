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
      cy.textExists(common.continueBtn, " Continue ").click();
      const optionSelectedText = "radio_button_checkedNone" +
        " of these exceptions apply to this acquisition.";      
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
        cy.findElement(ep.methodSelection).should("not.visible");
      }
    })
})
