import { bootstrapMockApis,randomAlphaNumeric,capitalizeFirstLetter } from "../../../helpers";
import projectOverview from "../../../selectors/projectOverview.sel";
import common from "../../../selectors/common.sel";
import lp from "../../../selectors/landingPage.sel";


describe("Test suite: Acquisition Package ", () => {    

  const expectedEmail = Cypress.env("snowUser");
  const expectedNames = expectedEmail.split('-ctr')[0].split('.');
  const expectedFirstName = expectedNames[0];
  const firstName = capitalizeFirstLetter(expectedFirstName);    
  let projectDetails;   
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("projectOverview").then((details) => {
      projectDetails = details;
    });
    
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption("#Radio_DITCO", "DITCO");
    cy.activeStep(common.subStepProjectOverviewTxt);
  });

  it("TC1: Acquisition Package Substeps on the Vertical Stepper", () => {
        
    //Verify the text of Acquistion Package details is visible 
    cy.textExists("#Step_AcquisitionPackageDetails .step-text", " Acquisition Package Details ");

    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");
    cy.textExists(common.subStepOrganizationTxt, " Organization ");
    cy.textExists(common.subStepContactInformationTxt, " Contact Information ");
            
  });
    
  it.only("TC2: Asserts on Let’s start with basic info about your new acquisition", () => {

    // lands on New Acquistion Package    
    cy.textExists(common.packageNameHeader, "New Acquisition");
        
    //Sub header
    cy.verifyPageHeader(" Let’s start with basic info about your new acquisition ");
        
    //label of the "Project/Requirement Title" text
    cy.textExists(projectOverview.projectTitleLabel, " Project/Requirement Title ");

    //tooltip
    const expectedText = "Provide a short, descriptive title of the work to be performed." +
      " This will be used to refer to this project within ATAT and across all acquisition" +
      " documents."        
    cy.hoverToolTip(projectOverview.toolTipBtn, projectOverview.toolTipTxt, expectedText);
        
    //Enter the Value
    const pt = "Step-1-ProjectTitle-" + randomAlphaNumeric(5)
    cy.verifyAcqPackageName(pt); 
        
    //label of the "Projectscope" text
    cy.textExists(projectOverview.scopeLabel, "What is the scope of your requirement?");
        
    //Enter What the scope requirement      
    cy.enterTextInTextField(projectOverview.scopeTxtBox, projectDetails.scope).click();
        
    //Assert Emergency declaration text          
    cy.findElement(projectOverview.emergencyDeclaration).then(($emergencytext) => {
      expect($emergencytext).to.have.text(
        " Is this requirement in support of an emergency declaration? "
      );
    });
        
    //Assert radio button
    cy.radioBtn(projectOverview.radioBtnNo, "NO").not("[disabled]");
        
    //select radio button
    cy.radioBtn(projectOverview.radioBtnYes, "YES").not("[disabled]")
      .click({ force: true });        
    //Project disclaimer
    cy.textExists(
      projectOverview.projDisLabel,
      " 2. Compliance with Military Service-specific policies ");
    cy.checkBoxOption(projectOverview.projDisChxkBox, "YES").click({force: true});
    //buttons that exists on the view
    cy.btnExists(common.backBtn, "Back");
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(projectOverview.projDisChxkBox);
    // cy.waitUntil(() => Cypress.$(projectOverview.projDisChxkBox).length === 0)   
    cy.verifyPageHeader(" Next, we’ll gather information about your organization ");
    cy.findElement(common.dashboardTab).click();
    cy.waitUntilElementIsGone(common.sideNavBar);
    // cy.waitUntil(() => Cypress.$(common.sideNavBar).length === 0);
    cy.textExists(lp.welcomeBarText, "Hi " + firstName + "! How can we help you?");
    cy.findElement(lp.acqPackageaccordion).should("exist");
    cy.textExists(lp.acqCard0,pt)

      
  });

  it("TC3: Validations on ProjectOverView", () => {
    //ProjectTitle is blank
    cy.findElement(projectOverview.projectTitleTxtBox).should("be.visible").clear()
      .focus().blur({ force: true }).then(() => {
        cy.checkErrorMessage(projectOverview.projectTitleError, "Please enter your project title");
      });
    const projectTitle = randomAlphaNumeric(61);
    //enter morethan 60 characters
    cy.findElement(projectOverview.projectTitleTxtBox).should("be.visible").clear()
      .type(projectTitle).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          projectOverview.projectTitleError,
          "Title cannot exceed 60 characters"
        );
      });
    //scope is blank      
    cy.findElement(projectOverview.scopeTxtBox).should("be.visible").clear()
      .focus().blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          projectOverview.scopeError,
          "Please describe the scope of your requirement"
        );
      })
    //morethan 300 
    const scope = randomAlphaNumeric(301);
    cy.findElement(projectOverview.scopeTxtBox).should("be.visible").clear().type(scope)
      .blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          projectOverview.scopeError,
          "Please limit your description to 300 characters or less"
        );
      });
    cy.findElement(projectOverview.scopeTxtBox).tab().tab().tab().then(() => {
      cy.checkErrorMessage(projectOverview.emergencyDeclarationControl, "Please select an option");
    });
  });

});      
