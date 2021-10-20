/// <reference types="cypress" />
import SignInpage from "../../pageObjects/SignInPage";
import DashBoardPage from "../../pageObjects/DashBoardPage";
import ProfilePage from "../../pageObjects/ProfilePage";
import StepOnePage from "../../pageObjects/StepOne";

describe("Test suite: Step One:Create a Portfolio-Input Field Validations", () => {
  const signin = new SignInpage();
  const dashboard = new DashBoardPage();
  const profile = new ProfilePage();
  const stepone = new StepOnePage();

  beforeEach(() => {
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
  });
  it("Testcase1: PortfolioName validation:Invalidmessage:Input field is blank: Error message- Name is required", () => {
    stepone.portfolioNameTextBox().click().blur();
    stepone
      .portfolioNameTextBox()
      .parents(".v-input__control")
      .find(".v-messages__message")
      .should("contain.text", "Name is required");
  });

  it("Testcase2: PortfolioName validation:Invalidmessage:Input value<4 characters:Error message- Portfolio name must be between 4-100 characters.", () => {
    stepone.portfolioNameTextBox().type("3ch").click().blur();
    stepone
      .portfolioNameTextBox()
      .parents(".v-input__control")
      .find(".v-messages__message")
      .should(
        "contain.text",
        "Portfolio name must be between 4-100 characters."
      );
  });

  it("Testcase3: PortfolioName validation:Invalid:Input value > 100 characters:Error message- Portfolio name must be between 4-100 characters.", () => {
    var str = new Array(102).join("a");
    stepone.portfolioNameTextBox().clear().type(str).click().blur();
    stepone
      .portfolioNameTextBox()
      .parents(".v-input__control")
      .find(".v-messages__message")
      .should(
        "contain.text",
        "Portfolio name must be between 4-100 characters."
      );
  });

  it("Testcase4: PortfolioName validation:Valid: Value with in range: Success Check mark", () => {
    stepone.portfolioNameTextBox().clear().type("test").click().blur();
    cy.get("i.v-icon.success--text").should("be.visible");
    cy.contains("check_circle");
  });

  it("Testcase5: DOD Components validation:Checkbox not selected:errormessage- Please select all of the DoD components that will fund your Portfolio", () => {
    stepone.dodComponent().first().click().click();
    cy.get("#dod-components-errors").should(
      "contain.text",
      "Please select all of the DoD components that will fund your Portfolio"
    );
    cy.get("#dod-component label").first().click();
    cy.scrollTo("bottom");
  });

  it("Testcase6: Stepper validation for Step1:CSP not selected:error", () => {
    stepone.nextAddToBtn().click();
    cy.get("#step_01.error--text.visited").should("be.visible");
  });

  it("Testcase7: CSP radio button:Invalid:Error-Please selected at least one Cloud Service Provider", () => {
    stepone.nextAddToBtn().click();
    cy.get("#step_2_navbtn_previous").click();
    stepone
      .cspRadioOptions()
      .parents(".v-input__control")
      .find(".v-messages__message")
      .should(
        "contain.text",
        "Please selected at least one Cloud Service Provider"
      );
    stepone.cspRadioOptions().contains("CSP A").click();
    stepone.nextAddToBtn().click();
  });

  it("Testcase8: Stepper validation for Step1:Error", () => {
    stepone.portfolioNameTextBox().type("Successful Portfolio");
    cy.scrollTo("center");
    stepone.dodComponent().first().click().click();
    stepone.cspRadioOptions().contains("CSP B").click();
    stepone.nextAddToBtn().click();
    cy.get("#step_01.v-stepper__step--error").should("be.visible");
  });

  it("Testcase9: Stepper validation for Step1:Green", () => {
    stepone.portfolioNameTextBox().type("Successful Portfolio");
    cy.scrollTo("center");
    stepone.dodComponent().first().click();
    stepone.cspRadioOptions().contains("CSP B").click();
    stepone.nextAddToBtn().click();
    cy.get("#step_01.v-stepper__step--complete.visited").should("be.visible");
  });
});
