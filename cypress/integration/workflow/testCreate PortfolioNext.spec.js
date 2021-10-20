/// <reference types="cypress" />
import SignInpage from "../../pageObjects/SignInPage";
import DashBoardPage from "../../pageObjects/DashBoardPage";
import ProfilePage from "../../pageObjects/ProfilePage";
import StepOnePage from "../../pageObjects/StepOne";

it("StepOne:Create Portfolio:Save & Close then delete ", () => {
  const signin = new SignInpage();
  const dashboard = new DashBoardPage();
  const profile = new ProfilePage();
  const stepone = new StepOnePage();

  signin.navigate();
  signin.signInBtn().should("be.visible");
  //signin.signInBtn().click()
  const url = Cypress.env("baseURL");
  cy.visit(url + "dashboard");
  cy.url().should("include", "/dashboard");
  dashboard.getStarted().click();
  cy.url().should("include", "/profile");
  profile.continueBtn().click();
  cy.url().should("include", "/createportfolio");
  cy.get("#btn-create-new-portfolio")
    .contains(" Create a New Portfolio")
    .click();
  cy.url().should("include", "/wizard/");
  stepone.stepperWizard();
  const pName = "Test" + stepone.randomportfolioname();
  cy.fillCreatePortfolioform(pName);
  stepone.nextAddToBtn().click();
  cy.url().should("include", "/addfunding");
  cy.get("#step_01.v-stepper__step--complete.visited").should("be.visible");
  cy.get("#step_2_navbtn_cancel").contains("Save and Close").click();
  cy.get(".view-portfolio div.v-card .v-card__title")
    .contains(pName)
    .parents(".v-card__title")
    .nextAll(".v-card__actions")
    .contains("button", "DELETE")
    .click();
  cy.get("#dialog_ok").contains("OK").click();
  cy.reload();
  cy.get(".view-portfolio div.v-card .v-card__title").should(
    "not.contain.value",
    pName
  );
});
