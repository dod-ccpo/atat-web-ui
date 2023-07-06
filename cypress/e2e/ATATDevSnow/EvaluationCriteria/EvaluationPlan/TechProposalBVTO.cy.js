import {
  randomString,
  randomAlphaNumeric
} from "../../../../helpers";
import ep from "../../../../selectors/evaluationPlan.sel";
import evalCriteria from '../../../../fixtures/evaluationCriteria.json';
import common from "../../../../selectors/common.sel";


describe("Test suite: TechProposal: BVTO", () => {

  const customText = randomString(5);
  const pt = "TC-Step-2-FairOpp-None-BVTO-" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-BVTO" + randomString(5);

  beforeEach(() => {

    cy.selectNoneOption(pt, scope);
    cy.selectEvaluationPlanOption(ep.techProposal, "TECH_PROPOSAL");
    cy.selectMethodSelectionSectionOption(ep.bvtoRadioBtn, "BVTO");;

  });

  it("TC1: Differentiator(s) screen", () => {
    cy.selectCustomStandardsRadioOption(ep.customRadioNoBtn, "NO");
  
    cy.clickContinueButton(
      ep.customRadioNoBtn,
      evalCriteria.bvto.differentiatorsHeaderText);
    cy.verifyTextMatches(
      ep.introDescription,
      evalCriteria.bvto.diffIntroDesc
    );
    cy.selectCheckBoxes([ep.levelComplexityCheckbox, ep.capGain]);
    cy.selectOtherCheckboxOption(
      ep.otherCheckboxOption,
      ep.customDifferentiatorSection);
    cy.clickContinueButton(
      ep.otherCheckboxOption,
      "Let’s gather details about the duration of your task order"
    );

  });

  //skipping this test due existing bug AT-8485
  it.skip("TC2: Differentiator(s) screen: Validations, Add & Remove", () => {
    cy.selectCustomStandardsRadioOption(ep.customRadioYesBtn, "YES");
    cy.enterTextInTextField(ep.custom0SpecTextbox, customText);
    cy.clickContinueButton(
      ep.custom0SpecTextbox,
      evalCriteria.bvto.differentiatorsHeaderText
    );
    //Validation message
    cy.verifyRequiredCheckbox(
      ep.levelComplexityCheckbox,
      ep.differentitorsError,
      "Please select at least one differentiator."
    );
    cy.selectOtherCheckboxOption(
      ep.otherCheckboxOption,
      "CustomDifferentiators",
      ep.customDifferentiatorSection);
    cy.verifyRequiredInput(
      ep.custom0SpecTextbox,
      ep.custom0SpecTextboxError,
      "Please enter a custom differentiator.");
    cy.textExists(ep.addAnotherCustomCS, "Add another differentiator").click()
      .then(() => {
        cy.findElement(ep.customDifferentiator1Spec).should("exist").and("contain.text", "2");
        cy.customSpecExists();
        cy.enterTextInTextField(ep.custom1SpecTextbox, customText);
        cy.findElement(ep.custom1DeleteBtn).click().then(() => {
          cy.findElement(ep.custom1SpecTextbox).should("not.exist");
        });

      });
    cy.btnClick(common.continueBtn, " Continue ");
  });

});