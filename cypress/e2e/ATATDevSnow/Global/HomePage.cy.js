import { bootstrapMockApis,capitalizeFirstLetter} from "../../../helpers";
import lp from "../../../selectors/landingPage.sel";

describe("Test suite: Home Page ", () => { 

  const expectedEmail = Cypress.env("snowUser");
  const expectedNames = expectedEmail.split('-ctr')[0].split('.');
  const expectedFirstName = expectedNames[0];
  const firstName = capitalizeFirstLetter(expectedFirstName);
      
  beforeEach(() => {
    bootstrapMockApis();    
    cy.launchATAT(true);
  
  });

  it("TC1: Existing User Welcome Banner and Helpful Resources", () => {    
    cy.textExists(lp.welcomeBarText, "Hi " + firstName + "! How can we help you?");
    cy.findElement(".v-expansion-panel").should('have.attr', 'aria-expanded', "true").click();
      
    const alertText = "info Provisioning of cloud resources is not available at this time." +
      " In the coming weeks, you will be able to add an awarded JWCC task order, and" +
      " ATAT will create accounts and environments within your CSP portal.";
    cy.verifyTextMatches(lp.alert,alertText)
    cy.textExists(lp.helpResourceCardsHeaders, "What else could we help you with?");  
    const expectedButtons = [
      "JWCC Help Center",
      "Contact customer support",
      "Report a bug or technical issue"
    ]
    cy.verifyElementTextArray(lp.helpButtons, expectedButtons);
    
    
  });
    
  it.skip("TC2: Start JWCC acquisition package", () => {
    cy.textExists(lp.startSectionHeader, "Start building your JWCC acquisition package") 
    cy.textExists(lp.startAcqLearnMoreBtn, "Learn More").click().then(() => {
      cy.textExists(lp.prepAcqPackHeader, "Prepare your acquisition package online")
      cy.textExists(lp.prepAcqPackStartBtn, "Start your new acquisition package")
        .should("be.enabled").click().then(() => {
          cy.verifyPageHeader("Let’s start with basic info about your new acquisition");
        });
    });
    
  });

  it.skip("TC3: Start JWCC acquisition package", () => {
    cy.textExists(lp.existJWTCCToSection, "Already have an existing JWCC task order?"); 
    cy.textExists(lp.existJWTCCToSectionLearnMore, "Learn More").click().then(() => {
      cy.textExists(lp.provisionCloudTitle, "Provision your cloud resources").scrollIntoView()
      cy.textExists(lp.provisionBtn, "Provision new cloud resources").should("be.enabled");
    });
    
  });

});      
