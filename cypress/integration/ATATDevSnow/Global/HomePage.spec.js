import { bootstrapMockApis} from "../../../helpers";
import lp from "../../../selectors/landingPage.sel";

describe("Test suite: Home Page ", () => { 
      
  beforeEach(() => {
    bootstrapMockApis();    
    cy.launchATAT();
  
  });

  it("TC1: Welcome Banner and Helpful Resources", () => {
    cy.textExists(lp.welcomeBarText, "Hi Maria! How can we help you?"); 
    cy.textExists(lp.helpfulResources, "Helpful Resources").click().then(() => {
      cy.findElement(lp.helpResourceCards).scrollIntoView().should("be.visible");
      cy.textExists("#HelpfulResourcesCards h3", "Helpful Resources");
      const expectedCards = [
        "JWCC",
        "DAPPS",
        "ATAT"
      ]
      cy.verifyElementTextArray(lp.helpResourceCardsHeaders, expectedCards);
    });
    
  });
    
  it("TC2: Start JWCC acquisition package", () => {
    cy.textExists(lp.startSectionHeader, "Start building your JWCC acquisition package") 
    cy.textExists(lp.startAcqLearnMoreBtn, "Learn More").click().then(() => {
      cy.textExists(lp.prepAcqPackHeader, "Prepare your acquisition package online")
      cy.textExists(lp.prepAcqPackStartBtn, "Start your new acquisition package")
        .should("be.enabled").click().then(() => {
          cy.verifyPageHeader("Let’s start with basic info about your new acquisition");
        });
    });
    
  });

  it("TC3: Start JWCC acquisition package", () => {
    cy.textExists(lp.existJWTCCToSection, "Already have an existing JWCC task order?"); 
    cy.textExists(lp.existJWTCCToSectionLearnMore, "Learn More").click().then(() => {
      cy.textExists(lp.provisionCloudTitle, "Provision your cloud resources").scrollIntoView()
      cy.textExists(lp.provisionBtn, "Provision new cloud resources").should("be.enabled");
    });
    
  });

});      
